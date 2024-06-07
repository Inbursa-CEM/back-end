import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";

class TransaccionController extends AbstractController {
  private static _instance: TransaccionController;

  public static get instance(): TransaccionController {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new TransaccionController("transaccion");
    return this._instance;
  }

  protected initializeRoutes(): void {
    this.router.get("/consultar/:telefono", this.getConsultar.bind(this));
    this.router.get("/transax/:telefono", this.getTransaxUnica.bind(this));

    this.router.post("/getTransacciones", this.getTransacciones.bind(this));
    this.router.post("/getTransaccion", this.getTransaccion.bind(this));
  }

  private async getConsultar(req: Request, res: Response) {
    try {
      console.log("Consultar transacciones");
      const telefono = req.params.telefono;
      if (!telefono) {
        return res
          .status(400)
          .send("El parámetro número de cliente es requerido");
      }

      // Buscar al cliente por su número
      let cliente = await db["Cliente"].findOne({
        where: { telefono: telefono },
      });
      if (!cliente) {
        return res.status(404).send("Cliente no encontrado");
      }

      // Obtener la cuenta asociada al cliente
      let cuenta = await db["Cuenta"].findOne({
        where: { idCliente: cliente.idCliente },
      });
      if (!cuenta) {
        return res
          .status(404)
          .send("Cuenta no encontrada para el cliente dado");
      }

      // Obtener la tarjeta asociada a la cuenta
      let tarjeta = await db["Tarjeta"].findOne({
        where: { idCuenta: cuenta.idCuenta },
      });
      if (!tarjeta) {
        return res
          .status(404)
          .send("Tarjeta no encontrada para la cuenta dada");
      }

      // Obtener la transaccion asociada a la tarjeta
      let transacciones = await db["Transaccion"].findAll({
        where: { numCuenta: tarjeta.numCuenta },
        limit: 10,
      });
      if (!transacciones) {
        return res
          .status(404)
          .send("Transacciones no encontradas para la tarjeta dada");
      }
      res.status(200).json(transacciones);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error al consultar transaccion");
    }
  }

  private async getTransaxUnica(req: Request, res: Response) {
    try {
      console.log("Consultar transacciones");
      const telefono = req.params.telefono;
      if (!telefono) {
        return res
          .status(400)
          .send("El parámetro número de cliente es requerido");
      }

      // Buscar al cliente por su número
      let cliente = await db["Cliente"].findOne({
        where: { telefono: telefono },
      });
      if (!cliente) {
        return res.status(404).send("Cliente no encontrado");
      }

      // Obtener el reporte de una transacción
      let reporte = await db["Reporte"].findOne({
        where: { idCliente: cliente.idCliente },
        order: [["idReporte", "DESC"]],
      });
      if (!reporte) {
        return res
          .status(404)
          .send("Reporte no encontrado para el cliente dado");
      }

      // Obtener la cuenta asociada al cliente
      let cuenta = await db["Cuenta"].findOne({
        where: { idCliente: cliente.idCliente },
      });
      if (!cuenta) {
        return res
          .status(404)
          .send("Cuenta no encontrada para el cliente dado");
      }

      // Obtener la tarjeta asociada a la cuenta
      let tarjeta = await db["Tarjeta"].findOne({
        where: { idCuenta: cuenta.idCuenta },
      });
      if (!tarjeta) {
        return res
          .status(404)
          .send("Tarjeta no encontrada para la cuenta dada");
      }

      // Obtener la transaccion asociada a la tarjeta
      let transaccion = await db["Transaccion"].findOne({
        where: { idTransaccion: reporte.idTransaccion },
      });
      if (!transaccion) {
        return res
          .status(404)
          .send("Transaccion no encontrada para la tarjeta dada");
      }
      res.status(200).json(transaccion);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error al consultar transaccion");
    }
  }

  private async getTransacciones(req: Request, res: Response) {
    try {
      const numCuenta = req.body.numCuenta;

      // Buscar todas las transacciones asociadas al número de cuenta
      const transacciones = await db.Transaccion.findAll({
        where: {
          numCuenta: numCuenta,
        },
      });

      res.status(200).json(transacciones);
    } catch (err) {
      console.error("Error al obtener transacciones por cuenta:", err);
      res.status(500).send("Error al obtener transacciones por cuenta");
    }
  }

  private async getTransaccion(req: Request, res: Response) {
    try {
      const idTransaccion = req.body.idTransaccion;
      const numCuenta = req.body.numCuenta;

      // Buscar una transacción con el ID de transacción y el número de cuenta proporcionados
      const transaccion = await db.Transaccion.findOne({
        attributes: [
          "idTransaccion",
          "monto",
          "fecha",
          "detalle",
          "estatus",
          "nombre",
        ],
        where: {
          idTransaccion: idTransaccion,
          numCuenta: numCuenta,
        },
      });

      if (!transaccion) {
        return res.status(404).send("Transacción no encontrada");
      }

      console.log("Transacción encontrada");
      res.status(200).json(transaccion);
    } catch (err) {
      console.error("Error al obtener transacción:", err);
      res.status(500).send("Error al obtener transacción");
    }
  }
}

export default TransaccionController;
