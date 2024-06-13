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

  // Método para obtener la lista de supervisores en la base de datos
  private async getSupervisores(req: Request, res: Response) {
    try {
      console.log("Consultando supervisores");
      // Busca todos los usuarios con rol de supervisor
      const supervisores = await db["Usuario"].findAll({
        attributes: ["idUsuario", "nombre"],
        where: {
          rol: "supervisor",
        },
      });
      // Responde con la lista de supervisores
      res.status(200).json(supervisores);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en UsuarioController");
    }
  }

  // Método para obtener la lista de agentes bajo un supervisor específico
  private async getAgentesBySupervisor(req: Request, res: Response) {
    try {
      const idSupervisorTarget = req.query.idSupervisor;
      console.log(
        "Consultando agentes por supervisor --> " + idSupervisorTarget
      );

      // Busca todos los usuarios con rol de agente bajo el supervisor especificado
      let agentes = await db["Usuario"].findAll({
        attributes: ["idUsuario", "nombre"],
        where: {
          idSupervisor: idSupervisorTarget,
          rol: "agente",
        },
      });

      // Responde con la lista de agentes
      res.status(200).json(agentes);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error en UsuarioController");
    }
  }

  // Método para obtener la información de un agente específico
  private async getSpecificAgent(req: Request, res: Response) {
    try {
      const agente = await db.Usuario.findByPk(req.query.idAgente);
      res.status(200).json(agente);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error en UsuarioController");
    }
  }

  // Método para obtener la información actual de los agentes
  // Si están en una llamada, se obtienen los datos de la llamada (duración, nombre del cliente, saldo del cliente, contactId)
  private async getInfoActualAgentes(req: Request, res: Response) {
    try {
      console.log("Consultando información de angentes");
      const supervisor = req.query.supervisor;
      const datos = await db["Usuario"].findAll({
        attributes: [
          "idUsuario",
          "nombre",
          [
            // Calcula la duración de la llamada actual en segundos
            db.sequelize.literal(
              "TIMESTAMPDIFF(SECOND, Llamada.fechaInicio, CONVERT_TZ(NOW(), @@session.time_zone, '-06:00'))"
            ),
            "duracionLlamada",
          ],
        ],
        where: {
          rol: "agente",
          idSupervisor: supervisor,
        },
        // Incluye la llamada actual del agente
        include: {
          model: db["Llamada"],
          attributes: ["fechaFin", "contactId"],
          where: {
            fechaFin: null,
          },
          as: "Llamada",
          required: false,
          // Incluye la transacción relacionada a la llamada
          include: {
            model: db["Transaccion"],
            as: "Transaccion",
            required: true,
            // Incluye la tarjeta relacionada a la transacción
            include: {
              model: db["Tarjeta"],
              as: "Tarjeta",
              attributes: ["saldo"],
              required: true,
              // Incluye la cuenta relacionada a la tarjeta
              include: {
                model: db["Cuenta"],
                as: "Cuenta",
                required: true,
                // Incluye el cliente relacionado a la cuenta
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

      // Mapea los datos para obtener solo los campos requeridos
      const resultado = datos.map((agente: any) => {
        const id = agente.idUsuario;
        const nombreAgente = agente.nombre;
        let contactId = null;
        let duracion = null;
        let nombreCliente = null;
        let saldoCliente = null;
        // Si el agente tiene una llamada activa, obtiene los datos de la llamada
        if (agente.Llamada.length > 0) {
          duracion = agente.getDataValue("duracionLlamada");
          nombreCliente = agente.Llamada[0].Transaccion.Tarjeta.Cuenta.Cliente.nombre;
          saldoCliente = agente.Llamada[0].Transaccion.Tarjeta.saldo;
          contactId = agente.Llamada[0].contactId;
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

      // Responde con los datos de los agentes
      res.status(200).json(resultado);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en UsuarioController");
    }
  }

  private async getEstatusAgente(req: Request, res: Response) {
    try {
      // Obtiene el id del supervisor del query parameter
      const idSupervisorTarget = req.query.idSupervisor;

      console.log("Obteniendo el estado de todos los agentes");

      // Configura el rango de fechas para hoy y mañana
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      // Busca todos los usuarios con rol de agente bajo el supervisor especificado
      const agentes = await db["Usuario"].findAll({
        attributes: ["idUsuario", "nombre"], // Solo selecciona idUsuario y nombre
        where: {
          rol: "agente",
          idSupervisor: idSupervisorTarget,
        },
      });

      // Si no se encuentran agentes, responde con un estado 404
      if (!agentes.length) {
        return res.status(404).send("No se encontraron agentes");
      }

      let activos = 0;
      let inactivos = 0;

      // Itera sobre cada agente y verifica su última llamada
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
            order: [["fechaInicio", "DESC"]], // Ordena por fechaInicio descendente
            attributes: ["fechaFin"],
          });
          // Verifica si el agente está activo (si la última llamada aún no ha terminado)
          const estaActivo = ultimaLlamada && ultimaLlamada.fechaFin === null;
          if (estaActivo) {
            activos++;
          } else {
            inactivos++;
          }
        })
      );

      // Responde con el conteo de agentes activos e inactivos
      return res.status(200).json({ activos, inactivos });
    } catch (err) {
      console.error(err);
      // En caso de error, responde con un estado 500
      res.status(500).send("Error en UsuarioController");
    }
  }

  private async updateMetaBySupervisor(req: Request, res: Response) {
    try {
      // Obtiene idSupervisor y meta del query o del body de la solicitud
      let { idSupervisor } = req.query;
      let { meta } = req.body;

      if (!meta && req.query.meta !== undefined) {
        meta = req.query.meta;
      }

      if (!idSupervisor && req.query.idSupervisor !== undefined) {
        idSupervisor = req.query.idSupervisor;
      }

      // Verifica si idSupervisor y meta están presentes
      if (!idSupervisor || meta === undefined) {
        return res
          .status(400)
          .json({ error: "idSupervisor y meta son requeridos" });
      }

      // Actualiza la meta de los usuarios supervisados por el idSupervisor
      const [updatedRows] = await db["Usuario"].update(
        { meta },
        {
          where: {
            idUsuario: Number(idSupervisor), // Filtra por idUsuario del supervisor
          },
        }
      );

      // Verifica si se actualizaron filas
      if (updatedRows === 0) {
        return res.status(404).json({
          error: "No se encontraron usuarios con el idUsuario proporcionado",
        });
      }

      // Responde con el número de filas actualizadas
      res.status(200).json({
        message: "Meta actualizada correctamente para los usuarios",
        updatedRows,
      });
    } catch (error) {
      console.log(error);
      // En caso de error, responde con un estado 500
      res.status(500).send("Error al actualizar la meta para los usuarios");
    }
  }

  private async getMetaBySupervisor(req: Request, res: Response) {
    try {
      // Obtiene idSupervisor del query parameter
      const { idSupervisor } = req.query;

      // Verifica si idSupervisor está presente
      if (!idSupervisor) {
        return res.status(400).json({ error: "idSupervisor es requerido" });
      }

      // Busca todos los usuarios bajo el supervisor especificado
      const usuarios = await db["Usuario"].findAll({
        attributes: ["idUsuario", "nombre", "meta"], // Selecciona idUsuario, nombre y meta
        where: {
          idUsuario: idSupervisor, // Filtra por idUsuario del supervisor
        },
      });

      // Si no se encuentran usuarios, responde con un estado 404
      if (usuarios.length === 0) {
        return res.status(404).json({
          error: "No se encontraron usuarios con el idUsuario proporcionado",
        });
      }

      // Responde con los datos de los usuarios encontrados
      res.status(200).json(usuarios);
    } catch (error) {
      console.log(error);
      // En caso de error, responde con un estado 500
      res.status(500).send("Error al obtener la meta para los usuarios");
    }
  }
}

export default UsuarioController;
