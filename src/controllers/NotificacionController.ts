import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";

class NotificacionController extends AbstractController {
  private static _instance: NotificacionController;
  public static get instance(): NotificacionController {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new NotificacionController("agente");
    return this._instance;
  }

  protected initializeRoutes(): void {
    this.router.post(
      "/mandarNotificacion",
      this.postMandarNotificacion.bind(this)
    );
    this.router.get(
      "/obtenerNotificaciones",
      this.getObtenerNotificaciones.bind(this)
    );
  }

  private async postMandarNotificacion(req: Request, res: Response) {
    try {
      console.log("Notifiación enviada");
    } catch (err) {
      console.error(err);
    }
  }
  private async getObtenerNotificaciones(req: Request, res: Response) {
    try {
      console.log("Notificaciones obtenidas");
    } catch (err) {
      console.error(err);
    }
  }
}

export default NotificacionController;
