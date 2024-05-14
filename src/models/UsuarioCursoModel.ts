import { Model } from "sequelize";

interface UsuarioCursoAttributes {
  idUsuario: number;
  idCurso: number;
  prioridad: number;
  estado: string;
  fecha: Date;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class UsuarioCurso
    extends Model<UsuarioCursoAttributes>
    implements UsuarioCursoAttributes
  {
    public idUsuario!: number;
    public idCurso!: number;
    public prioridad!: number;
    public estado!: string;
    public fecha!: Date;

    static associate(models: any) {}
  }

  UsuarioCurso.init(
    {
      idUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Usuario",
          key: "idUsuario",
        },
      },
      idCurso: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Curso",
          key: "idCurso",
        },
      },
      prioridad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      estado: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "---",
      },
      fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "UsuarioCurso",
    }
  );

  return UsuarioCurso;
};
