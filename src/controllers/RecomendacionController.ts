import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models"

class RecomendacionController extends AbstractController {
    
    // Singleton
    // Atributos de clase
    private static _instance: RecomendacionController;
    public static get instance(): RecomendacionController {
        if (this._instance){
            return this._instance;
        }
        this._instance = new RecomendacionController("recomendacion");
        return this._instance;
    }

    protected initializeRoutes(): void {
        // POSTS
        this.router.post("/crear", this.postCrear.bind(this));
        this.router.post("/asignar", this.postAsignarReco.bind(this));

        // GETS
        this.router.get("/agentesConRecomendacion", this.getAgentesConRecomendacion.bind(this));
        this.router.get("/cursosConRecomendacion", this.getCursosConRecomendacion.bind(this));
        this.router.get("/cambiarEstadoRecomendacion", this.getCambiarEstadoRecomendacion.bind(this));

        this.router.get("/asignados", this.GetAllByAgente.bind(this));
    }

    private async postCrear(req: Request, res: Response) {
        try{
            const newRecomendacion = await db.Recomendacion.create(req.body);

            // AQUI SE CREAN LAS ASOCIACIONES
            await newRecomendacion.addArea_Oportunidad(req.body.idAreasOportunidad);

            console.log("Recomendacion creada");
            res.status(200).send("Recomendacion creada :))");

        }catch(err){
            console.log(err);
            res.status(500).send("Error en Recomendacion Controller");
        }
    }

    private async postAsignarReco(req: Request, res: Response) {
        try {
            const asignacion = await db.Usuario_Recomendacion.create(req.body);


            console.log("Asignación exitosa");
            res.status(200).send("Asignación exitosa :)");

        } catch (err) {
            console.log(err);
            res.status(500).send("Error en Recomendacion Controller");
        }
    }
    
    private async getAgentesConRecomendacion(req: Request, res: Response) {
        
        try{

        }catch(err){
            
        }
    }

    private async getCursosConRecomendacion(req: Request, res: Response) {
        try{

        }catch(err){
            
        }
    }

    private async getCambiarEstadoRecomendacion(req: Request, res: Response) {
        try{

        }catch(err){
            
        }
    }

    private async GetAllByAgente(req: Request, res: Response) {
        try {
            const idAgenteTarget: number = req.body.idAgente;
            console.log("Consultado Recomendaciones del agente --> " + idAgenteTarget);

            let queryCompleta = await db["Usuario"].findAll({
                where: { idUsuario: idAgenteTarget },
                include: {
                    model: db.Recomendacion
                }
            });

            const recomendaciones = queryCompleta[0].Recomendacions.map((recomendacion:any) => {
                const idRecomendacion = recomendacion.idRecomendacion;
                const nombre = recomendacion.nombre;
                const descripcion = recomendacion.descripcion; 
                const activa = recomendacion.Usuario_Recomendacion.activa;

                return {
                    idRecomendacion,
                    nombre,
                    descripcion,
                    activa,
                }
            });


            res.status(200).json(recomendaciones);
        }
        catch (err) {
            console.log(err);
            res.status(500).send("Error en Curso Controller");
        }
    }


}

export default RecomendacionController;