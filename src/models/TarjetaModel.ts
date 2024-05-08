import { Model } from 'sequelize';

interface TarjetaAttributes {
    numCuenta: number;
    saldo: number;
    idCliente: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
    class Tarjeta extends Model<TarjetaAttributes> implements TarjetaAttributes {
        public numCuenta!: number;
        public saldo!: number;
        public idCliente!: number;

        static associate(models: any) {
            // define association here
            Tarjeta.belongsTo(models.Cliente,{
                foreignKey: 'idCliente',
                as: 'cliente'
            });
            Tarjeta.hasMany(models.Transaccion,{
                foreignKey: 'numCuenta',
                as: 'transacciones'
            })
        }
    }
    Tarjeta.init({
        numCuenta: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        saldo: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        idCliente: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Tarjeta'
    });
    return Tarjeta;
};