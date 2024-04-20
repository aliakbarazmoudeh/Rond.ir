const sequelize = require('../db/connect');
const { DataTypes } = require('sequelize');

const Ad = sequelize.define(
  'Ad',
  {
    _id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isInt: { msg: 'pleas provide a valid phone number for owner fields' },
      },
    },
    src: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'pleas provide a valid url' } },
    },
    plan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      values: [1, 3, 5],
    },
    expireAt: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: { msg: 'pleas provide a valid date for expiration' },
      },
    },
  },
  { createdAt: false, updatedAt: true }
);

module.exports = Ad;
