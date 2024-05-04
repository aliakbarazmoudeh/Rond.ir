const { DataTypes } = require('sequelize');
const sequelize = require('../db/connect');

const Phone = sequelize.define(
  'Phone',
  {
    _id: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    areaCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    phoneType: {
      type: DataTypes.STRING,
      allowNull: false,
      values: ['هشت رقمی', 'پنج رقمی', 'چهار رقمی', 'اینترنتی'],
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    usage: {
      type: DataTypes.STRING,
      values: ['مسکونی', 'اداری', 'تجاری'],
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
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: 1, msg: 'rond type must be at least 1' },
        max: { args: 40, msg: 'ront type must be at most 40' },
      },
    },
    termsOfSale: {
      type: DataTypes.INTEGER,
      allowNull: false,
      values: [1, 2, 3],
    },
    plan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      values: [1, 3, 5],
    },
    payment: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    discription: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'pleas provide a valid discription' },
      },
      defaultValue: 'فاقد توضیحات',
    },
  },
  {
    updatedAt: true,
    createdAt: true,
    indexes: [
      { unique: true, fields: ['number', 'areaCode'] },
      { fields: ['payment'] },
    ],
  }
);

module.exports = Phone;
