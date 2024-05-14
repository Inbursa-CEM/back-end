import { Model } from "sequelize";

interface CursoAttributes {
  idCurso: number;
  nombre: string;
  url: string;
  descripcion: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Curso extends Model<CursoAttributes> implements CursoAttributes {
    public idCurso!: number;
    public nombre!: string;
    public url!: string;
    public descripcion!: string;

    // Asociaciones
    static associate(models: any) {
      // Con Usuario
      Curso.belongsToMany(models.Usuario, {
        through: models.UsuarioCurso,
        foreignKey: "idCurso",
        otherKey: "idUsuario",
      });

      // Con Área de oportunidad
      Curso.belongsToMany(models.AreaOportunidad, {
        through: "CursoArea",
        foreignKey: "idCurso",
        otherKey: "idArea",
      });
    }
  }

  Curso.init(
    {
      idCurso: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Curso",
    }
  );

  return Curso;
};
