import { Model } from "sequelize";

interface UsuarioAreaOportunidadAttributes {
  idUsuario: number;
  idArea: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class UsuarioAreaOportunidad
    extends Model<UsuarioAreaOportunidadAttributes>
    implements UsuarioAreaOportunidadAttributes
  {
    public idUsuario!: number;
    public idArea!: number;

    static associate(models: any) {}
  }

  UsuarioAreaOportunidad.init(
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
      modelName: "UsuarioArea",
    }
  );

  return UsuarioAreaOportunidad;
};
