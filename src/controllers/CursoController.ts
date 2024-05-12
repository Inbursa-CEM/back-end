import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models"


class CursoController extends AbstractController {
    
    // Singleton
    // Atributos de clase
    private static _instance: CursoController;
    public static get instance(): CursoController {
        if (this._instance){
            return this._instance;
        }
        this._instance = new CursoController("curso");
        return this._instance;
    }

    protected initializeRoutes(): void {
        // POSTS
        this.router.post("/crear", this.postCrear.bind(this));
        this.router.post("/cambiarEstado", this.postCambiarEstado.bind(this));

        // GETS
        this.router.get("/infoCompleta", this.getInfoCompleta.bind(this));
        this.router.get("/agentesConCurso", this.getAgentesConCurso.bind(this));
    }

    private async postCrear(req: Request, res: Response) {
        try{

        }catch(err){
            
        }
    }

    private async postCambiarEstado(req: Request, res: Response) {
        try{

        }catch(err){
            
        }
    }

    private async getInfoCompleta(req: Request, res: Response) {
        try{

        }catch(err){
            
        }
    }

    private async getAgentesConCurso(req: Request, res: Response) {
        try{

        }catch(err){
            
        }
    }
    
    
    
}

export default CursoController;