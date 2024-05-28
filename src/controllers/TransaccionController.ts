import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";

class TransaccionController extends AbstractController {
  // Singleton
  // Atributos de clase
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

    this.router.post(
      "/cargarTransacciones",
      this.cargarTransacciones.bind(this)
    );
    this.router.get(
      "/:idCuenta/transacciones",
      this.getTransaccionesPorCuenta.bind(this)
    );
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
      let tarjeta = await db["Tarjeta"].findOne({
        where: { idCuenta: cuenta.idCuenta }
      });
      if (!tarjeta) {
        return res
          .status(404)
          .send("Tarjeta no encontrada para la cuenta dada");
      }

      // Obtener la transaccion asociada a la tarjeta
      let transacciones = await db["Transaccion"].findAll({
        where: { numCuenta: tarjeta.numCuenta },
        limit: 10
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
        where: { telefono: telefono }
      });
      if (!cliente) {
        return res.status(404).send("Cliente no encontrado");
      }

      // Obtener el reporte de una transacción
      let reporte = await db["Reporte"].findOne({
        where: { idCliente: cliente.idCliente },
        order: [['idReporte', 'DESC']]
      });
      if (!reporte) {
        return res.status(404).send("Reporte no encontrado para el cliente dado");
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
      let tarjeta = await db["Tarjeta"].findOne({
        where: { idCuenta: cuenta.idCuenta }
      });
      if (!tarjeta) {
        return res
          .status(404)
          .send("Tarjeta no encontrada para la cuenta dada");
      }

      // Obtener la transaccion asociada a la tarjeta
      let transaccion = await db["Transaccion"].findOne({
        where: { idTransaccion: reporte.idTransaccion }
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

  private async cargarTransacciones(req: Request, res: Response) {
    try {
      const transacciones = req.body;
      if (!Array.isArray(transacciones)) {
        return res.status(400).send("Se espera un arreglo de transacciones");
      }

      const transaccionesCreadas = [];
      for (const transaccion of transacciones) {
        const { idCuenta, monto, detalle, estatus, nombreTransaccion } =
          transaccion;
        if (
          !idCuenta ||
          monto == null ||
          !detalle ||
          !estatus ||
          !nombreTransaccion
        ) {
          return res
            .status(400)
            .send("Todos los campos son requeridos para cada transacción");
        }

        const nuevaTransaccion = await db.Transaccion.create({
          numCuenta: idCuenta,
          fecha: new Date(),
          detalle,
          estatus,
          monto,
          nombre: nombreTransaccion,
        });

        transaccionesCreadas.push(nuevaTransaccion);
      }

      res.status(201).json(transaccionesCreadas);
    } catch (err) {
      console.error("Error al cargar transacciones:", err);
      res.status(500).send("Error al cargar transacciones");
    }
  }

  private async getTransaccionesPorCuenta(req: Request, res: Response) {
    try {
      const { idCuenta } = req.params;
      if (!idCuenta) {
        return res.status(400).send("ID de cuenta es requerido");
      }

      const transacciones = await db.Transaccion.findAll({
        where: { numCuenta: idCuenta },
      });

      res.status(200).json(transacciones);
    } catch (err) {
      console.error("Error al obtener transacciones por cuenta:", err);
      res.status(500).send("Error al obtener transacciones por cuenta");
    }
  }
}

export default TransaccionController;
