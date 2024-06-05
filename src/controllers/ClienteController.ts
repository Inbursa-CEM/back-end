import { Request, Response, NextFunction } from "express";
import AbstractController from "./AbstractController";
import db from "../models";
import jwt from "jsonwebtoken";

// Interfaz que extiende la Request de Express para incluir información del usuario autenticado
interface AuthenticatedRequest extends Request {
  user?: { id: number };
}

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
    this.router.get("/consultar/:telefono",this.getConsultar.bind(this));
    this.router.post("/getDatosCliente", this.getDatosCliente.bind(this));
  }

  private async getConsultar(req: Request, res: Response) {
    try {
      console.log("Consultar clientes");
      const telefono = req.params.telefono;
      if (!telefono) {
        return res
          .status(400)
          .send("El parámetro número de cliente es requerido");
      }

      // Buscar al cliente por su número
      let cliente = await db["Cliente"].findOne({
        where: { telefono: telefono }
      });
      if (!cliente) {
        return res.status(404).send("Cliente no encontrado");
      }
      res.status(200).json(cliente);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error al consultar cliente");
    }
  }

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

  

  // Middleware para autenticar JWT
  private authenticateJWT(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    const token = req.headers.authorization?.split(" ")[1]; // Obtener el token de la cabecera de autorización

    // Si no hay token, enviar un error 401
    if (!token) {
      return res.status(401).send("Acceso denegado. Token no proporcionado.");
    }

    try {
      // Verificar el token usando la clave secreta
      const decoded = jwt.verify(token, "secret_key") as { id: number };
      req.user = decoded; // Añadir la información del usuario al objeto request
      next(); // Llamar a la siguiente función en la cadena de middleware
    } catch (err) {
      res.status(401).send("Token no válido."); // Enviar un error 401 si el token no es válido
    }
  }
}

export default ClienteController;
