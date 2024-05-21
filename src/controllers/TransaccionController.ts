import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";

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
    this.router.post("/getTransaccion", this.getTransacciones.bind(this));
  }

  private async getTransacciones(req: Request, res: Response) {
    try {
      const numCuenta = req.body.numCuenta;
      const transacciones = await db.Transaccion.findAll({
        where: {
          numCuenta: numCuenta,
        },
      });
      res.status(200).json(transacciones);
    } catch (err) {
      console.error("Error al obtener transacciones por cuenta:", err);
      res.status(500).send

    }
  }
}

export default TransaccionController;
