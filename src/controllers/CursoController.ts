import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";

class CursoController extends AbstractController {
  // Singleton
  // Atributos de clase
  private static _instance: CursoController;
  public static get instance(): CursoController {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new CursoController("curso");
    return this._instance;
  }

  protected initializeRoutes(): void {
    // POSTS
    this.router.post("/crear", this.postCrear.bind(this));
    this.router.post("/asignar", this.postAsignarCurso.bind(this));
    this.router.post("/desasignar", this.postDesasignarCurso.bind(this));
    this.router.post(
      "/modificarAsignacion",
      this.postModificarAsignacion.bind(this)
    );

    // GETS
    this.router.get("/asignados", this.GetAllByAgente.bind(this));
    this.router.get("/porArea", this.GetAllByArea.bind(this));
    this.router.get("/especifico", this.getSpecificCurso.bind(this));
  }

  
  /**
   * POST -> Crear un nuevo curso
   * ENDPOINT -> curso/crear
   * 
   * PARAMETROS DE REQUEST:
   * - nombre
   * - descripcion
   * - url
   * - idAreasOportunidad[]
   * 
   * SIN DATOS EN RESPONSE
   * 
   * 
   */
  private async postCrear(req: Request, res: Response) {
    try {
      const newCurso = await db.Curso.create(req.body);

      // AQUI SE CREAN LAS ASOCIACIONES
      await newCurso.addAreaOportunidad(req.body.idAreasOportunidad);

      console.log("Curso creado");
      res.status(200).send("Curso creado :)");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error en Curso Controller");
    }
  }

  
  /**
   * GET -> Obtener cursos asignados a un agente
   * ENDPOINT -> curso/asignados
   * 
   * PARAMETROS DE REQUEST:
   * - idAgente
   * 
   * RESPONSE:
   * Lista con:
   * - idCurso
   * - nombre
   * - url
   * - descripcion
   * - prioridad
   * - estado
   * - fecha 
   * de todos los cursos asignados a ese agente
   * 
   * 
   */
  private async GetAllByAgente(req: Request, res: Response) {
    try {
      const idAgenteTarget = req.query.idAgente;
      console.log("Consultado Cursos del agente --> " + idAgenteTarget);

      let queryCompleta = await db["Usuario"].findAll({
        where: { idUsuario: idAgenteTarget },
        include: {
          model: db.Curso,
        },
      });

      const cursos = queryCompleta[0].Cursos.map((curso: any) => {
        const idCurso = curso.idCurso;
        const nombre = curso.nombre;
        const url = curso.url;
        const descripcion = curso.descripcion;
        const prioridad = curso.UsuarioCurso.prioridad;
        const estado = curso.UsuarioCurso.estado;
        const fecha = curso.UsuarioCurso.fecha;

        return {
          idCurso,
          nombre,
          url,
          descripcion,
          prioridad,
          estado,
          fecha,
        };
      });

      res.status(200).json(cursos);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error en Curso Controller");
    }
  }

  /**
   * GET -> Obtener todos los cursos de una área en específico
   * ENDPOINT -> curso/porArea
   * 
   * PARAMETROS DE REQUEST:
   * - idArea
   * 
   * RESPONSE:
   * Lista con:
   * - idCurso
   * - nombre
   * - url
   * - descripcion
   * de todos los cursos pertenecientes a esa área
   * 
   * 
   */
  private async GetAllByArea(req: Request, res: Response) {
    try {
      const idAreaTarget = req.query.idArea;
      console.log("Consultado Cursos del área --> " + idAreaTarget);

      let queryCompleta = await db["AreaOportunidad"].findAll({
        where: { idArea: idAreaTarget },
        include: {
          model: db.Curso,
        },
      });

      const cursos = queryCompleta[0].Cursos.map((curso: any) => {
        const idCurso = curso.idCurso;
        const nombre = curso.nombre;
        const url = curso.url;
        const descripcion = curso.descripcion;

        return {
          idCurso,
          nombre,
          url,
          descripcion,
        };
      });

      res.status(200).json(cursos);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error en Curso Controller");
    }
  }

  /**
   * GET -> Obtener toda la información de un curso
   * ENDPOINT -> curso/especifico
   * 
   * PARAMETROS DE REQUEST:
   * - idCurso
   * 
   * RESPONSE:
   * - idCurso
   * - nombre
   * - url
   * - descripcion
   * 
   * 
   */
  private async getSpecificCurso(req: Request, res: Response) {
    try {
      const curso = await db.Curso.findByPk(req.body.idCurso);
      res.status(200).json(curso);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error en Curso controller");
    }
  }

  /**
   * POST -> Asignar un curso a un agente
   * ENDPOINT -> curso/asignar
   * 
   * PARAMETROS DE REQUEST:
   * - idUsuario
   * - idCurso
   * 
   * SIN DATOS EN RESPONSE
   * 
   * 
   */
  private async postAsignarCurso(req: Request, res: Response) {
    try {
      const asignacion = await db.UsuarioCurso.create(req.body);
      console.log("Asignación exitosa");
      res.status(200).json("Asignación exitosa :)");
    } catch (err) {
      console.log("ahua");
      console.log(err);
      res.status(500).send("Error en Curso Controller");
    }
  }

  /**
   * POST -> Desasignarle un curso a un agente
   * ENDPOINT -> curso/desasignar
   * 
   * PARAMETROS DE REQUEST:
   * - idAgente
   * - idCurso
   * 
   * SIN DATOS EN RESPONSE
   * 
   * 
   */
  private async postDesasignarCurso(req: Request, res: Response) {
    try {
      const desasignacion = await db.UsuarioCurso.destroy({
        where: {
          idCurso: req.body.idCurso,
          idUsuario: req.body.idAgente,
        },
      });

      console.log("Desasignación exitosa");
      res.status(200).json("Desasignación exitosa :)");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error en Curso Controller");
    }
  }

  /**
   * POST -> Modificar asignación de un curso de un agente
   * ENDPOINT -> curso/modificarAsignacion
   * 
   * PARAMETROS DE REQUEST:
   * - idAgente
   * - idCurso
   * - newPrioridad
   * - newEstado
   * - newFecha"
   * 
   * SIN DATOS EN RESPONSE
   * 
   * 
   */
  private async postModificarAsignacion(req: Request, res: Response) {
    try {
      const newAsignacion = await db.UsuarioCurso.update(
        {
          prioridad: req.body.newPrioridad,
          estado: req.body.newEstado,
          fecha: req.body.newFecha,
        },
        {
          where: {
            idUsuario: req.body.idAgente,
            idCurso: req.body.idCurso,
          },
        }
      );

      console.log("Asignación modificada");
      res.status(200).send("Asignación modificada :)");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error en Curso Controller");
    }
  }

  
}

export default CursoController;
