import { Model, Sequelize } from "sequelize";

interface RecomendacionAttributes {
    idRecomendacion: number;
    nombre: string;
    descripcion: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
    
    class Recomendacion extends Model<RecomendacionAttributes> implements RecomendacionAttributes {
        public idRecomendacion!: number;
        public nombre!: string;
        public descripcion!: string;

        // Asociaciones
        static associate(models:any) {

            // con Usuario
            Recomendacion.belongsToMany(models.Usuario,{
                through: 'Usuario_Recomendacion',
                foreignKey: 'idRecomendacion',
                otherKey: 'idUsuario'
            });

            // con Area
            Recomendacion.belongsToMany(models.Area_Oportunidad, {
                through: 'Recomendacion_Area',
                foreignKey: 'idRecomendacion',
                otherKey: 'idArea'
            });

        }

    }

    Recomendacion.init({
        idRecomendacion: {
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