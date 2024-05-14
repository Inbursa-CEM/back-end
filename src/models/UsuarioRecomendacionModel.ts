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
            primaryKey:true,
            references:{
                model:'Usuario',
                key:'idUsuario'
            }
        },
        idRecomendacion: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey:true,
            references:{
                model:'Recomendacion',
                key:'idRecomendacion'
            }
        },
        activa: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        }
    }, {
        sequelize,
        modelName: 'Usuario_Recomendacion'
    });

    return UsuarioRecomendacion;
}