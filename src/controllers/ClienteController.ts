import { Request, Response, NextFunction } from "express";
import AbstractController from "./AbstractController";
import db from "../models";

class ClienteController extends AbstractController {
  private static _instance: ClienteController;

  public static get instance(): ClienteController {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new ClienteController("cliente");
    return this._instance;
  }

  protected initializeRoutes(): void {
    this.router.get("/consultar/:telefono", this.getConsultar.bind(this));
    this.router.post("/getDatosCliente", this.getDatosCliente.bind(this));
  }

  private async getConsultar(req: Request, res: Response) {
    try {
      console.log("Consultar clientes");
      const telefono = req.params.telefono;
      if (!telefono) {
        return res
          .status(400)
          .send("El parámetro número de cliente es requerido");
      }

      let cliente = await db["Cliente"].findOne({
        where: { telefono: telefono },
      });
      if (!cliente) {
        return res.status(404).send("Cliente no encontrado");
      }
      res.status(200).json(cliente);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error al consultar cliente");
    }
  }

  private async getDatosCliente(req: Request, res: Response) {
    try {
      const correo = req.body.correo;
      const password = req.body.password;
      const cliente = await db.Cliente.findOne({
        attributes: ["idCliente", "nombre", "correo"],
        where: {
          correo: correo,
          password: password,
        },
      });

      if (!cliente) {
        res.status(404).send("Cliente no encontrado");
        return;
      }

      console.log("Se inició sesión con cliente");
      res.status(200).json(cliente);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en Cliente login");
    }
  }
}

export default ClienteController;
