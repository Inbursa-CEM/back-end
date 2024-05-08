import { Model } from 'sequelize';

interface TransaccionAttributes {
    idTransaccion: number;
    fecha: Date;
    nombre: string;
    detalle: string;
    estatus: string;
    monto: number;
    numCuenta: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
    class Transaccion extends Model<TransaccionAttributes> implements TransaccionAttributes {
        public idTransaccion!: number;
        public fecha!: Date;
        public nombre!: string;
        public detalle!: string;
        public estatus!: string;
        public monto!: number;
        public numCuenta!: number;

        static associate(models: any) {
            // define association here
            Transaccion.belongsTo(models.Tarjeta,{
                foreignKey: 'numCuenta',
                as: 'tarjeta'
            })
        }
    }
    Transaccion.init({
        idTransaccion: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        detalle: {
            type: DataTypes.STRING,
            allowNull: false
        },
        estatus: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        monto: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        numCuenta: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Transaccion'
    });
    return Transaccion;
};