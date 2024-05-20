const { DataTypes } = require("sequelize");
const sequelize = require("../db/connect");

const Save = sequelize.define(
  "Save",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    plan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      values: [1, 3, 5],
    },
    termOfSale: {
      type: DataTypes.INTEGER,
      allowNull: false,
      values: [1, 2, 3],
    },
    service: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  { updatedAt: false, createdAt: true },
);

module.exports = Save;
