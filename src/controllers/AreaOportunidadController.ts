import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models"

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
        this.router.get("/cursosDeArea", this.getCursosDeArea.bind(this));
        this.router.get("/agentesConArea", this.getAgentesConArea.bind(this));
    }

    private async postCrear(req: Request, res: Response) {
        try {
            await db.Area_Oportunidad.create(req.body);
            console.log("Area de Oportunidad creada");
            res.status(200).send("AO creada :)");
        } catch (err) {
            console.log(err);
            res.status(500).send("Error en AreaOportunidad Controller");
        }
    }

    private async getAll(req: Request, res: Response) {
        try {
            console.log("Obteniendo todas las áreas de oportunidad");
            let areas = await db["Area_Oportunidad"].findAll();
            res.status(200).json(areas);
        } catch (err) {
            console.log(err);
            res.status(500).send("Error en AreaOportunidad Controller");
        }
    }

    private async getCursosDeArea(req: Request, res: Response) {
        try {

        } catch (err) {

        }
    }

    private async getAgentesConArea(req: Request, res: Response) {
        try {

        } catch (err) {

        }
    }

}

export default AreaOportunidadController;