import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";

// Clase TarjetaController que extiende de AbstractController
class TarjetaController extends AbstractController {
  // Atributo estático para implementar el patrón Singleton
  private static _instance: TarjetaController;

  // Método estático para obtener la instancia única de TarjetaController
  public static get instance(): TarjetaController {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new TarjetaController("tarjeta");
    return this._instance;
  }

  // Método para inicializar las rutas del controlador
  protected initializeRoutes(): void {
    this.router.get("/consultar/:telefono", this.getConsultar.bind(this));
    this.router.post("/cargarTarjetas", this.cargarTarjetas.bind(this));
    this.router.get(
      "/:idCuenta/tarjetas",
      this.getTarjetasPorCuenta.bind(this)
    );
    this.router.post("/getTarjeta", this.getTarjeta.bind(this));
    this.router.post("/getTarjetasxCuenta", this.getTarjetasPorCuenta.bind(this));
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

  // Método para obtener una tarjeta específica basada en el número de cuenta
  private async getTarjeta(req: Request, res: Response) {
    try {
      // Obtener el número de cuenta del cuerpo de la solicitud
      const numCuenta = req.body.numCuenta;

      // Buscar una tarjeta en la base de datos con el número de cuenta proporcionado
      const tarjeta = await db.Tarjeta.findOne({
        attributes: ["tipo", "saldo", "idCuenta"], // Atributos que se devolverán
        where: { 
          numCuenta: numCuenta
        },
      });

      // Si no se encuentra ninguna tarjeta, enviar un error 404
      if (!tarjeta) {
        res.status(404).send("Tarjeta no encontrada");
        return;
      }

      // Log para indicar que se ha obtenido una tarjeta
      console.log("Se obtuvo tarjeta");
      res.status(200).json(tarjeta); // Devolver los datos de la tarjeta en la respuesta
    } catch (err) {
      // Manejo de errores: log del error y envío de una respuesta con status 500
      console.error("Error al obtener tarjeta:", err);
      res.status(500).send("Error al obtener tarjeta");
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
