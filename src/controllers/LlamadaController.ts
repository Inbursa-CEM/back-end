import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";
import { Sequelize, literal } from 'sequelize';

class LlamadaController extends AbstractController {
  // Singleton
  // Atributos de clase
  private static _instance: LlamadaController;
  public static get instance(): LlamadaController {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new LlamadaController("llamada");
    return this._instance;
  }

  protected initializeRoutes(): void {
    //POST
    this.router.post("/contestaSatisfaccion", this.postContestaSatisfaccion.bind(this));

    // GETS
    this.router.get("promedioDuracion", this.getPromedioDuracion.bind(this));
    this.router.get("/numLlamadas", this.getNumLlamadas.bind(this));
    this.router.get("/satisfaccion", this.getSatisfaccion.bind(this));
  }
   
  private async postContestaSatisfaccion(req: Request, res: Response) {
    try {
      const idLlamada = req.body.idLlamada; 
      const { satisfaccion } = req.body;
  
      const resultado = await db.Llamada.update(
        { satisfaccion },
        { where: { idLlamada } }
      );
  
      if (resultado[0] === 1) { 
        console.log("Satisfacción actualizada correctamente");
        res.status(200).send("Satisfacción actualizada correctamente");
      } else {
        console.log("No se encontró la llamada con el ID proporcionado");
        res.status(404).send("No se encontró la llamada con el ID proporcionado");
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en Llamada Controller");
    }
  }

  private async getPromedioDuracion(req: Request, res: Response) {
  try {
    const idAgenteTarget = req.body.idAgente;
    const currentDate = literal('CURRENT_DATE');

    const llamadas = await db.Llamada.findAll({
      attributes: ['fechaInicio', 'fechaFin'],
      where: {
        idAgente: idAgenteTarget,
        fechaInicio: Sequelize.literal('DATE(fechaInicio) = DATE(:currentDate)'),
      },
      replacements: { currentDate }
    });

    const resultado = llamadas.map((llamada: any) => {
      const duracionMs = new Date(llamada.fechaFin).getTime() - new Date(llamada.fechaInicio).getTime();
      const duracion = new Date(duracionMs);

      const horas = duracion.getUTCHours().toString().padStart(2, '0');
      const minutos = duracion.getUTCMinutes().toString().padStart(2, '0');
      const segundos = duracion.getUTCSeconds().toString().padStart(2, '0');

      const duracionFormateada = `${horas}:${minutos}:${segundos}`;

      return {
        fechaInicio: llamada.fechaInicio,
        fechaFin: llamada.fechaFin,
        duracion: duracionFormateada 
      };
    });

    res.status(200).json(resultado);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en Llamada Controller");
  }
}

  private async getNumLlamadas(req: Request, res: Response) {
    try {
      const idAgenteTarget = req.body.idAgente;
      const currentDate = literal('CURRENT_DATE');
  
      const numLlamadas = await db.Llamada.count({
        where: {
          idAgente: idAgenteTarget,
          fechaInicio: Sequelize.literal('DATE(fechaInicio) = DATE(:currentDate)'),
        },
        replacements: { currentDate }
      });
  
      res.status(200).json(numLlamadas);
    }catch (error) {
      console.log(error);
      res.status(500).send("Error en Llamada Controller");
    }
  }
  
  private async getSatisfaccion(req: Request, res: Response) {
    try {
      const idAgenteTarget: number = req.body.idAgente;
      const currentDate = literal('CURRENT_DATE');
  
      const queryCompleta = await db["Llamada"].findAll({
        where: { 
          idAgente: idAgenteTarget,
          fecha: currentDate
        },
        attributes: [
          [
            db.sequelize.fn('SUM', db.sequelize.literal('CASE WHEN satisfaccion = true THEN 1 ELSE 0 END')),
            'numeroSatisfaccionTrue'
          ],
          [
            db.sequelize.fn('SUM', db.sequelize.literal('CASE WHEN satisfaccion = false THEN 1 ELSE 0 END')),
            'numeroSatisfaccionFalse'
          ]
        ]
      });
  
      const resultado = {
        numeroSatisfaccionTrue: queryCompleta[0].get('numeroSatisfaccionTrue'),
        numeroSatisfaccionFalse: queryCompleta[0].get('numeroSatisfaccionFalse')
      };
      res.status(200).json(resultado);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en Llamada Controller");
    }
  }
}

export default LlamadaController;
