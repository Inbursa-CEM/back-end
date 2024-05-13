import { Model, Sequelize } from "sequelize";

interface UsuarioAreaOportunidadAttributes {
    idUsuario: number;
    idArea: number;
}

module.exports = (sequelize: any, DataTypes: any) => {

    class UsuarioAreaOportunidad extends Model<UsuarioAreaOportunidadAttributes> implements UsuarioAreaOportunidadAttributes {
        public idUsuario!: number;
        public idArea!: number;

        static associate(models: any) {

        }

    }

    UsuarioAreaOportunidad.init({
        idUsuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey:true,
            references:{
                model:'Usuario',
                key:'idUsuario'
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
        modelName: 'Usuario_Area'
    });

    return UsuarioAreaOportunidad;
}