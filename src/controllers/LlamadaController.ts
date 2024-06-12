import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";
import { Sequelize, Op } from "sequelize";
// importar connection services
import connectLens from "../services/connectLensService";

const today = new Date();
today.setHours(0, 0, 0, 0);

const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

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
    this.router.post(
      "/contestaSatisfaccion",
      this.postContestaSatisfaccion.bind(this)
    );

    // GETS
    this.router.get("/consultar/:telefono", this.getConsultar.bind(this));
    this.router.get(
      "/numLlamadasPorAgente",
      this.getnumLlamadasPorAgente.bind(this)
    );
    this.router.get(
      "/promedioServicioPorAgente",
      this.getpromedioServicioPorAgente.bind(this)
    );
    this.router.get(
      "/sentimientoPorAgente",
      this.getSentimientoPorAgente.bind(this)
    );
    this.router.get(
      "/reportesAtendidosPorAgente",
      this.getreportesAtendidosPorAgente.bind(this)
    );
    this.router.get(
      "/numLlamadasTotales",
      this.getnumLlamadasTotales.bind(this)
    );
    this.router.get(
      "/promedioDuracionPorAgente",
      this.getpromedioDuracionPorAgente.bind(this)
    );
    this.router.get(
      "/promedioServicioGeneral",
      this.getpromedioServicioGeneral.bind(this)
    );
  }

  private async getnumLlamadasPorAgente(req: Request, res: Response) {
    try {
      const numeroLlamadasPorAgente = await db["Llamada"].findAll({
        attributes: [
          "idUsuario",
          [Sequelize.fn("COUNT", "idUsuario"), "numLlamadas"],
        ],
        group: ["idUsuario"],
      });

      res.status(200).json(numeroLlamadasPorAgente);
      console.log("Número de llamadas totales por agente");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error en LlamadaController");
    }
  }

  private async getpromedioServicioGeneral(req: Request, res: Response) {
    try {
      const resultado = await db["Llamada"].findOne({
        attributes: [
          [
            Sequelize.literal(
              "AVG(CASE WHEN problemaResuelto = 1 THEN 1 ELSE 0 END)"
            ),
            "promedioServicioGeneral",
          ],
        ],
      });
      if (
        resultado &&
        resultado.getDataValue("promedioServicioGeneral") !== null
      ) {
        const promedioServicioGeneral =
          resultado.getDataValue("promedioServicioGeneral") * 100;
        resultado.setDataValue(
          "promedioServicioGeneral",
          promedioServicioGeneral
        );
      }
      res.status(200).json(resultado);
      console.log("Promedio del servicio en general");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error en LlamadaController");
    }
  }

  private async getreportesAtendidosPorAgente(req: Request, res: Response) {
    try {
      const resultado = await db["Llamada"].findAll({
        attributes: [
          "idUsuario",
          [
            Sequelize.literal(
              "SUM(CASE WHEN problemaResuelto = 1 THEN 1 ELSE 0 END)"
            ),
            "problemasResueltos",
          ],
          [
            Sequelize.literal(
              "SUM(CASE WHEN problemaResuelto = 0 THEN 1 ELSE 0 END)"
            ),
            "problemasNoResueltos",
          ],
        ],
        group: ["idUsuario"],
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
        attributes: [
          "idUsuario",
          [
            Sequelize.literal(
              'SUM(CASE WHEN sentimiento = "positivo" THEN 1 ELSE 0 END)'
            ),
            "positivo",
          ],
          [
            Sequelize.literal(
              'SUM(CASE WHEN sentimiento = "negativo" THEN 1 ELSE 0 END)'
            ),
            "negativo",
          ],
          [
            Sequelize.literal(
              'SUM(CASE WHEN sentimiento = "neutral" THEN 1 ELSE 0 END)'
            ),
            "neutral",
          ],
        ],
        group: ["idUsuario"],
      });

      res.status(200).json(resultado);
      console.log("Número de veces que aparece cada sentimiento por agente");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error en LlamadaController");
    }
  }

  private async getpromedioServicioPorAgente(req: Request, res: Response) {
    try {
      const resultado = await db["Llamada"].findAll({
        attributes: [
          "idUsuario",
          [
            Sequelize.literal(
              "AVG(CASE WHEN problemaResuelto = 1 THEN 1 ELSE 0 END)"
            ),
            "promedioProblemasResueltos",
          ],
        ],
        group: ["idUsuario"],
      });

      res.status(200).json(resultado);
      console.log("Promedio de problemas resueltos por agente");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error en LlamadaController");
    }
  }

  private async getnumLlamadasTotales(req: Request, res: Response) {
    try {
      const numeroLlamadas = await db["Llamada"].count();
      res.status(200).json({ LlamadasTotales: numeroLlamadas });
      console.log("Numero de llamadas totales");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error en LlamadaController");
    }
  }

  private async getpromedioDuracionPorAgente(req: Request, res: Response) {
    try {
      console.log("Calculando duración promedio de llamadas por agente");
      const llamadas = await db["Llamada"].findAll({
        attributes: ["idUsuario", "fechaInicio", "fechaFin"],
        // include: {
        //   model: db["Usuario"],
        //   attributes: ['nombre']
        // }
      });
      const duracionPorAgente: Record<
        string,
        { totalDuracion: number; totalLlamadas: number }
      > = {};
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
      const promedioDuracionPorAgente = Object.entries(duracionPorAgente).map(
        ([idAgente, { totalDuracion, totalLlamadas }]) => ({
          idAgente,
          tiempoPromedio: totalDuracion / totalLlamadas / 60000,
        })
      );
      res.status(200).json(promedioDuracionPorAgente);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send("Error en calcular duración promedio de llamadas por agente");
    }
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
        res
          .status(404)
          .send("No se encontró la llamada con el ID proporcionado");
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en Llamada Controller");
    }
  }

  private async getvelocidadPromedio(req: Request, res: Response) {
    try {
      const idSupervisorTarget = req.query.idSupervisor;

      if (!idSupervisorTarget) {
        return res.status(400).send("idSupervisor is required");
      }

      console.log(
        "Calculando duración promedio de llamadas de todos los usuarios asociados al supervisor"
      );

      const llamadas = await db["Llamada"].findAll({
        attributes: ["fechaInicio", "fechaFin"],
        include: [
          {
            model: db["Usuario"],
            attributes: [],
            as: "Usuario",
            where: {
              idSupervisor: idSupervisorTarget,
            },
          },
        ],
        where: {
          fechaInicio: {
            [Op.gte]: today,
            [Op.lt]: tomorrow,
          },
        },
      });

      console.log(`Llamadas encontradas: ${llamadas.length}`);

      let totalDuracion = 0;
      let totalLlamadas = 0;

      for (const llamada of llamadas) {
        const fechaInicio = llamada.fechaInicio
          ? new Date(llamada.fechaInicio)
          : null;
        const fechaFin = llamada.fechaFin ? new Date(llamada.fechaFin) : null;

        if (fechaInicio && fechaFin) {
          const duracionMs = fechaFin.getTime() - fechaInicio.getTime();
          totalDuracion += duracionMs;
          totalLlamadas++;
        } else {
          console.log(
            `Llamada con id ${llamada.id} tiene fechaInicio o fechaFin nulo.`
          );
        }
      }

      if (totalLlamadas === 0) {
        return res.status(200).json({ tiempoPromedio: 0 });
      }

      const velocidadPromedio = totalDuracion / totalLlamadas / 60000;

      res.status(200).json({ velocidadPromedio });
      console.log("Duración promedio de llamadas calculada");
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en calcular duración promedio de llamadas");
    }
  }
}

export default LlamadaController;
