import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";
import { Op } from "sequelize";

class UsuarioController extends AbstractController {
  // Singleton
  // Atributos de clase
  private static _instance: UsuarioController;
  public static get instance(): UsuarioController {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new UsuarioController("usuario");
    return this._instance;
  }

  protected initializeRoutes(): void {
    // GET
    this.router.get("/supervisores", this.getSupervisores.bind(this));
    this.router.get(
      "/infoActualAgentes",
      // this.authMiddleware.verifyToken,
      this.getInfoActualAgentes.bind(this)
    );
    this.router.get(
      "/agentesDeSupervisor",
      this.getAgentesBySupervisor.bind(this)
    );
    this.router.get("/especifico", this.getSpecificAgent.bind(this));
    this.router.get("/estatusAgente", this.getEstatusAgente.bind(this));
    this.router.get("/meta", this.getMetaBySupervisor.bind(this));
    this.router.get("/meta/actualizar", this.updateMetaBySupervisor.bind(this));
  }

  private async getSupervisores(req: Request, res: Response) {
    try {
      console.log("Consultando supervisores");
      const supervisores = await db["Usuario"].findAll({
        attributes: ["idUsuario", "nombre"],
        where: {
          rol: "supervisor",
        },
      });
      res.status(200).json(supervisores);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en UsuarioController");
    }
  }

  private async getAgentesBySupervisor(req: Request, res: Response) {
    try {
      const idSupervisorTarget = req.query.idSupervisor;
      console.log(
        "Consultando agentes por supervisor --> " + idSupervisorTarget
      );

      let agentes = await db["Usuario"].findAll({
        attributes: ["idUsuario", "nombre"],
        where: {
          idSupervisor: idSupervisorTarget,
          rol: "agente",
        },
      });

      res.status(200).json(agentes);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error en UsuarioController");
    }
  }

  private async getSpecificAgent(req: Request, res: Response) {
    try {
      const agente = await db.Usuario.findByPk(req.body.idAgente);
      res.status(200).json(agente);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error en UsuarioController");
    }
  }

  private async getInfoActualAgentes(req: Request, res: Response) {
    try {
      console.log("Consultando información de angentes");
      const supervisor = req.query.supervisor;
      const datos = await db["Usuario"].findAll({
        attributes: [
          "idUsuario",
          "nombre",
          [
            db.sequelize.literal(
              "TIMESTAMPDIFF(SECOND, Llamada.fechaInicio, NOW())"
            ),
            "duracionLlamada",
          ],
        ],
        where: {
          rol: "agente",
          idSupervisor: supervisor,
        },
        include: {
          model: db["Llamada"],
          attributes: ["fechaFin", "contactId"],
          as: "Llamada",
          include: {
            model: db["Transaccion"],
            as: "Transaccion",
            required: true,
            include: {
              model: db["Tarjeta"],
              as: "Tarjeta",
              attributes: ["saldo"],
              required: true,
              include: {
                model: db["Cuenta"],
                as: "Cuenta",
                required: true,
                include: {
                  model: db["Cliente"],
                  as: "Cliente",
                  required: true,
                  attributes: ["nombre"],
                },
              },
            },
          },
        },
      });
      const resultado = datos.map((agente: any) => {
        const id = agente.idUsuario;
        const nombreAgente = agente.nombre;
        let contactId = null;
        let duracion = null;
        let nombreCliente = null;
        let saldoCliente = null;
        if (agente.Llamada && agente.Llamada.length > 0) {
          const llamada = agente.Llamada[0];
          if (llamada.fechaFin === null) {
            duracion = agente.getDataValue("duracionLlamada");
            nombreCliente =
              llamada.Transaccion?.Tarjeta?.Cuenta?.Cliente?.nombre ?? null;
            saldoCliente = llamada.Transaccion?.Tarjeta?.saldo ?? null;
            contactId = llamada.contactId;
          }
        }
        return {
          id,
          nombreAgente,
          duracion,
          nombreCliente,
          saldoCliente,
          contactId,
        };
      });
      res.status(200).json(resultado);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en UsuarioController");
    }
  }

  private async getEstatusAgente(req: Request, res: Response) {
    try {
      const idSupervisorTarget = req.query.idSupervisor;

      console.log("Obteniendo el estado de todos los agentes");
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const agentes = await db["Usuario"].findAll({
        attributes: ["idUsuario", "nombre"],
        where: {
          rol: "agente",
          idSupervisor: idSupervisorTarget,
        },
      });

      if (!agentes.length) {
        return res.status(404).send("No se encontraron agentes");
      }

      let activos = 0;
      let inactivos = 0;

      await Promise.all(
        agentes.map(async (agente: any) => {
          const ultimaLlamada = await db["Llamada"].findOne({
            where: {
              idUsuario: agente.idUsuario,
              fechaInicio: {
                [Op.gte]: today,
                [Op.lt]: tomorrow,
              },
            },
            order: [["fechaInicio", "DESC"]],
            attributes: ["fechaFin"],
          });
          const estaActivo = ultimaLlamada && ultimaLlamada.fechaFin === null;
          if (estaActivo) {
            activos++;
          } else {
            inactivos++;
          }
        })
      );
      return res.status(200).json({ activos, inactivos });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error en UsuarioController");
    }
  }

  private async updateMetaBySupervisor(req: Request, res: Response) {
    try {
      let { idSupervisor } = req.query;
      let { meta } = req.body;

      if (!meta && req.query.meta !== undefined) {
        meta = req.query.meta;
      }

      if (!idSupervisor && req.query.idSupervisor !== undefined) {
        idSupervisor = req.query.idSupervisor;
      }

      if (!idSupervisor || meta === undefined) {
        return res
          .status(400)
          .json({ error: "idSupervisor y meta son requeridos" });
      }

      const [updatedRows] = await db["Usuario"].update(
        { meta },
        {
          where: {
            idUsuario: Number(idSupervisor), // Actualización aquí
          },
        }
      );

      if (updatedRows === 0) {
        return res.status(404).json({
          error: "No se encontraron usuarios con el idUsuario proporcionado",
        });
      }

      res.status(200).json({
        message: "Meta actualizada correctamente para los usuarios",
        updatedRows,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Error al actualizar la meta para los usuarios");
    }
  }

  private async getMetaBySupervisor(req: Request, res: Response) {
    try {
      const { idSupervisor } = req.query;

      if (!idSupervisor) {
        return res.status(400).json({ error: "idSupervisor es requerido" });
      }

      const usuarios = await db["Usuario"].findAll({
        attributes: ["idUsuario", "nombre", "meta"],
        where: {
          idUsuario: idSupervisor, // Actualización aquí
        },
      });

      if (usuarios.length === 0) {
        return res.status(404).json({
          error: "No se encontraron usuarios con el idUsuario proporcionado",
        });
      }

      res.status(200).json(usuarios);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error al obtener la meta para los usuarios");
    }
  }
}

export default UsuarioController;
