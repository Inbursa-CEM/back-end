import { Request, Response } from "express";
import AbstractController from "./AbstractController";

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
    // this.router.get("/numLlamadas", this.getnumLlamadas.bind(this));
  }

  // private async getnumLlamadas(req: Request, res: Response) {
  //   try {
  //     console.log("UsuarioController works");
  //     res.status(200).send("UsuarioController works");
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).send("Error en UsuarioController");
  //   }
  // }
    //POST
    this.router.post("/contestaSatiafaccion", this.postContestaSatisfaccion.bind(this));

    // GETS
    this.router.get("promedioDuracion", this.getPromedioDuracion.bind(this));
    this.router.get("/numLlamadas", this.getNumLlamadas.bind(this));
    this.router.get("/satisfaccion", this.getSatifaccion.bind(this));
  }
   
  //Post para registrar la satisfaccion de la llamada True o False UPDATE con id de llamada
  private async postContestaSatisfaccion(req: Request, res: Response) {
    try {

      await db.Llamada.create(req.body);

      console.log("Satisfaccion registrada");
      res.status(200).send("Satisfaccion registrada");
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en Llamada Controller");
    }
  }

  //Pedir fecha inicio y fecha fin, que conicidan con el dia de hoy, calcular la duracion (fecha fin - 
  //fecha inicio) y guardarla en un arreglo, después sacar el promedio del arreglo
  private async getPromedioDuracion(req: Request, res: Response) {
    try {
      const idAgenteTarget: number = req.body.idAgente;
      console.log("Consultado promedio de duracion de llamadas del agente del dia--> " + idAgenteTarget);

      // let queryCompleta = await db["Llamada"].findAll({
      //   where: { idAgente: idAgenteTarget },
      //   attributes: [[db.sequelize.fn('AVG', db.sequelize.col('fechaInicio')), 'promedioDuracion']]
      // });

      let queryCompleta = await db["Llamada"].findAll({
        where: { idAgente: idAgenteTarget },
        attributes: [[db.sequelize.fn('AVG', db.sequelize.col('fechaInicio')), 'promedioDuracion']]
      });

    } catch (error) {
      console.log(error);
      res.status(500).send("Error en Llamada Controller");
    }
  }

  //Del idAgente se obtiene el numero de llamadas que ha hecho en el dia actual
  private async getNumLlamadas(req: Request, res: Response) {
    // try {
    //   const idAgenteTarget: number = req.body.idAgente;
    //   console.log("Consultado numero de llamadas del agente del dia actual--> " + idAgenteTarget);  
  
    //   let queryCompleta = await db["Llamada"].findAll({
    //     where: { idAgente: idAgenteTarget },
    //     attributes: [
    //       [db.sequelize.fn('DATE', db.sequelize.col('fechaInicio')), 'fecha'],
    //       [db.sequelize.fn('COUNT', db.sequelize.col('fechaInicio')), 'numeroLlamadas']
    //     ],
    //     group: [db.sequelize.fn('DATE', db.sequelize.col('fechaInicio'))]
    //   });
  
    //   const totalLlamadas = queryCompleta.reduce((total, llamada) => total + llamada.numeroLlamadas, 0);
    //   const promedioLlamadas = totalLlamadas / queryCompleta.length;
  
    //   res.json({ totalLlamadas, promedioLlamadas });
  
    // } catch (error) {
    //   console.log(error);
    //   res.status(500).send("Error en Llamada Controller");
    // }
  }

  //Del idAgente se obtiene el numero de satisfaccion true y false del dia actual
  private async getSatifaccion(req: Request, res: Response) {
    try {
      const idAgenteTarget: number = req.body.idAgente;
      console.log("Consultado el numero de satisfaccion true y false del dia actual--> " + idAgenteTarget);  
  
      // let queryCompleta = await db["Llamada"].findAll({
      //   where: { idAgente: idAgenteTarget },
      //   attributes: [
      //     [
      //       db.sequelize.fn('SUM', db.sequelize.literal('CASE WHEN satisfaccion = true THEN 1 ELSE 0 END')),
      //       'numeroSatisfaccionTrue'
      //     ],
      //     [
      //       db.sequelize.fn('SUM', db.sequelize.literal('CASE WHEN satisfaccion = false THEN 1 ELSE 0 END')),
      //       'numeroSatisfaccionFalse'
      //     ]
      //   ]
      // });

      let queryCompleta = await db["Llamada"].findAll({
        where: { idAgente: idAgenteTarget },
        include: {
          model: db.Llamada,
        },
      });

      const satisfaccion = queryCompleta[0].Llamadas.map((llamada: any) => {
        const idLlamada = llamada.idLlamada;
        const satisfaccion = llamada.satisfaccion;
  
        return {
          idLlamada,
          satisfaccion
        };
      }
      );

      // res.json(queryCompleta);
      res.json(satisfaccion);
  
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en Llamada Controller");
    }
  }
  
}

export default LlamadaController;
