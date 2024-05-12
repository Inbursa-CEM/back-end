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

        // GETS
        this.router.get("/agentesConRecomendacion", this.getAgentesConRecomendacion.bind(this));
        this.router.get("/cursosConRecomendacion", this.getCursosConRecomendacion.bind(this));
        this.router.get("/cambiarEstadoRecomendacion", this.getCambiarEstadoRecomendacion.bind(this));
    }

    private async postCrear(req: Request, res: Response) {
        try{

        }catch(err){
            
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



}

export default RecomendacionController;