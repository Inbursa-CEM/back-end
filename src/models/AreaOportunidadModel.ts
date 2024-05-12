import { Model, Sequelize } from "sequelize";

interface AreaOportunidadAttributes {
    idArea: number;
    nombre: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
    class AreaOportunidad extends Model<AreaOportunidadAttributes> implements AreaOportunidadAttributes {
        public idArea!: number;
        public nombre!: string;

        static associate(models:any) {

        }
        
    }


    AreaOportunidad.init({
        idArea: {
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
        modelName: 'Area_Oportunidad'
    });

    return AreaOportunidad;
}