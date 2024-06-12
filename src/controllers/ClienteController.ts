import { Request, Response, NextFunction } from "express";
import AbstractController from "./AbstractController";
import db from "../models";
import jwt from "jsonwebtoken";

// Clase ClienteController que extiende de AbstractController
class ClienteController extends AbstractController {
  private static _instance: ClienteController;

  // Método estático para obtener la instancia única de ClienteController
  public static get instance(): ClienteController {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new ClienteController("cliente");
    return this._instance;
  }

  // Método para inicializar las rutas del controlador
  protected initializeRoutes(): void {
    this.router.post("/getDatosCliente", this.getDatosCliente.bind(this));
  }

  // Método para obtener los datos del cliente
  private async getDatosCliente(req: Request, res: Response) {
    try {
      const correo = req.body.correo; // Obtener el correo del cuerpo de la solicitud
      const password = req.body.password; // Obtener la contraseña del cuerpo de la solicitud
      // Buscar un cliente en la base de datos con el correo y la contraseña proporcionados
      const cliente = await db.Cliente.findOne({
        attributes: ["idCliente", "nombre", "correo"], // Atributos que se devolverán
        where: {
          correo: correo,
          password: password,
        },
      });

      // Si no se encuentra ningún cliente, enviar un error 404
      if (!cliente) {
        res.status(404).send("Cliente no encontrado");
        return;
      }

      // Log para indicar que se ha iniciado sesión con un cliente
      console.log("Se inició sesión con cliente");
      res.status(200).json(cliente); // Devolver los datos del cliente en la respuesta
    } catch (error) {
      console.log(error); // Log del error
      res.status(500).send("Error en Cliente login"); // Enviar un error 500 si algo falla
    }
  }
}

export default ClienteController;
