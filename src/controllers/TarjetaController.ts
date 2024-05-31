import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";

class TarjetaController extends AbstractController {
  // Singleton
  // Atributos de clase
  private static _instance: TarjetaController;
  public static get instance(): TarjetaController {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new TarjetaController("tarjeta");
    return this._instance;
  }

  protected initializeRoutes(): void {
    this.router.get("/consultar/:telefono", this.getConsultar.bind(this));

    this.router.post("/cargarTarjetas", this.cargarTarjetas.bind(this));
    this.router.get(
      "/:idCuenta/tarjetas",
      this.getTarjetasPorCuenta.bind(this)
    );
  }

  private async getConsultar(req: Request, res: Response) {
    try {
      console.log("Consultar tarjetas");
      const telefono = req.params.telefono;
      if (!telefono) {
        return res
          .status(400)
          .send("El parámetro número de cliente es requerido");
      }

      // Buscar al cliente por su número
      let cliente = await db["Cliente"].findOne({
        where: { telefono: telefono }
      });
      if (!cliente) {
        return res.status(404).send("Cliente no encontrado");
      }

      // Obtener la cuenta asociada al cliente
      let cuenta = await db["Cuenta"].findOne({
        where: { idCliente: cliente.idCliente }
      });
      if (!cuenta) {
        return res
          .status(404)
          .send("Cuenta no encontrada para el cliente dado");
      }

      // Obtener la tarjeta asociada a la cuenta
      let tarjeta = await db["Tarjeta"].findOne({ where: { idCuenta: cuenta.idCuenta } });
      if (!tarjeta) {
        return res.status(404).send("Tarjeta no encontrada para la cuenta dada");
      }

      res.status(200).json(tarjeta);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error al consultar tarjeta");
    }
  }

  private async cargarTarjetas(req: Request, res: Response) {
    try {
      const tarjetas = req.body;
      if (!Array.isArray(tarjetas)) {
        return res.status(400).send("Se espera un arreglo de tarjetas");
      }

      const tarjetasCreadas = [];
      for (const tarjeta of tarjetas) {
        const { idCuenta, saldo, tipo } = tarjeta;
        if (!idCuenta || saldo == null || !tipo) {
          return res
            .status(400)
            .send("Todos los campos son requeridos para cada tarjeta");
        }

        const nuevaTarjeta = await db.Tarjeta.create({
          idCuenta,
          saldo,
          tipo,
        });

        tarjetasCreadas.push(nuevaTarjeta);
      }

      res.status(201).json(tarjetasCreadas);
    } catch (err) {
      console.error("Error al cargar tarjetas:", err);
      res.status(500).send("Error al cargar tarjetas");
    }
  }

  private async getTarjetasPorCuenta(req: Request, res: Response) {
    try {
      const { idCuenta } = req.params;
      if (!idCuenta) {
        return res.status(400).send("ID de cuenta es requerido");
      }

      const tarjetas = await db.Tarjeta.findAll({
        where: { idCuenta },
      });

      res.status(200).json(tarjetas);
    } catch (err) {
      console.error("Error al obtener tarjetas por cuenta:", err);
      res.status(500).send("Error al obtener tarjetas por cuenta");
    }
  }
}

export default TarjetaController;
