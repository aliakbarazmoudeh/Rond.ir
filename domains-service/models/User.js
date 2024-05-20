const { DataTypes } = require("sequelize");
const sequelize = require("../db/connect");
const Domain = require("./Domain");

const User = sequelize.define(
  "User",
  {
    phoneNumber: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: {
          msg: "pleas provide a valid address",
        },
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { notEmpty: true },
    },
    telephoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userType: {
      type: DataTypes.STRING,
      allowNull: false,
      values: ["Customer", "Admin", "Legal", "Owner"],
    },
    productCount: {
      type: DataTypes.SMALLINT,
      defaultValue: 10,
      allowNull: false,
    },
  },
  {
    createdAt: false,
    updatedAt: false,
    indexes: [{ unique: true, fields: ["phoneNumber"] }],
  },
);

User.hasMany(Domain, {
  foreignKey: "ownerID",
  onDelete: "cascade",
  onUpdate: "cascade",
  hooks: true,
});
Domain.belongsTo(User, {
  foreignKey: "ownerID",
  onDelete: "cascade",
  onUpdate: "cascade",
});

module.exports = User;
