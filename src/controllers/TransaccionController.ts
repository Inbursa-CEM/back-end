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
    this.router.post("/getTransacciones", this.getTransacciones.bind(this));
    this.router.post("/getTransaccion", this.getTransaccion.bind(this));
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

  private async getTransaccion(req: Request, res: Response) {
    try {
      const idTransaccion = req.body.idTransaccion;
      const numCuenta = req.body.numCuenta;
      const transaccion = await db.Transaccion.findOne({
        attributes:["idTransaccion", "monto", "fecha", "detalle", "estatus", "nombre"],
        where: {
          idTransaccion: idTransaccion,
          numCuenta: numCuenta,
        },
      });
      if (!transaccion) {
        return res  
          .status(404)
          .send("Transaccion no encontrada");
      }
      console.log("Transaccion encontrada")
      res.status(200).json(transaccion);
    } catch (err) {
      console.error
      res.status(500).send("Error al obtener transaccion");
    }
  }
}



export default TransaccionController;
