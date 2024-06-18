import { Model } from "sequelize";

interface ReporteAttributes {
  idReporte: number;
  idTransaccion: number;
  idCliente: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Reporte extends Model<ReporteAttributes> implements ReporteAttributes {
    public idReporte!: number;
    public idTransaccion!: number;
    public idCliente!: number;

    static associate(models: any) {}
  }
  Reporte.init(
    {
      idReporte: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      idTransaccion: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      idCliente: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Reporte",
    }
  );
  return Reporte;
};
