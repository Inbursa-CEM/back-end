import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";

class TransaccionController extends AbstractController {
    // Singleton
    private static _instance: TransaccionController;
    public static get instance(): TransaccionController {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new TransaccionController("transaccion");
        return this._instance;
    }

    protected initializeRoutes(): void {
        this.router.post("/", this.cargarTransacciones.bind(this)); // Ruta para cargar transacciones
        this.router.get("/id", this.getTransaccionesPorCuenta.bind(this)); // Ruta para obtener transacciones por ID de cuenta
    }

    private async cargarTransacciones(req: Request, res: Response) {
        try {
            const transacciones = req.body;
            if (!Array.isArray(transacciones)) {
                return res.status(400).send("Se espera un arreglo de transacciones");
            }

            const transaccionesCreadas = [];
            for (const transaccion of transacciones) {
                const { idCuenta, monto, detalle, estatus, nombreTransaccion } = transaccion;
                if (!idCuenta || monto == null || !detalle || !estatus || !nombreTransaccion) {
                    return res.status(400).send("Todos los campos son requeridos para cada transacción");
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
            const { id } = req.query; // Cambiado a usar parámetros de consulta
            if (!id) {
                return res.status(400).send("ID de cuenta es requerido");
            }

            const transacciones = await db.Transaccion.findAll({
                where: { numCuenta: id },
            });

            res.status(200).json(transacciones);
        } catch (err) {
            console.error("Error al obtener transacciones por cuenta:", err);
            res.status(500).send("Error al obtener transacciones por cuenta");
        }
    }
}

export default TransaccionController;
