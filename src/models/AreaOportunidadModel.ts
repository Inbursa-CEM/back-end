import { Model } from "sequelize";

interface AreaOportunidadAttributes {
  idArea: number;
  nombre: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class AreaOportunidad
    extends Model<AreaOportunidadAttributes>
    implements AreaOportunidadAttributes
  {
    public idArea!: number;
    public nombre!: string;

    // Asociaciones
    static associate(models: any) {
      // Con Usuario
      AreaOportunidad.belongsToMany(models.Usuario, {
        through: "UsuarioArea",
        foreignKey: "idArea",
        otherKey: "idUsuario",
      });

      // Con Curso
      AreaOportunidad.belongsToMany(models.Curso, {
        through: "CursoArea",
        foreignKey: "idArea",
        otherKey: "idCurso",
      });

      // Con Recomendación
      AreaOportunidad.belongsToMany(models.Recomendacion, {
        through: "RecomendacionArea",
        foreignKey: "idArea",
        otherKey: "idRecomendacion",
      });
    }
  }

  AreaOportunidad.init(
    {
      idArea: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "AreaOportunidad",
    }
  );

  return AreaOportunidad;
};
