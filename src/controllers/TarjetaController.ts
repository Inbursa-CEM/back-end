import { Request, Response } from "express";
import AbstractController from "./AbstractController";


class TarjetaController extends AbstractController {
    //Singleton
    //Atributos de clase
    private static _instance: TarjetaController;
    public static get instance(): TarjetaController {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new TarjetaController("cliente");
        return this._instance;
    }

    protected initializeRoutes(): void {
        this.router.get("/numCuenta",this.getnumCuenta.bind(this));
        this.router.get("/saldo",this.getsaldo.bind(this));
    }

    private async getnumCuenta(req: Request, res: Response) {
        try {
            console.log("TarjetaController works");
            res.status(200).send("TarjetaController works");
        } catch (error) {
            console.log(error);
            res.status(500).send("Error en TarjetaController");
        }
    }

    private async getsaldo(req: Request, res: Response) {
        try {
            console.log("TarjetaController works");
            res.status(200).send("TarjetaController works");
        } catch (error) {
            console.log(error);
            res.status(500).send("Error en TarjetaController");
        }
    }
}

export default TarjetaController;