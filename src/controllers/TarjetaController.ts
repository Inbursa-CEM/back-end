import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";

class TarjetaController extends AbstractController {
  // Singleton
  private static _instance: TarjetaController;
  public static get instance(): TarjetaController {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new TarjetaController("tarjeta");
    return this._instance;
  }

  protected initializeRoutes(): void {
    this.router.post("/getTarjeta", this.getTarjeta.bind(this));
    this.router.post("/getTarjetasxCuenta", this.getTarjetasPorCuenta.bind(this));
  }

  private async getTarjeta(req: Request, res: Response) {
    try {
      const numCuenta = req.body.numCuenta;
      const tarjeta = await db.Tarjeta.findOne({
        attributes: ["tipo", "saldo", "idCuenta"],
        where: { 
          numCuenta: numCuenta
        },
      });
      if (!tarjeta) {
        res.status(404).send("Tarjeta no encontrada");
        return;
      }
      console.log("Se obtuvo tarjeta");
      res.status(200).json(tarjeta);
    } catch (err) {
      console.error("Error al obtener tarjeta:", err);
      res.status(500).send("Error al obtener tarjeta");
    }
  }

  private async getTarjetasPorCuenta(req: Request, res: Response) {
    try {
      const idCuenta = req.body.idCuenta;
      const tarjetas = await db.Tarjeta.findAll({
        where: { 
          idCuenta: idCuenta
        },
      });

      res.status(200).json(tarjetas);
    } catch (err) {
      console.error("Error al obtener tarjetas por cuenta:", err);
      res.status(500).send("Error al obtener tarjetas por cuenta");
    }
  }
}

export default TarjetaController;
