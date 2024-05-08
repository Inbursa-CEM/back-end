import { Model } from 'sequelize';

interface ClienteAttributes {
    idCliente: number;
    nombre: string;
    correo: string;
    password: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
    class Cliente extends Model<ClienteAttributes> implements ClienteAttributes {
        public idCliente!: number;
        public nombre!: string;
        public correo!: string;
        public password!: string;

        static associate(models: any) {
            // define association here
            Cliente.hasMany(models.Llamada,{
                foreignKey: 'idCliente',
                as: 'llamadas'
            });
            Cliente.hasMany(models.Tarjeta,{
                foreignKey: 'idCliente',
                as: 'tarjetas'
            })
        }
    }
    Cliente.init({
        idCliente: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        correo: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(30),
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Cliente'
    });
    return Cliente;
};