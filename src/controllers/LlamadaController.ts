import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";
import { Sequelize, literal, Op, where } from "sequelize";

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
    this.router.get(
      "/velocidadPromedio",
      this.getvelocidadPromedio.bind(this)
    );
    this.router.get(
      "/promedioServicioGeneral",
      this.getpromedioServicioGeneral.bind(this)
    );
  }

  
//Regresa el numero de llamadas que ha realizado cada agente el dia de hoy
  private async getnumLlamadasPorAgente(req: Request, res: Response) {
    try {
      const idSupervisorTarget = req.query.idSupervisor;
  
      if (!idSupervisorTarget) {
        return res.status(400).send("idSupervisor is required");
      }
  
      const numeroLlamadasPorAgente = await db["Llamada"].findAll({
        attributes: [
          [Sequelize.col("Llamada.idUsuario"), "idUsuario"],
          [Sequelize.fn("COUNT", Sequelize.col("Llamada.idUsuario")), "numLlamadas"],
        ],
        group: ["Llamada.idUsuario", "Usuario.idUsuario"], // Asegura incluir la columna de idUsuario de la tabla Usuario
        include: [{
          model: db["Usuario"],
          attributes: ["nombre"],
          as: 'Usuario',
          where: { idSupervisor: idSupervisorTarget } // Filtro aplicado en la relación
        }],
        where: {
          fechaInicio: {
            [Op.gte]: today,
            [Op.lt]: tomorrow
          }
        },
        raw: true // Esto aplanará los resultados y evitará el uso de dataValues
      });
  
      // Transformar el resultado en un formato más legible
      const resultadoTransformado = (numeroLlamadasPorAgente as any[]).map(llamada => ({
        idUsuario: llamada['Llamada.idUsuario'],
        numLlamadas: llamada['numLlamadas'],
        nombre: llamada['Usuario.nombre']
      }));
  
      res.status(200).json(resultadoTransformado);
      console.log("Número de llamadas totales por agente");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error en LlamadaController");
    }
  }

 // Regresa el promedio de servicio
private async getpromedioServicioGeneral(req: Request, res: Response) {
  try {
      // Obtener el idSupervisor de la consulta
      const idSupervisorTarget = req.query.idSupervisor;

      // Consulta a la base de datos para obtener una única entrada con el promedio general de problemas resueltos
      const resultado = await db["Llamada"].findOne({
          attributes: [
              "idUsuario", // Seleccionar el id del usuario (agente)
              [
                  // Calcular el promedio de problemas resueltos usando una expresión SQL
                  Sequelize.literal(
                      "AVG(CASE WHEN problemaResuelto = 1 THEN 1 ELSE 0 END)"
                  ),
                  "promedioServicioGeneral", // Asignar un alias al resultado calculado
              ],
          ],
          include: [{
              model: db["Usuario"],
              attributes: ["nombre"], // Incluir el nombre del agente
              as: 'Usuario',
              where: {
                  idSupervisor: idSupervisorTarget // Filtrar los usuarios por idSupervisor
              }
          }],
          where: {
              // Filtrar las llamadas por fecha de inicio, considerando solo las de hoy
              fechaInicio: {
                  [Op.gte]: today,
                  [Op.lt]: tomorrow
              }
          }
      });

      // Verificar si se encontró un resultado y si el promedio no es nulo
      if (resultado && resultado.getDataValue("promedioServicioGeneral") !== null) {
          // Convertir el promedio de un valor entre 0 y 1 a un porcentaje
          const promedioServicioGeneral = resultado.getDataValue("promedioServicioGeneral") * 100;
          // Actualizar el valor del promedio en el resultado
          resultado.setDataValue("promedioServicioGeneral", promedioServicioGeneral);
      }

      res.status(200).json(resultado);
      console.log("Promedio del servicio en general");
  } catch (err) {
      console.log(err);
      res.status(500).send("Error en LlamadaController");
  }
}


  //Regresa la cantidad de problemas resueltos, noresueltos y su promedio
  private async getreportesAtendidosPorAgente(req: Request, res: Response) {
    try {
        // Obtiene el id del supervisor del query parameter
        const idSupervisorTarget = req.query.idSupervisor;

        // Verifica si el id del supervisor fue proporcionado
        if (!idSupervisorTarget) {
            return res.status(400).send("idSupervisor is required");
        }

        // Realiza una consulta a la base de datos para obtener las llamadas atendidas por agentes bajo el supervisor especificado
        const resultado = await db["Llamada"].findAll({
            attributes: [
                "idUsuario", // Selecciona el id del usuario
                [
                    Sequelize.literal(
                        "SUM(CASE WHEN problemaResuelto = 1 THEN 1 ELSE 0 END)"
                    ),
                    "problemasResueltos", // Calcula el número de problemas resueltos
                ],
                [
                    Sequelize.literal(
                        "SUM(CASE WHEN problemaResuelto = 0 THEN 1 ELSE 0 END)"
                    ),
                    "problemasNoResueltos", // Calcula el número de problemas no resueltos
                ],
                [
                    Sequelize.literal(
                        "(SUM(CASE WHEN problemaResuelto = 1 THEN 1 ELSE 0 END) / COUNT(*))"
                    ),
                    "promedioProblemasResueltos", // Calcula el promedio de problemas resueltos
                ],
            ],
            group: ["idUsuario"], // Agrupa los resultados por idUsuario
            include: [{
                model: db["Usuario"],
                attributes: ["nombre"], // Incluye el nombre del usuario
                as: 'Usuario',
                where: {
                    idSupervisor: idSupervisorTarget // Filtra usuarios por idSupervisor
                }
            }],
            where: {
                fechaInicio: {
                    [Op.gte]: today, 
                    [Op.lt]: tomorrow 
                }
            }
        });

        // Responde con los resultados de la consulta
        res.status(200).json(resultado);
        console.log("Número de problemas resueltos, no resueltos y promedio de resueltos por agente");
    } catch (err) {
        console.log(err);
        // En caso de error, responde con un estado 500
        res.status(500).send("Error en LlamadaController");
    }
}


  // Regresa número de veces que aparece cada sentimiento por agente
