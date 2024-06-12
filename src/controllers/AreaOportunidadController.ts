import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";

class AreaOportunidadController extends AbstractController {
  // Singleton
  // Atributos de clase
  private static _instance: AreaOportunidadController;
  public static get instance(): AreaOportunidadController {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new AreaOportunidadController("areaOportunidad");
    return this._instance;
  }

  protected initializeRoutes(): void {
    // POSTS
    this.router.post("/crear", this.postCrear.bind(this));

    // GETS
    this.router.get("/all", this.getAll.bind(this));
    this.router.get("/especifica", this.getSpecificArea.bind(this));
  }


  /**
   * POST -> Crear nueva área de oportunidad
   * ENDPOINT -> areaOportunidad/crear
   * 
   * PARAMETROS DE REQUEST:
   * - nombre
   * 
   * SIN DATOS EN RESPONSE
   * 
   */
  private async postCrear(req: Request, res: Response) {
    try {
      await db.AreaOportunidad.create(req.body);
      console.log("Area de Oportunidad creada");
      res.status(200).send("AO creada :)");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error en AreaOportunidad Controller");
    }
  }

  
  /**
   * GET -> Obtener todas las áreas de oportunidad existentes
   * ENDPOINT -> areaOportunidad/all
   * 
   * NO PARAMETROS EN REQUEST
   * 
   * RESPONSE:
   * Lista con:
   * - idArea
   * - nombre 
   * de todas las áreas
   * 
   * 
   */
  private async getAll(req: Request, res: Response) {
    try {
      console.log("Obteniendo todas las áreas de oportunidad");
      let areas = await db["AreaOportunidad"].findAll();
      res.status(200).json(areas);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error en AreaOportunidad Controller");
    }
  }

  
  /**
   * GET -> Obtener toda la información de una área de oportunidad
   * ENDPOINT -> areaOportunidad/especifica
   * 
   * PARAMETROS DE REQUEST:
   * - idArea
   * 
   * RESPONSE:
   * - idArea
   * - nombre
   * 
   * 
   */
  private async getSpecificArea(req: Request, res: Response) {
    try {
      const area = await db.AreaOportunidad.findByPk(req.body.idArea);
      res.status(200).json(area);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error en Recomendación controller");
    }
  }
}

export default AreaOportunidadController;
