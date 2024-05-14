import { Model } from "sequelize";

interface CuentaAttributes {
  idCuenta: number;
  idCliente: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Cuenta extends Model<CuentaAttributes> implements CuentaAttributes {
    public idCuenta!: number;
    public idCliente!: number;

    // Asociaciones
    static associate(models: any) {
      Cuenta.hasMany(models.Tarjeta, {
        foreignKey: "idCuenta",
        sourceKey: "idCuenta",
      });
    }
  }

  Cuenta.init(
    {
      idCuenta: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      idCliente: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Cliente",
          key: "idCliente",
        },
      },
    },
    {
      sequelize,
      modelName: "Cuenta",
    }
  );

  return Cuenta;
};
