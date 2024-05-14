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
    this.router.post("/iniciarSesion", this.iniciarSesion.bind(this));
    this.router.post("/cerrarSesion", this.cerrarSesion.bind(this));
    this.router.get("/infoActualAgentes", this.getInfoActualAgentes.bind(this));
  }

    private async iniciarSesion(req: Request, res: Response) {
        try {
            console.log("Se inicio sesión");
        } catch (error) {
            console.log(error);
        }
    }

  private async cerrarSesion(req: Request, res: Response) {
    try {
      console.log("Se cerró sesión");
    } catch (error) {
      console.log(error);
    }
  }

  private async getInfoActualAgentes(req: Request, res: Response) {
    try {
      console.log("Consultando información de angentes");
      const supervisor = req.query.supervisor;
      const datos = await db["Usuario"].findAll({
        attributes: ["idUsuario", "nombre"],
        where: {
          rol: "agente",
          idSupervisor: supervisor,
          "$Llamada.fechaFin$": null,
        },
        include: {
          model: db["Llamada"],
          attributes: ["fechaInicio"],
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
        let fechaInicioLlamada = null;
        let nombreCliente = null;
        let saldoCliente = null;
        if (agente.Llamada && agente.Llamada.length > 0) {
          const llamada = agente.Llamada[0];
          fechaInicioLlamada = llamada.fechaInicio;
          nombreCliente = llamada.Transaccion.Tarjeta.Cuenta.Cliente.nombre
            ? llamada.Transaccion.Tarjeta.Cuenta.Cliente.nombre
            : null;
          saldoCliente =
            llamada.Transaccion &&
            llamada.Transaccion.Tarjeta &&
            llamada.Transaccion.Tarjeta.length > 0
              ? llamada.Transaccion.Tarjeta[0].saldo
              : null;
        }
        return {
          id,
          nombreAgente,
          fechaInicioLlamada,
          nombreCliente,
          saldoCliente,
        };
      });
      res.status(200).json(resultado);
    } catch (error) {
      console.log(error);
    }
  }
}

export default UsuarioController;
