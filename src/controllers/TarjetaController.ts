import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";

// Clase TarjetaController que extiende de AbstractController
class TarjetaController extends AbstractController {
  // Atributo estático para implementar el patrón Singleton
  private static _instance: TarjetaController;

  // Método estático para obtener la instancia única de TarjetaController
  public static get instance(): TarjetaController {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new TarjetaController("tarjeta");
    return this._instance;
  }

  // Método para inicializar las rutas del controlador
  protected initializeRoutes(): void {
    // Definición de la ruta POST para obtener una tarjeta específica
    this.router.post("/getTarjeta", this.getTarjeta.bind(this));
    // Definición de la ruta POST para obtener todas las tarjetas asociadas a una cuenta
    this.router.post("/getTarjetasxCuenta", this.getTarjetasPorCuenta.bind(this));
  }

  // Método para obtener una tarjeta específica basada en el número de cuenta
  private async getTarjeta(req: Request, res: Response) {
    try {
      // Obtener el número de cuenta del cuerpo de la solicitud
      const numCuenta = req.body.numCuenta;

      // Buscar una tarjeta en la base de datos con el número de cuenta proporcionado
      const tarjeta = await db.Tarjeta.findOne({
        attributes: ["tipo", "saldo", "idCuenta"], // Atributos que se devolverán
        where: { 
          numCuenta: numCuenta
        },
      });

      // Si no se encuentra ninguna tarjeta, enviar un error 404
      if (!tarjeta) {
        res.status(404).send("Tarjeta no encontrada");
        return;
      }

      // Log para indicar que se ha obtenido una tarjeta
      console.log("Se obtuvo tarjeta");
      res.status(200).json(tarjeta); // Devolver los datos de la tarjeta en la respuesta
    } catch (err) {
      // Manejo de errores: log del error y envío de una respuesta con status 500
      console.error("Error al obtener tarjeta:", err);
      res.status(500).send("Error al obtener tarjeta");
    }
  }

  // Método para obtener todas las tarjetas asociadas a una cuenta
  private async getTarjetasPorCuenta(req: Request, res: Response) {
    try {
      // Obtener el id de la cuenta del cuerpo de la solicitud
      const idCuenta = req.body.idCuenta;

      // Buscar todas las tarjetas en la base de datos asociadas al id de la cuenta
      const tarjetas = await db.Tarjeta.findAll({
        where: { 
          idCuenta: idCuenta
        },
      });

      // Enviar las tarjetas encontradas en la respuesta con un status 200
      res.status(200).json(tarjetas);
    } catch (err) {
      // Manejo de errores: log del error y envío de una respuesta con status 500
      console.error("Error al obtener tarjetas por cuenta:", err);
      res.status(500).send("Error al obtener tarjetas por cuenta");
    }
  }
}

export default TarjetaController;
