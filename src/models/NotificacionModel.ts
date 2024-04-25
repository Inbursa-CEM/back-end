import { Model, Sequelize } from "sequelize";

interface NotificacionAttributes {
  idNotificacion: number;
  idUsuario: number;
  contenido: string;
  fechaHora: Date;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Notificacion
    extends Model<NotificacionAttributes>
    implements NotificacionAttributes
  {
    public idNotificacion!: number;
    public idUsuario!: number;
    public contenido!: string;
    public fechaHora!: Date;

    static associate(models: any) {
      // define association here
    }
  }
  Notificacion.init(
    {
      idNotificacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      idUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      contenido: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fechaHora: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Notificacion",
    }
  );
  return Notificacion;
};
