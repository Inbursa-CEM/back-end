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
    this.router.post("/cambiarEstado", this.postCambiarEstado.bind(this));
    this.router.post("/asignar", this.postAsignarCurso.bind(this));
    this.router.post("/desasignar", this.postDesasignarCurso.bind(this));
    this.router.post(
      "/modificarAsignacion",
      this.postModificarAsignacion.bind(this)
    );

    // GETS
    this.router.get("/infoCompleta", this.getInfoCompleta.bind(this));
    this.router.get("/agentesConCurso", this.getAgentesConCurso.bind(this));
    this.router.get("/asignados", this.GetAllByAgente.bind(this));
    this.router.get("/porArea", this.GetAllByArea.bind(this));
    this.router.get("/especifico", this.getSpecificCurso.bind(this));
  }

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

  private async GetAllByAgente(req: Request, res: Response) {
    try {
      const idAgenteTarget: number = req.body.idAgente;
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

  private async GetAllByArea(req: Request, res: Response) {
    try {
      const idAreaTarget: number = req.body.idArea;
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

  private async getSpecificCurso(req: Request, res: Response) {
    try {
      const curso = await db.Curso.findByPk(req.body.idCurso);
      res.status(200).json(curso);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error en Curso controller");
    }
  }

  private async postAsignarCurso(req: Request, res: Response) {
    try {
      const asignacion = await db.UsuarioCurso.create(req.body);

      console.log("Asignación exitosa");
      res.status(200).send("Asignación exitosa :)");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error en Curso Controller");
    }
  }
  private async postDesasignarCurso(req: Request, res: Response) {
    try {
      const desasignacion = await db.UsuarioCurso.destroy({
        where: {
          idCurso: req.body.idCurso,
          idUsuario: req.body.idAgente,
        },
      });

      console.log("Desasignación exitosa");
      res.status(200).send("Desasignación exitosa :)");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error en Curso Controller");
    }
  }

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

  private async postCambiarEstado(req: Request, res: Response) {
    try {
    } catch (err) {}
  }

  private async getInfoCompleta(req: Request, res: Response) {
    try {
    } catch (err) {}
  }

  private async getAgentesConCurso(req: Request, res: Response) {
    try {
    } catch (err) {}
  }
}

export default CursoController;
