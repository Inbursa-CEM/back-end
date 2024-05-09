import { Model } from "sequelize";

interface LlamadaAttributes {
  idLlamada: number;
  fechaInicio: Date;
  fechaFin: Date;
  calificacion: number;
  idUsuario: number;
  idCliente: number;
  sentimiento: string;
  tema: string
  motivo: string;
  urlTranscripcion: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Llamada extends Model<LlamadaAttributes> implements LlamadaAttributes {
    public idLlamada!: number;
    public fechaInicio!: Date;
    public fechaFin!: Date;
    public calificacion!: number;
    public idUsuario!: number;
    public idCliente!: number;
    public sentimiento!: string;
    public tema!: string;
    public motivo!: string;
    public urlTranscripcion!: string;

    static associate(models: any) {
      Llamada.belongsTo(
        models.Usuario,
         {
          foreignKey: "idUsuario",
          targetKey: "idUsuario",
          as: "Usuario",
        }
      );
      Llamada.belongsTo(models.Cliente, {
        foreignKey: "idCliente",
        targetKey: "idCliente",
        as: "Cliente",
      });
    }
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
      calificacion: {
        type: DataTypes.INTEGER,
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
      idCliente: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Cliente",
          key: "idCliente",
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
