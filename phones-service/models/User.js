const { DataTypes } = require("sequelize");
const sequelize = require("../db/connect");
const Phone = require("./Phone");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.BIGINT,
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
      values: ["Customer", "Legal", "Admin", "Owner"],
    },
    productCount: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
      allowNull: false,
    },
  },
  { createdAt: false, updatedAt: false },
);

User.hasMany(Phone, {
  foreignKey: "owner",
  onDelete: "cascade",
  onUpdate: "cascade",
  hooks: true,
});
Phone.belongsTo(User, {
  foreignKey: "owner",
  onDelete: "cascade",
  onUpdate: "cascade",
});

module.exports = User;
