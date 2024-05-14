import { Model } from "sequelize";

interface RecomendacionAttributes {
  idRecomendacion: number;
  nombre: string;
  descripcion: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Recomendacion
    extends Model<RecomendacionAttributes>
    implements RecomendacionAttributes
  {
    public idRecomendacion!: number;
    public nombre!: string;
    public descripcion!: string;

    // Asociaciones
    static associate(models: any) {
      // Con Usuario
      Recomendacion.belongsToMany(models.Usuario, {
        through: "UsuarioRecomendacion",
        foreignKey: "idRecomendacion",
        otherKey: "idUsuario",
      });

      // Con Área
      Recomendacion.belongsToMany(models.AreaOportunidad, {
        through: "RecomendacionArea",
        foreignKey: "idRecomendacion",
        otherKey: "idArea",
      });
    }
  }

  Recomendacion.init(
    {
      idRecomendacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      nombre: {
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
      modelName: "Recomendacion",
    }
  );

  return Recomendacion;
};
