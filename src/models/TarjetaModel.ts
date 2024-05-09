import  { Model } from "sequelize";

interface TarjetaAttributes {
    numCuenta: number;
    saldo: number;
    idCliente: number;
    tipo: string;
}

module.exports = (sequelize:any, DataTypes:any) => {
    class Tarjeta extends Model<TarjetaAttributes> implements TarjetaAttributes {
        public numCuenta!: number;
        public saldo!: number;
        public idCliente!: number;
        public tipo!: string;

        static associate(models:any){
            Tarjeta.belongsTo(models.Cliente, {
                foreignKey: 'idCliente',
                as: 'cliente'
            });
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
        },
        idCliente: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },{
        sequelize,
        modelName:'Tarjeta'
    });
    return Tarjeta;
}