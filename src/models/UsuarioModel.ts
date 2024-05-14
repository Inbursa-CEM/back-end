import { Model } from "sequelize";

interface UsuarioAttributes {
  idUsuario: number;
  idConnect: string;
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
    public idConnect!: string;
    public nombre!: string;
    public telefono!: number;
    public correo!: string;
    public password!: string;
    public idSupervisor!: number;
    public departamento!: string;
    public urlFoto!: string;
    public rol!: string;

    static associate(models: any) {
      Usuario.belongsToMany(models.Transaccion, {
        through: "Llamada",
        foreignKey: "idUsuario",
        otherKey: "idTransaccion",
      });
      Usuario.hasMany(models.Notificacion, {
        foreignKey: "idUsuario",
        sourceKey: "idUsuario",
        as: "Notificacion",
      });
      Usuario.belongsToMany(models.AreaOportunidad, {
        through: "UsuarioArea",
        foreignKey: "idUsuario",
        otherKey: "idArea",
      });
      Usuario.belongsToMany(models.Curso, {
        through: models.UsuarioCurso,
        foreignKey: "idUsuario",
        otherKey: "idCurso",
      });
      Usuario.belongsToMany(models.Recomendacion, {
        through: "UsuarioRecomendacion",
        foreignKey: "idUsuario",
        otherKey: "idRecomendacion",
      });
    }
  }
  Usuario.init(
    {
      idUsuario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      idConnect: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      telefono: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      correo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      idSupervisor: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Usuario",
          key: "idUsuario",
        },
      },
      departamento: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      urlFoto: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rol: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Usuario",
    }
  );
  return Usuario;
};
