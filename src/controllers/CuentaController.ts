import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";

class CuentaController extends AbstractController {
  private static _instance: CuentaController;
  public static get instance(): CuentaController {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new CuentaController("Cuenta");
    return this._instance;
  }

  protected initializeRoutes(): void {
    this.router.post("/cargarCuentas", this.cargarCuentas.bind(this));
    this.router.get(
      "/:idCliente/cuentas",
      this.getCuentasPorCliente.bind(this)
    );
  }

  private async cargarCuentas(req: Request, res: Response) {
    try {
      const cuentas = req.body;
      if (!Array.isArray(cuentas)) {
        return res.status(400).send("Se espera un arreglo de cuentas");
      }
  
      const cuentasCreadas = [];
      for (const cuenta of cuentas) {
        const { idCliente, saldo, tipo, numCuenta } = cuenta;
        if (!idCliente || saldo == null || !tipo || !numCuenta) {
          return res
            .status(400)
            .send("Todos los campos son requeridos para cada cuenta, incluyendo el número de cuenta");
        }
  
        const nuevaCuenta = await db.Cuenta.create({
          idCliente,
        });
  
        const nuevaTarjeta = await db.Tarjeta.create({
          idCuenta: nuevaCuenta.idCuenta,
          numCuenta,  // Asegúrate de pasar el número de cuenta aquí
          saldo,
          tipo,
        });
  
        cuentasCreadas.push({ cuenta: nuevaCuenta, tarjeta: nuevaTarjeta });
      }
  
      res.status(201).json(cuentasCreadas);
    } catch (err) {
      console.error("Error al cargar cuentas y tarjetas:", err);
      res.status(500).send("Error al cargar cuentas y tarjetas");
    }
  }
  

  private async getCuentasPorCliente(req: Request, res: Response) {
    try {
      const { idCliente } = req.params;
      if (!idCliente) {
        return res.status(400).send("ID de cliente es requerido");
      }

      const cuentas = await db.Cuenta.findAll({
        where: { idCliente },
        include: [
          { model: db.Tarjeta, as: "Tarjetas" },
          { model: db.Transaccion, as: "Transacciones" },
        ],
      });

      res.status(200).json(cuentas);
    } catch (err) {
      console.error("Error al obtener cuentas por cliente:", err);
      res.status(500).send("Error al obtener cuentas por cliente");
    }
  }
}

export default CuentaController;
