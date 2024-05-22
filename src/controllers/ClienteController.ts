import { Request, Response, NextFunction } from "express";
import AbstractController from "./AbstractController";
import db from "../models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: { id: number };
}

class ClienteController extends AbstractController {
  // Singleton
  // Atributos de clase
  private static _instance: ClienteController;
  public static get instance(): ClienteController {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new ClienteController("cliente");
    return this._instance;
  }

  protected initializeRoutes(): void {
    this.router.post("/getDatosCliente", this.getDatosCliente.bind(this));
    
    // this.router.post("/cargarClientes", this.cargarClientes.bind(this));
    // this.router.get("/login", this.login.bind(this));
    this.router.get(
      "/perfil",
      this.authenticateJWT.bind(this),
      // this.getPerfil.bind(this)
    );
    this.router.get(
      "/logout",
      this.authenticateJWT.bind(this),
      // this.logout.bind(this)
    );
  }

  private async getDatosCliente(req: Request, res: Response) {
    try {
      const correo = req.body.correo;
      const password = req.body.password;
      const cliente = await db.Cliente.findOne({
        attributes: ["idCliente", "nombre", "correo"],
        where: {
          correo: correo,
          password: password,
        },
      });
      if (cliente.length === 0) {
        res.status(404).send("Cliente no encontrado");
        return;
      }
      console.log("Se inició sesión con cliente");
      res.status(200).json(cliente);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en Cliente login");
    }
  }

  // private async cargarClientes(req: Request, res: Response) {
  //   try {
  //     const clientes = req.body;
  //     if (!Array.isArray(clientes)) {
  //       return res.status(400).send("Se espera un arreglo de clientes");
  //     }

  //     const clientesCreados = [];
  //     for (const cliente of clientes) {
  //       const { nombre, correo, password, telefono } = cliente;
  //       if (!nombre || !correo || !password || !telefono) {
  //         return res
  //           .status(400)
  //           .send("Todos los campos son requeridos para cada cliente");
  //       }

  //       const hashedPassword = await bcrypt.hash(password, 10);
  //       const nuevoCliente = await db.Cliente.create({
  //         nombre,
  //         correo,
  //         password: hashedPassword, // quitar
  //         telefono,
  //       });
  //       clientesCreados.push(nuevoCliente);
  //     }

  //     res.status(201).json(clientesCreados);
  //   } catch (err) {
  //     console.error("Error al cargar clientes:", err);
  //     res.status(500).send("Error al cargar clientes");
  //   }
  // }

  // private async login(req: Request, res: Response) {
  //   try {
  //     const { correo, password } = req.query;
  //     if (!correo || !password) {
  //       return res.status(400).send("Correo y contraseña son requeridos");
  //     }

  //     const cliente = await db.Cliente.findOne({ where: { correo } });
  //     if (!cliente) {
  //       console.log("Cliente no encontrado");
  //       return res.status(404).send("Cliente no encontrado");
  //     }

  //     const isPasswordValid = await bcrypt.compare(
  //       password as string,
  //       cliente.password
  //     );
  //     if (!isPasswordValid) {
  //       console.log("Contraseña incorrecta");
  //       return res.status(401).send("Contraseña incorrecta");
  //     }

  //     const token = jwt.sign({ id: cliente.id }, "secret_key", {
  //       expiresIn: "1h",
  //     });
  //     res.status(200).json({ token });
  //   } catch (err) {
  //     console.error("Error al iniciar sesión:", err);
  //     res.status(500).send("Error al iniciar sesión");
  //   }
  // }

  // private async getPerfil(req: AuthenticatedRequest, res: Response) {
  //   try {
  //     const clienteId = req.user?.id;
  //     if (!clienteId) {
  //       return res.status(401).send("Acceso no autorizado");
  //     }

  //     const cliente = await db.Cliente.findByPk(clienteId);
  //     if (!cliente) {
  //       return res.status(404).send("Cliente no encontrado");
  //     }

  //     res.status(200).json(cliente);
  //   } catch (err) {
  //     console.error("Error al obtener el perfil del cliente:", err);
  //     res.status(500).send("Error al obtener el perfil del cliente");
  //   }
  // }

  // private async logout(req: Request, res: Response) {
  //   try {
  //     // Aquí puedes manejar la lógica para el cierre de sesión, como invalidar el token
  //     res.status(200).send("Sesión cerrada");
  //   } catch (err) {
  //     console.error("Error al cerrar sesión:", err);
  //     res.status(500).send("Error al cerrar sesión");
  //   }
  // }

  // Middleware para autenticar JWT
  private authenticateJWT(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).send("Acceso denegado. Token no proporcionado.");
    }

    try {
      const decoded = jwt.verify(token, "secret_key") as { id: number };
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).send("Token no válido.");
    }
  }
}

export default ClienteController;
