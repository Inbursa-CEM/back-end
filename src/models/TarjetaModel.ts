import { Model } from "sequelize";

interface TarjetaAttributes {
  numCuenta: number;
  tipo: string;
  saldo: number;
  idCliente: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Tarjeta extends Model<TarjetaAttributes> implements TarjetaAttributes {
    public numCuenta!: number;
    public tipo!: string;
    public saldo!: number;
    public idCliente!: number;

    static associate(models: any) {
      Tarjeta.belongsTo(models.Cliente, {
        foreignKey: "idCliente",
        targetKey: "idCliente",
        as: "Cliente",
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
      modelName: "Tarjeta",
    }
  );
  return Tarjeta;
};
