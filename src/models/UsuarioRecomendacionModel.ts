import { Model, Sequelize } from "sequelize";

interface UsuarioRecomendacionAttributes {
    idUsuario: number;
    idRecomendacion: number;
    activa: boolean;
}

module.exports = (sequelize: any, DataTypes: any) => {
    
    class UsuarioRecomendacion extends Model<UsuarioRecomendacionAttributes> implements UsuarioRecomendacionAttributes {
        public idUsuario!: number;
        public idRecomendacion!: number;
        public activa!: boolean;

        static associate(models:any) {

        }

    }

    UsuarioRecomendacion.init({
        idUsuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        idRecomendacion: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        activa: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'UsuarioRecomendacion'
    });

    return UsuarioRecomendacion;
}