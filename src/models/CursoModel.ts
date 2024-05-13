import { Model, Sequelize } from "sequelize";

interface CursoAttributes {
    idCurso: number;
    nombre: string;
    url: string;
    descripcion: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
    
    class Curso extends Model<CursoAttributes> implements CursoAttributes {
        public idCurso!: number;
        public nombre!: string;
        public url!: string;
        public descripcion!: string;

        // Asociaciones
        static associate(models:any) {
            // con Usuario
            Curso.belongsToMany(models.Usuario,{
                through: 'Usuario_Curso',
                foreignKey: 'idCurso',
                otherKey: 'idUsuario'
            });

            // con Area de oportunidad
            Curso.belongsToMany(models.Area_Oportunidad,{
                through: 'Curso_Area',
                foreignKey: 'id_Curso',
                otherKey: 'id_Area'

            });
        }

    }

    Curso.init({
        idCurso: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        nombre:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        url:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        descripcion:{
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'Curso'
    });

    return Curso;
}