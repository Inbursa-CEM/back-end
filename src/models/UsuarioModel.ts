import { Model } from 'sequelize';

interface UsuarioAttributes {
    idUsuario: number;
    idConnect: number;
    nombre: string;
    telefono: number;
    correo: string;
    password: string;
    idSupervisor: number;
    departamento: string;
    urlFoto: string;
    rol: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
    class Usuario extends Model<UsuarioAttributes> implements UsuarioAttributes {
        public idUsuario!: number;
        public idConnect!: number;
        public nombre!: string;
        public telefono!: number;
        public correo!: string;
        public password!: string;
        public idSupervisor!: number;
        public departamento!: string;
        public urlFoto!: string;
        public rol!: string;

        static associate(models: any) {
            // define association here
            Usuario.hasMany(models.Llamada,{
                foreignKey: 'idUsuario',
                as: 'llamadas'
            })
        }
    }
    Usuario.init({
        idUsuario: {
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
        password: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        idSupervisor: {
            type: DataTypes.INTEGER,
            allowNull: true
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