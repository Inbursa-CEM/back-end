import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models"


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

        // GETS
        this.router.get("/infoCompleta", this.getInfoCompleta.bind(this));
        this.router.get("/agentesConCurso", this.getAgentesConCurso.bind(this));

        this.router.get("/asignados", this.GetAllByAgente.bind(this));

    }

    private async postCrear(req: Request, res: Response) {
        try {
            const newCurso = await db.Curso.create(req.body);

            // AQUI SE CREAN LAS ASOCIACIONES
            await newCurso.addArea_Oportunidad(req.body.idAreasOportunidad);

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

            let agentes = await db["Usuario_Curso"].findAll({
                attributes: { exclude: ['idUsuario'] },
                where: {
                    idUsuario: idAgenteTarget
                }
            });

            res.status(200).json(agentes);
        }
        catch (err) {
            console.log(err);
            res.status(500).send("Error en Curso Controller");
        }
    }
    private async postAsignarCurso(req: Request, res: Response) {
        try {
            const asignacion = await db.Usuario_Curso.create(req.body);


            console.log("Asignación exitosa");
            res.status(200).send("Asignación exitosa :)");

        } catch (err) {
            console.log(err);
            res.status(500).send("Error en Curso Controller");
        }
    }

    private async postCambiarEstado(req: Request, res: Response) {
        try {

        } catch (err) {

        }
    }

    private async getInfoCompleta(req: Request, res: Response) {
        try {

        } catch (err) {

        }
    }

    private async getAgentesConCurso(req: Request, res: Response) {
        try {

        } catch (err) {

        }
    }



}

export default CursoController;