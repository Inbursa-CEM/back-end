import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";

class ClienteController extends AbstractController {
  // Singleton
  // Atributos de clase
  private static _instance: ClienteController;
  public static get instance(): ClienteController {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new ClienteController("cliente");
    return this._instance;
  }

  protected initializeRoutes(): void {
    // this.router.get("/id", this.getId.bind(this));
  }

  // private async getId(req: Request, res: Response) {
  //   try {
  //     console.log("ClienteController works");
  //     res.send("ClienteController works");
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).send("Error al crear");
  //   }
  // }
}

export default ClienteController;
