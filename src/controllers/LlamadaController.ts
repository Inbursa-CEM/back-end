import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";
import { Sequelize, literal, Op, where } from "sequelize";
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
    this.router.post("/inicioLlamada", this.postInicioLlamada.bind(this));

    this.router.post("/finLlamada", this.postFinLlamada.bind(this));

    this.router.post(
      "/constestaProblemaResuelto",
      this.postProblemaResuelto.bind(this)
    );

    this.router.post(
      "/actualizaUrlTranscripcion",
      this.postUrlTranscripcion.bind(this)
    );

    // GETS
    this.router.get("/consultar/:telefono", this.getConsultar.bind(this));
    this.router.get(
      "/promedioDuracionAgente",
      this.getPromedioDuracionAgente.bind(this)
    );
    this.router.get("/numLlamadasAgente", this.getNumLlamadasAgente.bind(this));
    this.router.get("/satisfaccion", this.getSatisfaccion.bind(this));
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
    this.router.get("/velocidadPromedio", this.getvelocidadPromedio.bind(this));
    this.router.get(
      "/promedioServicioGeneral",
      this.getpromedioServicioGeneral.bind(this)
    );

    this.router.get("/promedioDuracion", this.getPromedioDuracion.bind(this));
    this.router.get("/numLlamadas", this.getNumLlamadas.bind(this));
    this.router.get(
      "/numLlamadasCliente/:telefono",
      this.getNumLlamadasCliente.bind(this)
    );
    this.router.get(
      "/problemasResueltos",
      this.getProblemasResueltos.bind(this)
    );
    // Para obtener la transcripcion requerimos como parámetro contactId
    this.router.get(
      "/transcripcion/:contactId",
      this.getTranscripcion.bind(this)
    );
  }

  // Necesito regresar el id de la llamada para despues hacer los updates o podemos hacerlo con el contactId
  private async postInicioLlamada(req: Request, res: Response) {
    try {
      const newLlamada = await db.Llamada.create({
        fechaInicio: new Date(),
        fechaFin: null,
        problemaResuelto: null,
        idUsuario: req.body.idUsuario,
        idTransaccion: req.body.idTransaccion,
        sentimiento: "NEUTRAL",
        tema: "Problema con una transacción",
        motivo: "Quejas y reclamaciones",
        urlTranscripcion: null,
        contactId: req.body.contactId,
      });
      console.log("Llamada inicializado registrada");
      res.status(200).json(newLlamada);
    } catch (error) {
      console.log("Error en Llamada Controller:", error);
      res.status(500).json({ error: "Error al NotificacionController" });
    }
  }

  // La urlTranscripcion y problemaResuelto se deben mandar por aparte cuando esten listos
  private async postFinLlamada(req: Request, res: Response){
    try{
      const contactId = req.body.contactId;
      
      const newLlamada = await db.Llamada.update({
        fechaFin: new Date(),
        sentimiento: req.body.sentimiento
      },
        {where: {contactId}}
      ); 

      res.status(200).json(newLlamada);
      console.log("Llamada actualizada correctamente en la base de datos");
    }
    catch(error){
      res.status(500).json({error: "Error en Llamada Controller"})
    }
  }

  private async postProblemaResuelto(req: Request, res: Response) {
    try {
      const contactId = req.body.contactId;

      const resultado = await db.Llamada.update(
        {problemaResuelto: req.body.problemaResuelto},
        {where: {contactId}}
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

  private async postUrlTranscripcion(req: Request, res: Response) {
    try {
      // const idLlamada = req.body.idLlamada;
      const contactId = req.body.contactId;

      const resultado = await db.Llamada.update(
        { urlTranscripcion: req.body.urlTranscripcion },
        // { where: { idLlamada } }
        {where: {contactId}}
        
      );

      if (resultado[0] === 1) {
        console.log("Url Transcripcion actualizado correctamente");
        res.status(200).send("Url Transcripcion actualizado correctamente");
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

  private async getTranscripcion(req: Request, res: Response){
    try{
      const contactId = req.params.contactId;

      if (!contactId){
        return res.status(400).send("Parámetro faltante: contactId")
      }
      const input = {
        InstanceId: '2f285133-3727-4651-a3c1-ef5237b3839f',
        ContactId: contactId
      };
      console.log("Input parameters:", input);

      //Obtener la métricas actualizadas
      const command =  await connectLens.listRealtimeContactAnalysisSegments(input).promise();
      res.status(200).json([command]);

    }catch(err){
      console.log(err);
      res.status(500).send("Internal server error " + err);

    }

    this.router.get(
      "/problemasResueltos",
      this.getProblemasResueltos.bind(this)
    );
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

  private async getnumLlamadasPorAgente(req: Request, res: Response) {
    try {
      const idSupervisorTarget = req.query.idSupervisor;

      if (!idSupervisorTarget) {
        return res.status(400).send("idSupervisor is required");
      }

      const numeroLlamadasPorAgente = await db["Llamada"].findAll({
        attributes: [
          [Sequelize.col("Llamada.idUsuario"), "idUsuario"],
          [
            Sequelize.fn("COUNT", Sequelize.col("Llamada.idUsuario")),
            "numLlamadas",
          ],
        ],
        group: ["Llamada.idUsuario", "Usuario.idUsuario"], // Asegura incluir la columna de idUsuario de la tabla Usuario
        include: [
          {
            model: db["Usuario"],
            attributes: ["nombre"],
            as: "Usuario",
            where: { idSupervisor: idSupervisorTarget }, // Filtro aplicado en la relación
          },
        ],
        where: {
          fechaInicio: {
            [Op.gte]: today,
            [Op.lt]: tomorrow,
          },
        },
        raw: true, // Esto aplanará los resultados y evitará el uso de dataValues
      });

      // Transformar el resultado en un formato más legible
      const resultadoTransformado = (numeroLlamadasPorAgente as any[]).map(
        (llamada) => ({
          idUsuario: llamada["Llamada.idUsuario"],
          numLlamadas: llamada["numLlamadas"],
          nombre: llamada["Usuario.nombre"],
        })
      );

      res.status(200).json(resultadoTransformado);
      console.log("Número de llamadas totales por agente");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error en LlamadaController");
    }
  }

  private async getpromedioServicioGeneral(req: Request, res: Response) {
    try {
      const idSupervisorTarget = req.query.idSupervisor;

      const resultado = await db["Llamada"].findOne({
        attributes: [
          "idUsuario",
          [
            Sequelize.literal(
              "AVG(CASE WHEN problemaResuelto = 1 THEN 1 ELSE 0 END)"
            ),
            "promedioServicioGeneral",
          ],
        ],
        include: [
          {
            model: db["Usuario"],
            attributes: ["nombre"],
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
      const idSupervisorTarget = req.query.idSupervisor;

      if (!idSupervisorTarget) {
        return res.status(400).send("idSupervisor is required");
      }

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
          [
            Sequelize.literal(
              "(SUM(CASE WHEN problemaResuelto = 1 THEN 1 ELSE 0 END) / COUNT(*))"
            ),
            "promedioProblemasResueltos",
          ],
        ],
        group: ["idUsuario"],
        include: [
          {
            model: db["Usuario"],
            attributes: ["nombre"],
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

      res.status(200).json(resultado);
      console.log(
        "Número de problemas resueltos, no resueltos y promedio de resueltos por agente"
      );
    } catch (err) {
      console.log(err);
      res.status(500).send("Error en LlamadaController");
    }
  }

  private async getSentimientoPorAgente(req: Request, res: Response) {
    try {
      const idSupervisorTarget = req.query.idSupervisor;

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
        include: [
          {
            model: db["Usuario"],
            attributes: ["nombre"],
            as: "Usuario",
            where: {
              idSupervisor: idSupervisorTarget,
            },
          },
        ],
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
      const idSupervisorTarget = req.query.idSupervisor;

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
        include: [
          {
            model: db["Usuario"],
            attributes: ["nombre"],
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

      res.status(200).json(resultado);
      console.log("Promedio de problemas resueltos por agente");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error en LlamadaController");
    }
  }

  private async getnumLlamadasTotales(req: Request, res: Response) {
    try {
      const idSupervisorTarget = req.query.idSupervisor;

      if (!idSupervisorTarget) {
        return res.status(400).send("idSupervisor is required");
      }

      const totalLlamadasHoy = await db["Llamada"].count({
        include: [
          {
            model: db["Usuario"],
            attributes: ["nombre"],
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

      res.status(200).json({ totalLlamadasHoy });
      console.log("Número total de llamadas de hoy obtenido");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error en LlamadaController");
    }
  }

  private async getpromedioDuracionPorAgente(req: Request, res: Response) {
    try {
      const idSupervisorTarget = req.query.idSupervisor;

      if (!idSupervisorTarget) {
        return res.status(400).send("idSupervisor is required");
      }

      console.log("Calculando duración promedio de llamadas por agente");

      const llamadas = await db["Llamada"].findAll({
        attributes: ["idUsuario", "fechaInicio", "fechaFin"],
        include: [
          {
            model: db["Usuario"],
            attributes: ["nombre"],
            as: "Usuario",
            where: { idSupervisor: idSupervisorTarget }, // Filtro aplicado en la relación
          },
        ],
      });

      const duracionPorAgente: Record<
        string,
        { totalDuracion: number; totalLlamadas: number; nombre: string }
      > = {};

      for (const llamada of llamadas) {
        if (llamada.fechaFin) {
          const idAgente = llamada.idUsuario.toString();
          const nombreAgente = llamada.Usuario.nombre;
          const fechaInicio = new Date(llamada.fechaInicio);
          const fechaFin = new Date(llamada.fechaFin);
          const duracionMs = fechaFin.getTime() - fechaInicio.getTime();

          if (!duracionPorAgente[idAgente]) {
            duracionPorAgente[idAgente] = {
              totalDuracion: 0,
              totalLlamadas: 0,
              nombre: nombreAgente,
            };
          }

          duracionPorAgente[idAgente].totalDuracion += duracionMs;
          duracionPorAgente[idAgente].totalLlamadas++;
        }
      }

      const promedioDuracionPorAgente = Object.entries(duracionPorAgente).map(
        ([idAgente, { totalDuracion, totalLlamadas, nombre }]) => ({
          idAgente,
          nombre,
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

  private async getNumLlamadasAgente(req: Request, res: Response) {
    try {
      const idAgenteTarget = req.body.idAgente;

      const numLlamadas = await db.Llamada.count({
        include: [
          {
            model: db["Usuario"],
            attributes: ["nombre"],
            as: "Usuario",
          },
        ],
        where: {
          idAgente: idAgenteTarget,
          fechaInicio: {
            [Op.gte]: today,
            [Op.lt]: tomorrow,
          },
        },
      });

      res.status(200).json(numLlamadas);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en Llamada Controller");
    }
  }

  private async getSatisfaccion(req: Request, res: Response) {
    try {
      const idAgenteTarget: number = req.body.idAgente;
      const currentDate = literal("CURRENT_DATE");

      const queryCompleta = await db["Llamada"].findAll({
        include: [
          {
            model: db["Usuario"],
            attributes: ["nombre"],
            as: "Usuario",
          },
        ],
        where: {
          idAgente: idAgenteTarget,
          fecha: currentDate,
        },
        attributes: [
          [
            db.sequelize.fn(
              "SUM",
              db.sequelize.literal(
                "CASE WHEN satisfaccion = true THEN 1 ELSE 0 END"
              )
            ),
            "numeroSatisfaccionTrue",
          ],
          [
            db.sequelize.fn(
              "SUM",
              db.sequelize.literal(
                "CASE WHEN satisfaccion = false THEN 1 ELSE 0 END"
              )
            ),
            "numeroSatisfaccionFalse",
          ],
        ],
      });

      const resultado = {
        numeroSatisfaccionTrue: queryCompleta[0].get("numeroSatisfaccionTrue"),
        numeroSatisfaccionFalse: queryCompleta[0].get(
          "numeroSatisfaccionFalse"
        ),
      };
      res.status(200).json(resultado);
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
