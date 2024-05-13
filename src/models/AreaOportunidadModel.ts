import { Model, Sequelize } from "sequelize";

interface AreaOportunidadAttributes {
    idArea: number;
    nombre: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
    class AreaOportunidad extends Model<AreaOportunidadAttributes> implements AreaOportunidadAttributes {
        public idArea!: number;
        public nombre!: string;

        // Asociaciones
        static associate(models:any) {
            // con Usuario
            AreaOportunidad.belongsToMany(models.Usuario,{
                through: 'Usuario_Area'
            });

            //  con Curso
            AreaOportunidad.belongsToMany(models.Curso, {
                through: 'Curso_Area',
                foreignKey: 'id_Area',
                otherKey: 'id_Curso'
            });

            //  con Recomendacion
            AreaOportunidad.belongsToMany(models.Recomendacion, {
                through: 'Recomendacion_Area',
                foreignKey: 'idArea',
                otherKey: 'idRecomendacion'
            });
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