import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";

// Clase TransaccionController que extiende de AbstractController
class TransaccionController extends AbstractController {
  // Atributo estático para implementar el patrón Singleton
  private static _instance: TransaccionController;

  // Método estático para obtener la instancia única de TransaccionController
  public static get instance(): TransaccionController {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new TransaccionController("transaccion");
    return this._instance;
  }

  // Método para inicializar las rutas del controlador
  protected initializeRoutes(): void {
    // Definición de la ruta POST para obtener todas las transacciones de una cuenta
    this.router.post("/getTransacciones", this.getTransacciones.bind(this));
    // Definición de la ruta POST para obtener una transacción específica
    this.router.post("/getTransaccion", this.getTransaccion.bind(this));
  }

  // Método para obtener todas las transacciones asociadas a una cuenta específica
  private async getTransacciones(req: Request, res: Response) {
    try {
      // Obtener el número de cuenta del cuerpo de la solicitud
      const numCuenta = req.body.numCuenta;

      // Buscar todas las transacciones en la base de datos asociadas al número de cuenta
      const transacciones = await db.Transaccion.findAll({
        where: {
          numCuenta: numCuenta,
        },
      });

      // Enviar las transacciones encontradas en la respuesta con un status 200
      res.status(200).json(transacciones);
    } catch (err) {
      // Manejo de errores: log del error y envío de una respuesta con status 500
      console.error("Error al obtener transacciones por cuenta:", err);
      res.status(500).send("Error al obtener transacciones por cuenta");
    }
  }

  // Método para obtener una transacción específica basada en el ID de transacción y el número de cuenta
  private async getTransaccion(req: Request, res: Response) {
    try {
      // Obtener el ID de la transacción y el número de cuenta del cuerpo de la solicitud
      const idTransaccion = req.body.idTransaccion;
      const numCuenta = req.body.numCuenta;

      // Buscar una transacción en la base de datos con el ID de transacción y el número de cuenta proporcionados
      const transaccion = await db.Transaccion.findOne({
        attributes: ["idTransaccion", "monto", "fecha", "detalle", "estatus", "nombre"], // Atributos que se devolverán
        where: {
          idTransaccion: idTransaccion,
          numCuenta: numCuenta,
        },
      });

      // Si no se encuentra ninguna transacción, enviar un error 404
      if (!transaccion) {
        return res.status(404).send("Transacción no encontrada");
      }

      // Log para indicar que se ha encontrado una transacción
      console.log("Transacción encontrada");
      res.status(200).json(transaccion); // Devolver los datos de la transacción en la respuesta
    } catch (err) {
      // Manejo de errores: log del error y envío de una respuesta con status 500
      console.error("Error al obtener transacción:", err);
      res.status(500).send("Error al obtener transacción");
    }
  }
}

export default TransaccionController;
