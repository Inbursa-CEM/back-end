import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";

class CuentaController extends AbstractController {
  private static _instance: CuentaController;
  public static get instance(): CuentaController {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new CuentaController("cuenta");
    return this._instance;
  }

  protected initializeRoutes(): void {
    this.router.post("/cuentas",this.getCuentasPorCliente.bind(this));
  }


  

  private async getCuentasPorCliente(req: Request, res: Response) {
    try {
      const idCliente = req.body.idCliente;

      const cuentas = await db.Cuenta.findAll({
        where: { idCliente: idCliente },
      });
      res.status(200).json(cuentas);
    } catch (err) {
      console.error("Error al obtener cuentas por cliente:", err);
      res.status(500).send("Error al obtener cuentas por cliente");
    }
  }
}

export default CuentaController;
