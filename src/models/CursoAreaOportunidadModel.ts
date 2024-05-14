import { Model } from "sequelize";

interface CursoAreaOportunidadAttributes {
  idCurso: number;
  idArea: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class CursoAreaOportunidad
    extends Model<CursoAreaOportunidadAttributes>
    implements CursoAreaOportunidadAttributes
  {
    public idCurso!: number;
    public idArea!: number;

    static associate(models: any) {}
  }

  CursoAreaOportunidad.init(
    {
      idCurso: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Curso",
          key: "idCurso",
        },
      },
      idArea: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "AreaOportunidad",
          key: "idArea",
        },
      },
    },
    {
      sequelize,
      modelName: "CursoArea",
    }
  );

  return CursoAreaOportunidad;
};