private async getSentimientoPorAgente(req: Request, res: Response) {
  try {
      // Obtener el idSupervisor de la consulta
      const idSupervisorTarget = req.query.idSupervisor;

      // Consulta a la base de datos para obtener el número de veces que aparece cada sentimiento por agente
      const resultado = await db["Llamada"].findAll({
          attributes: [
              "idUsuario", // Seleccionar el id del usuario (agente)
              [
                  // Calcular el número de llamadas con sentimiento positivo
                  Sequelize.literal(
                      'SUM(CASE WHEN sentimiento = "positivo" THEN 1 ELSE 0 END)'
                  ),
                  "positivo", // Asignar un alias al resultado calculado
              ],
              [
                  // Calcular el número de llamadas con sentimiento negativo
                  Sequelize.literal(
                      'SUM(CASE WHEN sentimiento = "negativo" THEN 1 ELSE 0 END)'
                  ),
                  "negativo", // Asignar un alias al resultado calculado
              ],
              [
                  // Calcular el número de llamadas con sentimiento neutral
                  Sequelize.literal(
                      'SUM(CASE WHEN sentimiento = "neutral" THEN 1 ELSE 0 END)'
                  ),
                  "neutral",
              ],
          ],
          group: ["idUsuario"], 
          include: [{
              model: db["Usuario"],
              attributes: ["nombre"], 
              as: 'Usuario',
              where: {
                  idSupervisor: idSupervisorTarget 
              }
          }],
      });
      res.status(200).json(resultado);
      console.log("Número de veces que aparece cada sentimiento por agente");
  } catch (err) {
      console.log(err);
      res.status(500).send("Error en LlamadaController");
  }
}


  // Regresa el promedio de problemas resueltos por agente
