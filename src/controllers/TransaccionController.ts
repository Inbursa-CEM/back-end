import { Request, Response } from "express";
import AbstractController from "./AbstractController";


class TransaccionController extends AbstractController {
    //Singleton
    //Atributos de clase
    private static _instance: TransaccionController;
    public static get instance(): TransaccionController {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new TransaccionController("transaccion");
        return this._instance;
    }

    protected initializeRoutes(): void {
        this.router.get("/fechaTransaccion",this.getfechaTransaccion.bind(this));
        this.router.get("/detalleTransaccion",this.getdetalleTransaccion.bind(this));
        this.router.get("/folioTransaccion",this.getfolioTransaccion.bind(this));
        this.router.get("/monto",this.getMonto.bind(this));
        this.router.get("/estatus",this.getEstatus.bind(this));
    }

    private async getfechaTransaccion(req: Request, res: Response) {
        try {
            console.log("UsuarioController works");
            res.status(200).send("UsuarioController works");
        } catch (error) {
            console.log(error);
            res.status(500).send("Error en UsuarioController");
        }
    }

    private async getdetalleTransaccion(req: Request, res: Response) {
        try {
            console.log("UsuarioController works");
            res.status(200).send("UsuarioController works");
        } catch (error) {
            console.log(error);
            res.status(500).send("Error en UsuarioController");
        }
    }

    private async getfolioTransaccion(req: Request, res: Response) {
        try {
            console.log("UsuarioController works");
            res.status(200).send("UsuarioController works");
        } catch (error) {
            console.log(error);
            res.status(500).send("Error en UsuarioController");
        }
    }

    private async getMonto(req: Request, res: Response) {
        try {
            console.log("UsuarioController works");
            res.status(200).send("UsuarioController works");
        } catch (error) {
            console.log(error);
            res.status(500).send("Error en UsuarioController");
        }
    }

    private async getEstatus(req: Request, res: Response) {
        try {
            console.log("UsuarioController works");
            res.status(200).send("UsuarioController works");
        } catch (error) {
            console.log(error);
            res.status(500).send("Error en UsuarioController");
        }
    }
}

export default TransaccionController;