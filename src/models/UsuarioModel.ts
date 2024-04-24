import { Model } from 'sequelize';

interface UsuarioAttributes {
    id: number;
    idConnect: number;
    nombre: string;
    telefono: number;
    correo: string;
    contrasena: string;
    idSupervisor: number;
    departamento: string;
    urlFoto: string;
    rol: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
    class Usuario extends Model<UsuarioAttributes> implements UsuarioAttributes {
        public id!: number;
        public idConnect!: number;
        public nombre!: string;
        public telefono!: number;
        public correo!: string;
        public contrasena!: string;
        public idSupervisor!: number;
        public departamento!: string;
        public urlFoto!: string;
        public rol!: string;

        static associate(models: any) {
            // define association here
        }
    }
    Usuario.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        idConnect: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        telefono: {
            type: DataTypes.INTEGER(10),
            allowNull: false
        },
        correo: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        contrasena: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        idSupervisor: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        departamento: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        urlFoto: {
            type: DataTypes.STRING,
            allowNull: false
        },
        rol: {
            type: DataTypes.STRING(30),
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Usuario'
    });
    return Usuario;
};