private async getpromedioServicioPorAgente(req: Request, res: Response) {
  try {
      // Obtener el idSupervisor de la consulta
      const idSupervisorTarget = req.query.idSupervisor;

      // Consulta a la base de datos para obtener las llamadas de los agentes supervisados por el idSupervisor
      const resultado = await db["Llamada"].findAll({
          attributes: [
              "idUsuario", // Seleccionar el id del usuario (agente)
              [
                  // Calcular el promedio de problemas resueltos usando una expresión SQL
                  Sequelize.literal(
                      "AVG(CASE WHEN problemaResuelto = 1 THEN 1 ELSE 0 END)"
                  ),
                  "promedioProblemasResueltos", // Asignar un alias al resultado calculado
              ],
          ],
          group: ["idUsuario"], // Agrupar resultados por idUsuario (agente)
          include: [{
              model: db["Usuario"],
              attributes: ["nombre"], // Incluir el nombre del agente
              as: 'Usuario',
              where: {
                  idSupervisor: idSupervisorTarget // Filtrar los usuarios por idSupervisor
              }
          }],
          where: {
              // Filtrar las llamadas por fecha de inicio, considerando solo las de hoy
              fechaInicio: {
                  [Op.gte]: today,
                  [Op.lt]: tomorrow 
              }
          }
      });

      // Enviar la respuesta con el resultado de la consulta
      res.status(200).json(resultado);
      console.log("Promedio de problemas resueltos por agente");
  } catch (err) {
      // En caso de error, registrar el error y enviar una respuesta de error
      console.log(err);
      res.status(500).send("Error en LlamadaController");
  }
}

  //Regresa el numero de llamadas que han realizado todos los agentes asociados al supervisor el dia de hoy
  private async getnumLlamadasTotales(req: Request, res: Response) {
    try {
      const idSupervisorTarget = req.query.idSupervisor;
  
      if (!idSupervisorTarget) {
        return res.status(400).send("idSupervisor is required");
      }
  
      const totalLlamadasHoy = await db["Llamada"].count({
        include: [{
          model: db["Usuario"],
          attributes: ["nombre"],
          as: 'Usuario',
          where: {
            idSupervisor: idSupervisorTarget
          }
        }],
        where: {
          fechaInicio: {
            [Op.gte]: today,
            [Op.lt]: tomorrow
          }
        }
      });
  
      res.status(200).json({ totalLlamadasHoy });
      console.log("Número total de llamadas de hoy obtenido");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error en LlamadaController");
    }
  }


      // Regresa la duración promedio de las llamadas por agente
