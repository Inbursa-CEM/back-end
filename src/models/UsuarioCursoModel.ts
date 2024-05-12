import { Model, Sequelize } from "sequelize";

interface UsuarioCursoAttributes {
    idUsuario: number;
    idCurso: number;
    prioridad: number;
    estado: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
    
    class UsuarioCurso extends Model<UsuarioCursoAttributes> implements UsuarioCursoAttributes {
        public idUsuario!: number;
        public idCurso!: number;
        public prioridad!: number;
        public estado!: string;

        static associate(models:any) {

        }

    }

    UsuarioCurso.init({
        idUsuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        idCurso: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        prioridad: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'UsuarioCurso'
    });

    return UsuarioCurso;
}