import { Model } from "sequelize";

interface NotificacionAttributes {
  idNotificacion: number;
  idUsuario: number;
  contenido: string;
  fechaHora: Date;
  completada: boolean;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Notificacion
    extends Model<NotificacionAttributes>
    implements NotificacionAttributes {
    public idNotificacion!: number;
    public idUsuario!: number;
    public contenido!: string;
    public fechaHora!: Date;
    public completada!: boolean;

    static associate(models: any) {
      Notificacion.belongsTo(models.Usuario, {
        foreignKey: "idUsuario",
        targetKey: "idUsuario",
        as: "Usuario",
      });
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
        references: {
          model: "Usuario",
          key: "idUsuario",
        },
      },
      contenido: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      fechaHora: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      completada: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Notificacion",
    }
  );
  return Notificacion;
};
