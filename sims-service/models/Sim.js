const { DataTypes } = require('sequelize');
const sequelize = require('../db/connect');
const reqularExpressionPhone =
  /(0|\+98)?([ ]|-|[()]){0,2}9[1|2|3|4]([ ]|-|[()]){0,2}(?:[0-9]([ ]|-|[()]){0,2}){8}/gi;

const Sim = sequelize.define(
  'Sim',
  {
    phoneNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      primaryKey: true,
      validate: {
        is: {
          args: reqularExpressionPhone,
          msg: 'pleas provide a valid phone number',
        },
      },
    },
    operator: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'pleas enter a valid operator' },
      },
      values: ['MCI', 'MTN'],
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    priceType: {
      type: DataTypes.INTEGER,
      values: [1, 2],
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    simType: {
      type: DataTypes.INTEGER,
      allowNull: false,
      values: [0, 1],
    },
    rondType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    termsOfSale: {
      type: DataTypes.INTEGER,
      allowNull: false,
      values: [0, 1],
    },
    plan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      values: [1, 3, 5],
    },
    province: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'pleas provide a valid province' },
      },
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'pleas provide a valid province' },
      },
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
  { updatedAt: true, createdAt: true, indexes: [{ fields: ['payment'] }] }
);

module.exports = Sim;
