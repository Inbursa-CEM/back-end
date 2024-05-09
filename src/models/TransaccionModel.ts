import  { Model } from "sequelize";

interface TransaccionAttributes {
    idTransaccion: number;
    fecha: Date;
    detalle: string;
    estatus: string;
    monto: number;
    numCuenta: number;
    nombre: string;
}

module.exports = (sequelize:any, DataTypes:any) => {
    class Transaccion extends Model<TransaccionAttributes> implements TransaccionAttributes {
        public idTransaccion!: number;
        public fecha!: Date;
        public detalle!: string;
        public estatus!: string;
        public monto!: number;
        public numCuenta!: number;
        public nombre!: string;

        static associate(models:any){
            Transaccion.belongsTo(models.Tarjeta, {
                foreignKey: 'numCuenta',
                as: 'numCuenta'
            });
        }
    }
    Transaccion.init({
        idTransaccion: {
            type: DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement: true, 
        },
        fecha: {
            type:DataTypes.DATE,
            allowNull:false
        },
        detalle: {
            type:DataTypes.STRING(50),
            allowNull:false
        },
        estatus: {
            type:DataTypes.STRING(50),
            allowNull:false
        },
        monto: {
            type:DataTypes.INTEGER,
            allowNull:false
        },
        numCuenta: {
            type:DataTypes.INTEGER,
            allowNull:false
        },
        nombre: {
            type: DataTypes.STRING(50),
            allowNull:false
        }
    },{
        sequelize,
        modelName:'Transaccion'
    });
    return Transaccion;
}