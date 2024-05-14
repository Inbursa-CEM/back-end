import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";

class LlamadaController extends AbstractController {
  // Singleton
  // Atributos de clase
  private static _instance: LlamadaController;
  public static get instance(): LlamadaController {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new LlamadaController("llamada");
    return this._instance;
  }

  protected initializeRoutes(): void {
    // this.router.get("/numLlamadas", this.getnumLlamadas.bind(this));
  }

  // private async getnumLlamadas(req: Request, res: Response) {
  //   try {
  //     console.log("UsuarioController works");
  //     res.status(200).send("UsuarioController works");
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).send("Error en UsuarioController");
  //   }
  // }
}

export default LlamadaController;
