const { DataTypes } = require("sequelize");
const sequelize = require("../db/connect");

const Phone = sequelize.define(
  "Phone",
  {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    ownerID: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    preCode: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    number: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    phoneType: {
      type: DataTypes.STRING,
      allowNull: false,
      values: ["هشت رقمی", "پنج رقمی", "چهار رقمی", "اینترنتی"],
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    usage: {
      type: DataTypes.STRING,
      values: ["مسکونی", "اداری", "تجاری"],
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      values: [0, 1, 2],
      validate: {
        notEmpty: true,
      },
    },
    rondType: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        min: { args: 1, msg: "rond type must be at least 1" },
        max: { args: 40, msg: "rond type must be at most 40" },
      },
    },
    termsOfSale: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      values: [1, 2, 3],
    },
    plan: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      values: [0, 1, 3, 5],
      defaultValue: 0,
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
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "pleas provide a valid description" },
      },
      defaultValue: "فاقد توضیحات",
    },
    createdAt: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    updatedAt: false,
    createdAt: true,
    indexes: [
      { unique: true, fields: ["number", "preCode"] },
      { unique: true, fields: ["_id"] },
      { fields: ["payment", "createdAt", "plan"] },
    ],
  },
);

module.exports = Phone;
