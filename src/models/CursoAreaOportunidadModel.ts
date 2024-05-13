import { Model, Sequelize } from "sequelize";

interface CursoAreaOportunidadAttributes {
    id_Curso: number;
    id_Area: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
    
    class CursoAreaOportunidad extends Model<CursoAreaOportunidadAttributes> implements CursoAreaOportunidadAttributes {
        public id_Curso!: number;
        public id_Area!: number;

        static associate(models:any) {

        }

    }

    CursoAreaOportunidad.init({
        id_Curso: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey:true,
            references:{
                model:'Curso',
                key:'idCurso'
            }
        },
        id_Area: {
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
        modelName: 'Curso_Area'
    });

    return CursoAreaOportunidad;
}