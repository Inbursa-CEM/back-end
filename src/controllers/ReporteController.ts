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
    this.router.get("/consultar", this.getReporte.bind(this));
    this.router.get("/consultar/:idCliente", this.getByID.bind(this));
  }

  // Maneja la solicitud POST para crear un nuevo reporte
  private async postReporte(req: Request, res: Response) {
    try {
      const reporte = await db.Reporte.create(req.body);
      // Envía una respuesta con el reporte creado y un estado 200 (OK)
      res.status(200).send(reporte);
    } catch (err) {
      // Registra el error en la consola y envía una respuesta con un estado 500 (Error Interno del Servidor)
      console.error("Error al obtener transacciones por cuenta:", err);
      res.status(500).send;
    }
  }

  private async getReporte(req: Request, res: Response) {
    try {
      console.log("Consultar reportes");
      let reporte = await db["Reporte"].findAll();
      if (!reporte) {
        return res.status(404).send("Reporte no encontrado");
      }
      res.status(200).json(reporte);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error al consultar cliente");
    }
  }

  private async getByID(req: Request, res: Response) {
    try {
      console.log("Consultar reportes");
      const id = req.params.idCliente;
      if (!id) {
        return res
          .status(400)
          .send("El parámetro número de cliente es requerido");
      }

      // Buscar el reporte por el id del Cliente
      let reporte = await db["Reporte"].findOne({
        where: { idCliente: id },
      });
      if (!reporte) {
        return res.status(404).send("Reporte no encontrado");
      }
      res.status(200).json(reporte);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error al consultar reporte");
    }
  }
}

export default ReporteController;