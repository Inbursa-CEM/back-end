import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";

class LlamadaController extends AbstractController {
  // Singleton
  // Atributos de clase
  private static _instance: LlamadaController;
  public static get instance(): LlamadaController {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new LlamadaController("llamada");
    return this._instance;
  }

  protected initializeRoutes(): void {
    this.router.get("/numLlamadas", this.getnumLlamadas.bind(this));
    this.router.get("/fechaLlamada", this.getfechaLlamada.bind(this));
    this.router.get("/motivoLlamada", this.getmotivoLlamada.bind(this));
    this.router.get("/temaLlamada", this.gettemaLlamada.bind(this));
    this.router.get("/duracionLlamada", this.getduracionLlamada.bind(this));
    this.router.get("/nivelSatisfaccion", this.getnivelSatisfaccion.bind(this));
    this.router.get("/promedioDuracion", this.getpromedioDuracion.bind(this));
    this.router.get("/promedioServicio", this.getpromedioServicio.bind(this));
    this.router.get("/promedioLlamadas", this.getpromedioLlamadas.bind(this));
    this.router.get("/semaforo", this.getsemaforo.bind(this));
    this.router.get("/sentimiento", this.getsentimiento.bind(this));
  }

  private async getnumLlamadas(req: Request, res: Response) {
    try {
      console.log("UsuarioController works");
      res.status(200).send("UsuarioController works");
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en UsuarioController");
    }
  }

  private async getfechaLlamada(req: Request, res: Response) {
    try {
      console.log("UsuarioController works");
      res.status(200).send("UsuarioController works");
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en UsuarioController");
    }
  }

  private async getmotivoLlamada(req: Request, res: Response) {
    try {
      console.log("UsuarioController works");
      res.status(200).send("UsuarioController works");
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en UsuarioController");
    }
  }

  private async gettemaLlamada(req: Request, res: Response) {
    try {
      console.log("UsuarioController works");
      res.status(200).send("UsuarioController works");
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en UsuarioController");
    }
  }

  private async getduracionLlamada(req: Request, res: Response) {
    try {
      console.log("UsuarioController works");
      res.status(200).send("UsuarioController works");
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en UsuarioController");
    }
  }

  private async getnivelSatisfaccion(req: Request, res: Response) {
    try {
      console.log("UsuarioController works");
      res.status(200).send("UsuarioController works");
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en UsuarioController");
    }
  }

  private async getpromedioDuracion(req: Request, res: Response) {
    try {
      console.log("UsuarioController works");
      res.status(200).send("UsuarioController works");
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en UsuarioController");
    }
  }

  private async getpromedioServicio(req: Request, res: Response) {
    try {
      console.log("UsuarioController works");
      res.status(200).send("UsuarioController works");
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en UsuarioController");
    }
  }

  private async getpromedioLlamadas(req: Request, res: Response) {
    try {
      console.log("UsuarioController works");
      res.status(200).send("UsuarioController works");
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en UsuarioController");
    }
  }

  private async getsemaforo(req: Request, res: Response) {
    try {
      console.log("UsuarioController works");
      res.status(200).send("UsuarioController works");
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en UsuarioController");
    }
  }

  private async getsentimiento(req: Request, res: Response) {
    try {
      console.log("UsuarioController works");
      res.status(200).send("UsuarioController works");
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en UsuarioController");
    }
  }
}

export default LlamadaController;