private async getpromedioDuracionPorAgente(req: Request, res: Response) {
  try {
      // Obtener el idSupervisor de la consulta
      const idSupervisorTarget = req.query.idSupervisor;

      // Si no se proporciona idSupervisor, enviar una respuesta de error
      if (!idSupervisorTarget) {
          return res.status(400).send("idSupervisor is required");
      }

      console.log("Calculando duración promedio de llamadas por agente");

      // Obtener todas las llamadas que pertenecen a los agentes supervisados por el idSupervisor proporcionado
      const llamadas = await db["Llamada"].findAll({
          attributes: ["idUsuario", "fechaInicio", "fechaFin"], // Seleccionar las columnas relevantes
          include: [{
              model: db["Usuario"],
              attributes: ["nombre"], // Incluir el nombre del agente
              as: 'Usuario',
              where: { idSupervisor: idSupervisorTarget } // Aplicar filtro basado en idSupervisor
          }],
      });

      // Inicializar un objeto para almacenar la duración total y el número de llamadas por agente
      const duracionPorAgente: Record<
          string,
          { totalDuracion: number; totalLlamadas: number; nombre: string }
      > = {};

      // Iterar sobre las llamadas
      for (const llamada of llamadas) {
          if (llamada.fechaFin) { // Solo considerar llamadas que han finalizado
              const idAgente = llamada.idUsuario.toString(); // Obtener el id del agente
              const nombreAgente = llamada.Usuario.nombre; // Obtener el nombre del agente
              const fechaInicio = new Date(llamada.fechaInicio); // Convertir fechaInicio a objeto Date
              const fechaFin = new Date(llamada.fechaFin); // Convertir fechaFin a objeto Date
              const duracionMs = fechaFin.getTime() - fechaInicio.getTime(); // Calcular la duración de la llamada en milisegundos

              // Si el agente no está en el objeto, inicializar su entrada
              if (!duracionPorAgente[idAgente]) {
                  duracionPorAgente[idAgente] = { totalDuracion: 0, totalLlamadas: 0, nombre: nombreAgente };
              }

              // Sumar la duración de la llamada y contar la llamada
              duracionPorAgente[idAgente].totalDuracion += duracionMs;
              duracionPorAgente[idAgente].totalLlamadas++;
          }
      }

      // Calcular la duración promedio de las llamadas por agente
      const promedioDuracionPorAgente = Object.entries(duracionPorAgente).map(
          ([idAgente, { totalDuracion, totalLlamadas, nombre }]) => ({
              idAgente,
              nombre,
              tiempoPromedio: totalDuracion / totalLlamadas / 60000, // Duración promedio en minutos
          })
      );
      res.status(200).json(promedioDuracionPorAgente);
  } catch (error) {
      console.log(error);
      res.status(500).send("Error en calcular duración promedio de llamadas por agente");
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

      console.log("Calculando duración promedio de llamadas por agente");
      const llamadas = await db["Llamada"].findAll({
        attributes: ["idUsuario", "fechaInicio", "fechaFin"],
        group: ["idUsuario"],
        include: [{
          model: db["Usuario"],
          attributes: ["nombre"],
          as: 'Usuario'
        }],
        where: {
          fechaInicio: {
            [Op.gte]: today,
            [Op.lt]: tomorrow
          }
        }
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

  private async getNumLlamadasAgente(req: Request, res: Response) {
    try {

      const idAgenteTarget = req.body.idAgente;

      const numLlamadas = await db.Llamada.count({
        include: [{
          model: db["Usuario"],
          attributes: ["nombre"],
          as: 'Usuario',
        }],
        where: {
          idAgente: idAgenteTarget,
          fechaInicio: { 
            [Op.gte]: today, 
            [Op.lt]: tomorrow }
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
        include: [{
          model: db["Usuario"],
          attributes: ["nombre"],
          as: 'Usuario',
        }],
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
  
  //Regresa la velocidad promedio en que se tarda un agente en atender una llamada
  private async getvelocidadPromedio(req: Request, res: Response) {
    try {
        // Obtiene el id del supervisor del query parameter
        const idSupervisorTarget = req.query.idSupervisor;

        // Verifica si el id del supervisor fue proporcionado
        if (!idSupervisorTarget) {
            return res.status(400).send("idSupervisor is required");
        }

        console.log("Calculando duración promedio de llamadas de todos los usuarios asociados al supervisor");

        // Busca todas las llamadas de los usuarios asociados al supervisor especificado
        const llamadas = await db["Llamada"].findAll({
            attributes: ["fechaInicio", "fechaFin"], // Solo selecciona las fechas de inicio y fin de las llamadas
            include: [{
                model: db["Usuario"],
                attributes: [], // No selecciona atributos adicionales del usuario
                as: 'Usuario',
                where: {
                    idSupervisor: idSupervisorTarget // Filtra usuarios por idSupervisor
                }
            }],
            where: {
                fechaInicio: {
                    [Op.gte]: today, 
                    [Op.lt]: tomorrow 
                }
            }
        });

        console.log(`Llamadas encontradas: ${llamadas.length}`);

        // Inicializa contadores para la duración total y el número de llamadas
        let totalDuracion = 0;
        let totalLlamadas = 0;

        // Itera sobre cada llamada encontrada
        for (const llamada of llamadas) {
            const fechaInicio = llamada.fechaInicio ? new Date(llamada.fechaInicio) : null;
            const fechaFin = llamada.fechaFin ? new Date(llamada.fechaFin) : null;

            // Si ambas fechas están disponibles, calcula la duración de la llamada
            if (fechaInicio && fechaFin) {
                const duracionMs = fechaFin.getTime() - fechaInicio.getTime();
                totalDuracion += duracionMs; // Suma la duración al total
                totalLlamadas++; // Incrementa el contador de llamadas
            } else {
                console.log(`Llamada con id ${llamada.id} tiene fechaInicio o fechaFin nulo.`);
            }
        }

        // Si no hay llamadas válidas, devuelve una duración promedio de 0
        if (totalLlamadas === 0) {
            return res.status(200).json({ tiempoPromedio: 0 });
        }

        // Calcula la duración promedio en minutos
        const velocidadPromedio = totalDuracion / totalLlamadas / 60000;

        // Devuelve la duración promedio calculada
        res.status(200).json({ velocidadPromedio });
        console.log("Duración promedio de llamadas calculada");
    } catch (error) {
        console.log(error);
        // En caso de error, devuelve un estado 500
        res.status(500).send("Error en calcular duración promedio de llamadas");
    }
}


}

export default LlamadaController;
