import { Model, Sequelize } from "sequelize";

interface RecomendacionAreaOportunidadAttributes {
    idRecomendacion: number;
    idArea: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
    
    class RecomendacionAreaOportunidad extends Model<RecomendacionAreaOportunidadAttributes> implements RecomendacionAreaOportunidadAttributes {
        public idRecomendacion!: number;
        public idArea!: number;

        static associate(models:any) {

        }

    }

    RecomendacionAreaOportunidad.init({
        idRecomendacion: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey:true,
            references:{
                model:'Recomendacion',
                key:'idRecomendacion'
            }
        },
        idArea: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey:true,
            references:{
                model:'Area_Oportunidad',
                key:'idArea'
            }
        }
    }, {
        sequelize,
        modelName: 'Recomendacion_Area'
    });

    return RecomendacionAreaOportunidad;
}