import { Model } from 'sequelize';

interface TransaccionAttributes {
    id: number;
    fecha: Date;
    detalle: string;
    estatus: string;
    monto: number;
    numCuenta: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
    class Transaccion extends Model<TransaccionAttributes> implements TransaccionAttributes {
        public id!: number;
        public fecha!: Date;
        public detalle!: string;
        public estatus!: string;
        public monto!: number;
        public numCuenta!: number;

        static associate(models: any) {
            // define association here
        }
    }
    Transaccion.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        fecha: {
            type: DataTypes.DATE,
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