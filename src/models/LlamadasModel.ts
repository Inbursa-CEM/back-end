import { Model, Sequelize } from "sequelize";

interface LlamadasAttributes {
    id: number;
    fecha_inicio: Date;
    fecha_fin: Date;
    calificacion: number;
    idAgente: number;
    idCliente: number;
    motivo: string;
    sentimiento: string
}

module.exports = (sequelize:any,DataTypes:any) => {
    class Llamadas extends Model<LlamadasAttributes> implements LlamadasAttributes {
        public id_llamada!: number;
        public fecha_inicio!: Date;
        public fecha_fin!: Date;
        public calificacion!: number;
        public idAgente: number;
        public idCliente: number;
        public motivo: string;
        public sentimiento: string;

        static associate(models:any) {
            // define association here
        }
    }
    Llamadas.init({
        id_llamada: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        fecha_inicio: {
            type: DataTypes.DATE,
            allowNull: false
        },
        fecha_fin: {
            type: DataTypes.DATE,
            allowNull: false
        },
        calificacion: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        idAgente: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreingKey: true
        },
        idCliente: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreingKey: true
        },
        motivo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sentimiento: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Llamadas'
    });
    return Llamadas;
};    
        