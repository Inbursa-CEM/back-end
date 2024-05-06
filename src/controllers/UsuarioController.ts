import { Request, Response } from "express";
import AbstractController from "./AbstractController";

class UsuarioController extends AbstractController {
  private static _instance: UsuarioController;
  public static get instance(): UsuarioController {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new UsuarioController("usuario");
    return this._instance;
  }

  protected initializeRoutes(): void {
    this.router.post("/iniciarSesion", this.iniciarSesion.bind(this));
    this.router.post("/cerrarSesion", this.cerrarSesion.bind(this));
    this.router.post("/agendarOneOnOne", this.agendarOneOnOne.bind(this));
    this.router.get("/nombreUsuario", this.getnombreSupervisor.bind(this));
    this.router.get("/estadoUsuario", this.getestadoUsuario.bind(this));
    this.router.get("/telefonoUsuario", this.gettelefonoUsuario.bind(this));
    this.router.get("/correoUsuario", this.getcorreoUsuario.bind(this));
    this.router.get("/cursosUsuario", this.getcursosUsuario.bind(this));
    this.router.get(
      "/recomendacionesUsuario",
      this.getrecomendacionesUsuario.bind(this)
    );
  }

  private async iniciarSesion(req: Request, res: Response) {
    try {
      console.log("Se inicio sesión");
    } catch (error) {
      console.log(error);
    }
  }

  private async cerrarSesion(req: Request, res: Response) {
    try {
      console.log("Se cerró sesión");
    } catch (error) {
      console.log(error);
    }
  }

  private async agendarOneOnOne(req: Request, res: Response) {
    try {
      console.log("Se agendo sesión 1:1");
    } catch (error) {
      console.log(error);
    }
  }

  private async getnombreSupervisor(req: Request, res: Response) {
    try {
      console.log("UsuarioController works");
      res.status(200).send("UsuarioController works");
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en UsuarioController");
    }
  }

  private async getestadoUsuario(req: Request, res: Response) {
    try {
      console.log("UsuarioController works");
      res.status(200).send("UsuarioController works");
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en UsuarioController");
    }
  }

  private async gettelefonoUsuario(req: Request, res: Response) {
    try {
      console.log("UsuarioController works");
      res.status(200).send("UsuarioController works");
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en UsuarioController");
    }
  }

  private async getcorreoUsuario(req: Request, res: Response) {
    try {
      console.log("UsuarioController works");
      res.status(200).send("UsuarioController works");
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en UsuarioController");
    }
  }

  private async getcursosUsuario(req: Request, res: Response) {
    try {
      console.log("UsuarioController works");
      res.status(200).send("UsuarioController works");
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en UsuarioController");
    }
  }

  private async getrecomendacionesUsuario(req: Request, res: Response) {
    try {
      console.log("UsuarioController works");
      res.status(200).send("UsuarioController works");
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en UsuarioController");
    }
  }
}

export default UsuarioController;
