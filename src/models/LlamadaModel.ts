import { Model } from 'sequelize';

interface LlamadaAttributes {
    id: number;
    fechainicio: Date;
    fechafin: Date;
    calificacion: number;
    idUsuario: number;
    idCliente: number;
    sentimiento: string;
    motivo: string;
    urlTranscripcion: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
    class Llamada extends Model<LlamadaAttributes> implements LlamadaAttributes {
        public id!: number;
        public fechainicio!: Date;
        public fechafin!: Date;
        public calificacion!: number;
        public idUsuario!: number;
        public idCliente!: number;
        public sentimiento!: string;
        public motivo!: string;
        public urlTranscripcion!: string;

        static associate(models: any) {
            // define association here
        }
    }
    Llamada.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        fechainicio: {
            type: DataTypes.DATE,
            allowNull: false
        },
        fechafin: {
            type: DataTypes.DATE,
            allowNull: false
        },
        calificacion: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        idUsuario: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        idCliente: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sentimiento: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        motivo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        urlTranscripcion: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Llamada'
    });
    return Llamada;
};