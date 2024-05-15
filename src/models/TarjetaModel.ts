import { Model } from "sequelize";

interface TarjetaAttributes {
  numCuenta: number;
  tipo: string;
  saldo: number;
  idCuenta: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Tarjeta extends Model<TarjetaAttributes> implements TarjetaAttributes {
    public numCuenta!: number;
    public tipo!: string;
    public saldo!: number;
    public idCuenta!: number;

    static associate(models: any) {
      Tarjeta.belongsTo(models.Cuenta, {
        foreignKey: "idCuenta",
        targetKey: "idCuenta",
        as: "Cuenta",
      });
      Tarjeta.hasMany(models.Transaccion, {
        foreignKey: "numCuenta",
        sourceKey: "numCuenta",
        as: "Transaccion",
      });
    }
  }
  Tarjeta.init(
    {
      numCuenta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      tipo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      saldo: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      idCuenta: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Cuenta",
          key: "idCuenta",
        },
      },
    },
    {
      sequelize,
      modelName: "Tarjeta",
    }
  );
  return Tarjeta;
};
