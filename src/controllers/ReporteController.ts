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

  // Inicializa las rutas para el controlador de reportes
  protected initializeRoutes(): void {
    this.router.post("/postReporte", this.postReporte.bind(this));
  }

  // Maneja la solicitud POST para crear un nuevo reporte
  private async postReporte(req: Request, res: Response) {
    try {
      // Crea un nuevo reporte en la base de datos con los datos del cuerpo de la solicitud
      const reporte = await db.Reporte.create(req.body);
      // Envía una respuesta con el reporte creado y un estado 200 (OK)
      res.status(200).send(reporte);
    } catch (err) {
      // Registra el error en la consola y envía una respuesta con un estado 500 (Error Interno del Servidor)
      console.error("Error al obtener transacciones por cuenta:", err);
      res.status(500).send
    }
  } 
}
export default ReporteController;