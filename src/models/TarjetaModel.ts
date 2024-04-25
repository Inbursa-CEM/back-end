import  { Model } from "sequelize";

interface TarjetaAttributes {
    numCuenta: number;
    saldo: number;
}

module.exports = (sequelize:any, DataTypes:any) => {
    class Tarjeta extends Model<TarjetaAttributes> implements TarjetaAttributes {
        public numCuenta!: number;
        public saldo!: number;

        static associate(models:any){
        }
    }
    Tarjeta.init({
        numCuenta: {
            type: DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true,
            //autoIncrement: true, 
        },
        saldo: {
            type:DataTypes.INTEGER,
            allowNull:false
        }
    },{
        sequelize,
        modelName:'Tarjeta'
    });
    return Tarjeta;
}