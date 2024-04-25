import  { Model } from "sequelize";

interface TransaccionAttributes {
    id: number;
    fecha: Date;
    detalle: string;
    estatus: string;
    monto: number;
    numCuenta: number;
}

module.exports = (sequelize:any, DataTypes:any) => {
    class Transaccion extends Model<TransaccionAttributes> implements TransaccionAttributes {
        public id!: number;
        public fecha!: Date;
        public detalle!: string;
        public estatus!: string;
        public monto!: number;
        public numCuenta!: number;

        static associate(models:any){
        }
    }
    Transaccion.init({
        id: {
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
            type:DataTypes.STRING(50),
            allowNull:false
        }
    },{
        sequelize,
        modelName:'Transaccion'
    });
    return Transaccion;
}