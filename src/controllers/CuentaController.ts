import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";

// Clase CuentaController que extiende de AbstractController
class CuentaController extends AbstractController {
  // Atributo estático para implementar el patrón Singleton
  private static _instance: CuentaController;

  // Método estático para obtener la instancia única de CuentaController
  public static get instance(): CuentaController {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new CuentaController("cuenta");
    return this._instance;
  }

  // Método para inicializar las rutas del controlador
  protected initializeRoutes(): void {
    // Definición de la ruta POST para obtener cuentas por cliente
    this.router.post("/cuentas", this.getCuentasPorCliente.bind(this));
  }

  // Método para obtener las cuentas asociadas a un cliente
  private async getCuentasPorCliente(req: Request, res: Response) {
    try {
      // Obtener el id del cliente del cuerpo de la solicitud
      const idCliente = req.body.idCliente;

      // Buscar todas las cuentas en la base de datos asociadas al id del cliente
      const cuentas = await db.Cuenta.findAll({
        where: { idCliente: idCliente },
      });

      // Enviar las cuentas encontradas en la respuesta con un status 200
      res.status(200).json(cuentas);
    } catch (err) {
      // Manejo de errores: log del error y envío de una respuesta con status 500
      console.error("Error al obtener cuentas por cliente:", err);
      res.status(500).send("Error al obtener cuentas por cliente");
    }
  }
}

export default CuentaController;
