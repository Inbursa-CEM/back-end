import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";

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
  }

  // Método para obtener la lista de supervisores en la base de datos
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
  // Si están en una llamada, se obtienen los datos de la llamada (duracion, nombre del cliente, saldo del cliente, contactId)
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
              "TIMESTAMPDIFF(SECOND, Llamada.fechaInicio, CONVERT_TZ(NOW(), @@session.time_zone, '-06:00'))"
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
        let duracion = null;
        let nombreCliente = null;
        let saldoCliente = null;
        let contactId = null;
        if (agente.Llamada && agente.Llamada.length > 0) {
          const llamada = agente.Llamada[0];
          if (llamada.fechaFin === null) {
            duracion = agente.getDataValue("duracionLlamada");
            nombreCliente =
              llamada.Transaccion?.Tarjeta?.Cuenta?.Cliente?.nombre ?? null;
            saldoCliente = llamada.Transaccion?.Tarjeta?.saldo ?? null;
            contactId = llamada.contactId ?? null;
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
}

export default UsuarioController;
