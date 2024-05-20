import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";

class NotificacionController extends AbstractController {
  // Singleton
  // Atributos de clase
  private static _instance: NotificacionController;
  public static get instance(): NotificacionController {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new NotificacionController("notificacion");
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
    this.router.post(
      "/mandarOneonOne",
      this.postMandarOneonOne.bind(this)
    );
    this.router.put(
      "/actualizarStatusNotificacion",
      this.putActualizarStatusNotificacion.bind(this)
    )
  }

  private async postMandarNotificacion(req: Request, res: Response) {
    try {
      console.log("Notifiación enviada");
    } catch (err) {
      console.error(err);
    }
  }

  private async postMandarOneonOne(req: Request, res: Response) {
    try {
      const newNotificacion = await db.Notificacion.create({
        idUsuario: req.body.idUsuario,
        contenido: req.body.contenido,
        fechaHora: new Date(), // obtiene la fecha y hora actual
        completada: false,
      });
      console.log("Notifiación enviada");
      res.status(200).json(newNotificacion);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error en NotificacionController" });
    }
  }

  private async getObtenerNotificaciones(req: Request, res: Response) {
    try {
      const idUsuario = req.params.idUsuario;
      const whereClause = idUsuario ? { idUsuario: idUsuario } : {};
      const notificaciones = await db.Notificacion.findAll({
        where: whereClause,
        order: [["fechaHora", "DESC"]],
      });
      console.log("Notificaciones obtenidas");
      res.send(notificaciones);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error en NotificacionController" });
    }
  }

  private async putActualizarStatusNotificacion(req: Request, res: Response) {
    try {
      const idNotificacion = req.query.idNotificacion;
      const notificacion = await db.Notificacion.findByPk(idNotificacion);
      {
        notificacion.completada = true;
        await notificacion.save();
        console.log("Notificación actualizada");
        res.status(200).json(notificacion);
      }
      // } else {
      //   res.status(404).json({ error: "Notificación no encontrada" });
      // }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error en NotificacionController" });
    }
  }
}

export default NotificacionController;
