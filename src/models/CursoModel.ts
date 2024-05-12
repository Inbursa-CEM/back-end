import { Model, Sequelize } from "sequelize";

interface CursoAttributes {
    id: number;
    nombre: string;
    url: string;
    descripcion: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
    
    class Curso extends Model<CursoAttributes> implements CursoAttributes {
        public id!: number;
        public nombre!: string;
        public url!: string;
        public descripcion!: string;

        static associate(models:any) {

        }

    }

    Curso.init({
        id: {
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