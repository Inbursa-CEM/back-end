import { Request, Response } from "express";
import AbstractController from "./AbstractController";

class TransaccionController extends AbstractController {
  // Singleton
  // Atributos de clase
  private static _instance: TransaccionController;
  public static get instance(): TransaccionController {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new TransaccionController("transaccion");
    return this._instance;
  }

  protected initializeRoutes(): void {
    // this.router.get("/fechaTransaccion", this.getfechaTransaccion.bind(this));
  }

  // private async getfechaTransaccion(req: Request, res: Response) {
  //   try {
  //     console.log("TransaccionController works");
  //     res.status(200).send("TransaccionController works");
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).send("Error en TransaccionController");
  //   }
  // }
}

export default TransaccionController;
