import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";

class ReporteController extends AbstractController {
  // Singleton
  // Atributos de clase
  private static _instance: ReporteController;
  public static get instance(): ReporteController {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new ReporteController("reporte");
    return this._instance;
  }

  protected initializeRoutes(): void {
    this.router.post("/postReporte", this.postReporte.bind(this));
  }

  private async postReporte(req: Request, res: Response) {
    try {

      const reporte = await db.Reporte.create(req.body);
      res.status(200).send(reporte);
    } catch (err) {
      console.error("Error al obtener transacciones por cuenta:", err);
      res.status(500).send

    }
  }

  
}



export default ReporteController;
