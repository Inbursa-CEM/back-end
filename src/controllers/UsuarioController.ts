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
    // POST
    this.router.post("/iniciarSesion", this.iniciarSesion.bind(this));
    this.router.post("/cerrarSesion", this.cerrarSesion.bind(this));

    // GET
    this.router.get("/infoActualAgentes", this.getInfoActualAgentes.bind(this));
    this.router.get(
      "/agentesDeSupervisor",
      this.getAgentesBySupervisor.bind(this)
    );
    this.router.get("/especifico", this.getSpecificAgent.bind(this));
    this.router.get("/estatusAgente", this.getestatusAgente.bind(this));
  }

  private async iniciarSesion(req: Request, res: Response) {
    try {
      const correo = req.body.correo;
      const password = req.body.password;
      const usuario = await db.Usuario.findOne({
        attributes: ["idUsuario", "nombre", "rol", "urlFoto"],
        where: {
          correo: correo,
          password: password,
        },
      });
      if (usuario.length === 0) {
        res.status(404).send("Usuario no encontrado");
        return;
      }
      console.log("Se inició sesión");
      res.status(200).json(usuario);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en UsuarioController");
    }
  }

  private async cerrarSesion(req: Request, res: Response) {
    try {
      console.log("Se cerró sesión");
    } catch (error) {
      console.log(error);
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
          attributes: ["fechaFin"],
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
          }
        }
        return {
          id,
          nombreAgente,
          duracion,
          nombreCliente,
          saldoCliente,
        };
      });
      res.status(200).json(resultado);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en UsuarioController");
    }
  }

  private async getestatusAgente(req: Request, res: Response) {
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
          idSupervisor: idSupervisorTarget
        }
    });
  
      if (!agentes.length) {
        return res.status(404).send("No se encontraron agentes");
      }
  
      let activos = 0;
      let inactivos = 0;
  
      await Promise.all(agentes.map(async (agente: any) => {
        const ultimaLlamada = await db["Llamada"].findOne({
          where: {
            idUsuario: agente.idUsuario,
            fechaInicio: {
              [Op.gte]: today,
              [Op.lt]: tomorrow
            }
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
      }));
        return res.status(200).json({ activos, inactivos });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error en UsuarioController");
    }
  }
  
}

export default UsuarioController;
