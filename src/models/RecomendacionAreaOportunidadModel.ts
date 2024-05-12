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
        },
        idArea: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'RecomendacionAreaOportunidad'
    });

    return RecomendacionAreaOportunidad;
}