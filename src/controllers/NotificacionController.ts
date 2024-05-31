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
    this.router.post(
      "/mandarSolicitudAyuda",
      this.postMandarSolicitudAyuda.bind(this)
    );
    this.router.get(
      "/obtenerSolicitudAyuda", 
      this.getObtenerSolicitudAyuda.bind(this)
    );

    this.router.get(
      "/obtenerNotificaciones",
      this.getObtenerNotificaciones.bind(this)
    );
    this.router.post("/mandarOneonOne", this.postMandarOneonOne.bind(this));
  }

  private async postMandarNotificacion(req: Request, res: Response) {
    try {
      console.log("Notifiación enviada");
    } catch (err) {
      console.error(err);
    }
  }

  private async postMandarSolicitudAyuda(req: Request, res:Response){
    try{
      
      const newSolicitudAyuda = await db.Notificacion.create({
        idUsuario: req.body.idUsuario,
        contenido: req.body.contenido,
        fechaHora: new Date(),
        completada: true
      });
      console.log("Notifiación enviada");
      res.status(200).json(newSolicitudAyuda);
    } catch(err){
      console.log(err)
      res.status(500).json({error:"Error al NotificacionController"})
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

   //notificacion/obtenerSolicitudAyuda?idUsuario=2
  private async getObtenerSolicitudAyuda(req: Request, res: Response){
    try{
      const idUsuario = req.query.idUsuario; 
      const fechaActual = await db.sequelize.query("SELECT CURRENT_DATE AS fecha_actual", { type: db.sequelize.QueryTypes.SELECT });
      const fecha = fechaActual[0].fecha_actual;

      const solicitudAyuda = await db["Notificacion"].findAll({
        where:{
          idUsuario: idUsuario, 
          fechaHora: {
            [db.Sequelize.Op.between]: [
              `${fecha} 00:00:00`,
              `${fecha} 23:59:59`,
            ],
          },
        },
        order: [["fechaHora", "DESC"]]
      });
      res.status(200).json(solicitudAyuda);
    } catch(error){
      res.status(500).send("Error en Notificacion Controller")
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
}

export default NotificacionController;
