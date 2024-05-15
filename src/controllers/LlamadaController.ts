import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";
import { Sequelize } from 'sequelize';


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
    this.router.get("/numLlamadasPorAgente", this.getnumLlamadasPorAgente.bind(this));
    
    this.router.get("/promedioServicioPorAgente", this.getpromedioServicioPorAgente.bind(this));
    this.router.get("/sentimientoPorAgente", this.getSentimientoPorAgente.bind(this));
    this.router.get("/reportesAtendidosPorAgente", this.getreportesAtendidosPorAgente.bind(this));
    this.router.get("/numLlamadas", this.getnumLlamadas.bind(this));
    this.router.get("/promedioDuracion", this.getpromedioDuracion.bind(this));


    this.router.get("/duracionLlamadaPorAgente", this.getduracionLlamadaPorAgente.bind(this));
  }

  private async getnumLlamadasPorAgente(req: Request, res: Response) {
    try {
      const numeroLlamadasPorAgente = await db["Llamada"].findAll({
        attributes: ['idUsuario', [Sequelize.fn('COUNT', 'idUsuario'), 'numLlamadas']],
        group: ['idUsuario']
      });
  
      res.status(200).json(numeroLlamadasPorAgente);
      console.log("Número de llamadas totales por agente");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error en LlamadaController");
    }
  }
   

private async getduracionLlamadaPorAgente(req: Request, res: Response) {
  try {
    res.status(200).json("H");
    console.log("Numero de llamadas totales");
} catch (err) {
    console.log(err);
    res.status(500).send("Error en LlamadaController");
}
}

private async getpromedioServicioPorAgente(req: Request, res: Response) {
  try {
    const resultado = await db["Llamada"].findAll({
      attributes: ['idUsuario',
        [Sequelize.literal('SUM(CASE WHEN problemaResuelto = 1 THEN 1 ELSE 0 END)'), 'problemasResueltos'],
        [Sequelize.literal('SUM(CASE WHEN problemaResuelto = 0 THEN 1 ELSE 0 END)'), 'problemasNoResueltos']
      ],
      group: ['idUsuario']
    });

    res.status(200).json(resultado);
    console.log("Número de problemas resueltos y no resueltos por agente");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error en LlamadaController");
  }
}


private async getSentimientoPorAgente(req: Request, res: Response) {
  try {
    const resultado = await db["Llamada"].findAll({
      attributes: ['idUsuario',
        [Sequelize.literal('SUM(CASE WHEN sentimiento = "positivo" THEN 1 ELSE 0 END)'), 'positivo'],
        [Sequelize.literal('SUM(CASE WHEN sentimiento = "negativo" THEN 1 ELSE 0 END)'), 'negativo'],
        [Sequelize.literal('SUM(CASE WHEN sentimiento = "neutral" THEN 1 ELSE 0 END)'), 'neutral']
      ],
      group: ['idUsuario']
    });

    res.status(200).json(resultado);
    console.log("Número de veces que aparece cada sentimiento por agente");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error en LlamadaController");
  }
}


private async getreportesAtendidosPorAgente(req: Request, res: Response) {
  try {
    const resultado = await db["Llamada"].findAll({
      attributes: ['idUsuario',
        [
          Sequelize.literal('AVG(CASE WHEN problemaResuelto = 1 THEN 1 ELSE 0 END)'), 
          'promedioProblemasResueltos'
        ]
      ],
      group: ['idUsuario']
    });

    res.status(200).json(resultado);
    console.log("Promedio de problemas resueltos por agente");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error en LlamadaController");
  }
}

  private async getnumLlamadas(req: Request, res: Response) {
    try {
      const numeroLlamadas = await db["Llamada"].count();
      res.status(200).json({LlamadasTotales: numeroLlamadas});
      console.log("Numero de llamadas totales");
  } catch (err) {
      console.log(err);
      res.status(500).send("Error en LlamadaController");
  }
}

  private async getpromedioDuracion(req: Request, res: Response) {
    try {
      console.log("Calculando duración promedio de llamadas por agente");
        const llamadas = await db["Llamada"].findAll({
        attributes: ['idUsuario', 'fechaInicio', 'fechaFin']
        // include: {
        //   model: db["Usuario"],
        //   attributes: ['nombre']
        // }
      });
      const duracionPorAgente: Record<string, { totalDuracion: number, totalLlamadas: number }> = {};
        for (const llamada of llamadas) {
        const idAgente = llamada.idUsuario.toString();
        const fechaInicio = new Date(llamada.fechaInicio);
        const fechaFin = new Date(llamada.fechaFin);
        const duracionMs = fechaFin.getTime() - fechaInicio.getTime();
        // let nombre = llamada.idUsuario.toString();
  
        if (!duracionPorAgente[idAgente]) {
          duracionPorAgente[idAgente] = { totalDuracion: 0, totalLlamadas: 0 };
        }
        duracionPorAgente[idAgente].totalDuracion += duracionMs;
        duracionPorAgente[idAgente].totalLlamadas++;
      }
        const promedioDuracionPorAgente = Object.entries(duracionPorAgente).map(([idAgente, { totalDuracion, totalLlamadas }]) => ({
        idAgente,
        tiempoPromedio: (totalDuracion / totalLlamadas) / 60000
      }));
        res.status(200).json(promedioDuracionPorAgente);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en calcular duración promedio de llamadas por agente");
    }
  }
  
}

export default LlamadaController;