import { Model } from "sequelize";

interface LlamadaAttributes {
  idLlamada: number;
  fechaInicio: Date;
  fechaFin: Date;
  problemaResuelto: boolean;
  idUsuario: number;
  idTransaccion: number;
  sentimiento: string;
  tema: string;
  motivo: string;
  urlTranscripcion: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Llamada extends Model<LlamadaAttributes> implements LlamadaAttributes {
    public idLlamada!: number;
    public fechaInicio!: Date;
    public fechaFin!: Date;
    public problemaResuelto!: boolean;
    public idUsuario!: number;
    public idTransaccion!: number;
    public sentimiento!: string;
    public tema!: string;
    public motivo!: string;
    public urlTranscripcion!: string;

    static associate(models: any) {}
  }
  Llamada.init(
    {
      idLlamada: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      fechaInicio: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      fechaFin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      problemaResuelto: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      idUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Usuario",
          key: "idUsuario",
        },
      },
      idTransaccion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Transaccion",
          key: "idTransaccion",
        },
      },
      sentimiento: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tema: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      motivo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      urlTranscripcion: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Llamada",
    }
  );
  return Llamada;
};
