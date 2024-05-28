import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";
import { Sequelize, literal, Op } from "sequelize";

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
      "/contestaProblemaResuelto",
      this.postProblemaResuelto.bind(this)
    );

    // GETS
    this.router.get("/consultar/:telefono", this.getConsultar.bind(this));

    this.router.get(
      "/promedioDuracionAgente",
      this.getPromedioDuracionAgente.bind(this)
    );

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

    this.router.get("/promedioDuracion", this.getPromedioDuracion.bind(this));
    this.router.get("/numLlamadas", this.getNumLlamadas.bind(this));
    this.router.get("/numLlamadasCliente/:telefono", this.getNumLlamadasCliente.bind(this));

    this.router.get(
      "/problemasResueltos",
      this.getProblemasResueltos.bind(this)
    );
  }

  private async getConsultar(req: Request, res: Response) {
    try {
      console.log("Consultar llamadas");
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

      // Buscar las llamadas asociadas a cada transacción
      let llamadasPromises = transacciones.map(async (transax: any) => {
        let llamadas = await db["Llamada"].findAll({
          where: { idTransaccion: transax.idTransaccion },
        });
        return {
          llamadas: llamadas,
        };
      });

      // Esperar a que todas las promesas se resuelvan
      let transaccionesConLlamadas = await Promise.all(llamadasPromises);

      // Filtrar las transacciones que si tienen llamadas
      transaccionesConLlamadas = transaccionesConLlamadas.filter(tc => tc.llamadas.length > 0);

      // Enviar la respuesta con las transacciones y sus llamadas correspondientes
      res.status(200).json(transaccionesConLlamadas);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error al consultar llamada");
    }
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

  private async postProblemaResuelto(req: Request, res: Response) {
    try {
      const idLlamada = req.body.idLlamada;
      const { problemaResuelto } = req.body;

      const resultado = await db.Llamada.update(
        { problemaResuelto },
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

  private async getPromedioDuracionAgente(req: Request, res: Response) {
    try {
      const idAgenteTarget = req.body.idAgente;
      const currentDate = literal("CURRENT_DATE");

      const llamadas = await db.Llamada.findAll({
        attributes: ["fechaInicio", "fechaFin"],
        where: {
          idAgente: idAgenteTarget,
          fechaInicio: Sequelize.literal(
            "DATE(fechaInicio) = DATE(:currentDate)"
          ),
        },
        replacements: { currentDate },
      });

      const resultado = llamadas.map((llamada: any) => {
        const duracionMs =
          new Date(llamada.fechaFin).getTime() -
          new Date(llamada.fechaInicio).getTime();
        const duracion = new Date(duracionMs);

        const horas = duracion.getUTCHours().toString().padStart(2, "0");
        const minutos = duracion.getUTCMinutes().toString().padStart(2, "0");
        const segundos = duracion.getUTCSeconds().toString().padStart(2, "0");

        const duracionFormateada = `${horas}:${minutos}:${segundos}`;

        return {
          fechaInicio: llamada.fechaInicio,
          fechaFin: llamada.fechaFin,
          duracion: duracionFormateada,
        };
      });

      res.status(200).json(resultado);
    } catch (error) {
      //llamada/promedioDuracion?idUsuario=2
      //Falta probarlo con fechaActual
    }
  }

  private async getNumLlamadasCliente(req: Request, res: Response) {
    try {
      const telefono = req.params.telefono;
      let fechaActual = new Date();
      let primerDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
      let ultimoDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);

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

      // Buscar las llamadas asociadas a cada transacción
      let llamadasPromises = transacciones.map(async (transax: any) => {
        let llamadas = await db["Llamada"].count({
          where: { idTransaccion: transax.idTransaccion },
          fechaInicio: {
            [db.Sequelize.Op.between]: [primerDiaMes, ultimoDiaMes]
          }
        });
        return {
          numllamadas: llamadas,
        };
      });

      // Esperar a que todas las promesas se resuelvan
      let numLlamadasCliente = await Promise.all(llamadasPromises);
      res.status(200).json(numLlamadasCliente);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error al consultar llamada");
    }
  }

  //llamada/numLlamadas?idUsuario=2
  private async getNumLlamadas(req: Request, res: Response) {
    try {
      const idAgente = req.query.idUsuario;
      const fechaActual = await db.sequelize.query("SELECT CURRENT_DATE AS fecha_actual", { type: db.sequelize.QueryTypes.SELECT });
      const fecha = fechaActual[0].fecha_actual;

      const numLlamadas = await db["Llamada"].count({
        where: {
          idUsuario: idAgente,
          fechaInicio: {
            [db.Sequelize.Op.between]: [`${fecha} 00:00:00`, `${fecha} 23:59:59`]
          }
        }
      });

      res.status(200).json({ "numLlamadas": numLlamadas, "fecha": fecha });
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en Llamada Controller");
    }
  }

  //llamada/promedioDuracion?idUsuario=2
  private async getPromedioDuracion(req: Request, res: Response) {
    const usuario = req.query.idUsuario;
    const fechaActual = await db.sequelize.query(
      "SELECT CURRENT_DATE AS fecha_actual",
      { type: db.sequelize.QueryTypes.SELECT }
    );
    const fecha = fechaActual[0].fecha_actual;

    try {
      const duraciones = await db["Llamada"].findAll({
        attributes: [
          [Sequelize.literal("TIMEDIFF(fechaFin, fechaInicio)"), "duracion"],
        ],

        where: {
          idUsuario: usuario,
          fechaInicio: {
            [db.Sequelize.Op.between]: [
              `${fecha} 00:00:00`,
              `${fecha} 23:59:59`,
            ],
          },
        },
      });

      let duracionTotalSegundos = 0;
      for (const llamada of duraciones) {
        const duracionSplit = llamada.getDataValue("duracion").split(":");
        const horas = parseInt(duracionSplit[0]);
        const minutos = parseInt(duracionSplit[1]);
        const segundos = parseInt(duracionSplit[2]);
        const duracionSegundos = horas * 3600 + minutos * 60 + segundos;
        duracionTotalSegundos += duracionSegundos;
      }

      // Calcular el promedio en segundos
      const totalLlamadas = duraciones.length;
      const promedioSegundos =
        totalLlamadas > 0 ? duracionTotalSegundos / totalLlamadas : 0;

      // Convertir el promedio de segundos a formato de duración
      const horasPromedio = Math.floor(promedioSegundos / 3600);
      const minutosPromedio = Math.floor((promedioSegundos % 3600) / 60);
      const segundosPromedio = Math.floor(promedioSegundos % 60);

      const promedioDuracion = `${horasPromedio}:${minutosPromedio}:${segundosPromedio}`;

      res
        .status(200)
        .json({ promedioDuracion: promedioDuracion, fecha: fecha });
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en Llamada Controller");
    }
  }

  //llamada/problemasResueltos?idUsuario=2
  private async getProblemasResueltos(req: Request, res: Response) {
    try {
      const idAgente = req.query.idUsuario;
      const fechaActual = await db.sequelize.query(
        "SELECT CURRENT_DATE AS fecha_actual",
        { type: db.sequelize.QueryTypes.SELECT }
      );
      const fecha = fechaActual[0].fecha_actual;

      const queryCompleta = await db["Llamada"].findAll({
        where: {
          idUsuario: idAgente,
          fechaInicio: {
            [db.Sequelize.Op.between]: [
              `${fecha} 00:00:00`,
              `${fecha} 23:59:59`,
            ],
          },
        },
        attributes: [
          [
            db.sequelize.fn(
              "SUM",
              db.sequelize.literal(
                "CASE WHEN problemaResuelto = 0 THEN 1 ELSE 0 END"
              )
            ),
            "problemaNoResuelto",
          ],
          [
            db.sequelize.fn(
              "SUM",
              db.sequelize.literal(
                "CASE WHEN problemaResuelto = 1 THEN 1 ELSE 0 END"
              )
            ),
            "problemaResuelto",
          ],
        ],
      });

      const resultado = {
        problemaResuelto: queryCompleta[0].get("problemaResuelto"),
        problemaNoResuelto: queryCompleta[0].get("problemaNoResuelto"),
        fecha: fecha,
      };
      res.status(200).json(resultado);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en Llamada Controller");
    }
  }
}

export default LlamadaController;
