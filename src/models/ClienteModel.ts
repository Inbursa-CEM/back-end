import { Model } from "sequelize";

interface ClienteAttributes {
  idCliente: number;
  nombre: string;
  correo: string;
  password: string;
  telefono: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Cliente extends Model<ClienteAttributes> implements ClienteAttributes {
    public idCliente!: number;
    public nombre!: string;
    public correo!: string;
    public password!: string;
    public telefono!: string;

    static associate(models: any) {
      Cliente.hasMany(models.Cuenta, {
        foreignKey: "idCliente",
        sourceKey: "idCliente",
        as: "Cuenta",
      });
    }
  }
  Cliente.init(
    {
      idCliente: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      correo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      telefono: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Cliente",
    }
  );
  return Cliente;
};
