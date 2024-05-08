import { Request, Response } from "express";
import AbstractController from "./AbstractController";


class ClienteController extends AbstractController {
    //Singleton
    //Atributos de clase
    private static _instance: ClienteController;
    public static get instance(): ClienteController {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new ClienteController("cliente");
        return this._instance;
    }

    protected initializeRoutes(): void {
        this.router.get("/nombreCliente",this.getnombreCliente.bind(this));
        this.router.get("/correoCliente",this.getcorreoCliente.bind(this));
    }

    private async getnombreCliente(req: Request, res: Response) {
        try {
            console.log("ClienteController works");
            res.status(200).send("ClienteController works");
        } catch (error) {
            console.log(error);
            res.status(500).send("Error en ClienteController");
        }
    }

    private async getcorreoCliente(req: Request, res: Response) {
        try {
            console.log("ClienteController works");
            res.status(200).send("ClienteController works");
        } catch (error) {
            console.log(error);
            res.status(500).send("Error en ClienteController");
        }
    }
}

export default ClienteController;