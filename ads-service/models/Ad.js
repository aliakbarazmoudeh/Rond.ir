const sequelize = require("../db/connect");
const { DataTypes } = require("sequelize");

const Ad = sequelize.define(
  "Ad",
  {
    _id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    ownerID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        isInt: { msg: "pleas provide a valid phone number for owner fields" },
      },
    },
    src: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: "pleas provide a valid url" } },
    },
    plan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      values: [0, 1, 3, 5],
      defaultValue: 0,
    },
    submitted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    payment: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    expireAt: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: { msg: "pleas provide a valid date for expiration" },
      },
    },
    createdAt: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    createdAt: true,
    updatedAt: false,
    indexes: [
      { unique: true, fields: ["_id"] },
      { fields: ["payment", "submitted", "ownerID", "createdAt", "plan"] },
    ],
  },
);

module.exports = Ad;
