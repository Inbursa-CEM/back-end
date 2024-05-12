import { Model, Sequelize } from "sequelize";

interface AreaOportunidadAttributes {
    id: number;
    nombre: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
    class AreaOportunidad extends Model<AreaOportunidadAttributes> implements AreaOportunidadAttributes {
        public id!: number;
        public nombre!: string;

        static associate(models:any) {

        }
        
    }


    AreaOportunidad.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        nombre:{
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'AreaOportunidad'
    });

    return AreaOportunidad;
}