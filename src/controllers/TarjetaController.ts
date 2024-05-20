import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";

class TarjetaController extends AbstractController {
    // Singleton
    private static _instance: TarjetaController;
    public static get instance(): TarjetaController {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new TarjetaController("tarjeta");
        return this._instance;
    }

    protected initializeRoutes(): void {
        this.router.post("/", this.cargarTarjetas.bind(this)); // Ruta para cargar tarjetas
        this.router.get("/id", this.getTarjetasPorCuenta.bind(this)); // Ruta para obtener tarjetas por ID de cuenta
        this.router.get("/numCuenta", this.getTarjetaPorNumCuenta.bind(this)); // Ruta para obtener tarjeta por número de cuenta
    }

    private async cargarTarjetas(req: Request, res: Response) {
        try {
            const tarjetas = req.body;
            if (!Array.isArray(tarjetas)) {
                return res.status(400).send("Se espera un arreglo de tarjetas");
            }

            const tarjetasCreadas = [];
            for (const tarjeta of tarjetas) {
                const { idCuenta, saldo, tipo, numCuenta } = tarjeta;
                if (!idCuenta || saldo == null || !tipo || numCuenta == null) {
                    return res.status(400).send("Todos los campos son requeridos para cada tarjeta");
                }

                const nuevaTarjeta = await db.Tarjeta.create({
                    idCuenta,
                    saldo,
                    tipo,
                    numCuenta
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
            const { id } = req.query;
            if (!id) {
                return res.status(400).send("ID de cuenta es requerido");
            }

            const tarjetas = await db.Tarjeta.findAll({
                where: { idCuenta: id },
            });

            res.status(200).json(tarjetas);
        } catch (err) {
            console.error("Error al obtener tarjetas por cuenta:", err);
            res.status(500).send("Error al obtener tarjetas por cuenta");
        }
    }

    private async getTarjetaPorNumCuenta(req: Request, res: Response) {
        try {
            const { numCuenta } = req.query;
            if (!numCuenta) {
                return res.status(400).send("Número de cuenta es requerido");
            }

            const tarjeta = await db.Tarjeta.findOne({
                where: { numCuenta },
            });

            if (!tarjeta) {
                return res.status(404).send("Tarjeta no encontrada");
            }

            res.status(200).json(tarjeta);
        } catch (err) {
            console.error("Error al encontrar la tarjeta:", err);
            res.status(500).send("Error al encontrar la tarjeta");
        }
    }
}

export default TarjetaController;
