import { Model, Sequelize } from "sequelize";

interface RecomendacionAttributes {
    id: number;
    nombre: string;
    descripcion: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
    
    class Recomendacion extends Model<RecomendacionAttributes> implements RecomendacionAttributes {
        public id!: number;
        public nombre!: string;
        public descripcion!: string;

        static associate(models:any) {

        }

    }

    Recomendacion.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        nombre:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        descripcion:{
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'Recomendacion'
    });

    return Recomendacion;
}