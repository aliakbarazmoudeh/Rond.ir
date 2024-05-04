const { DataTypes } = require('sequelize');
const sequelize = require('../db/connect');

const Viewed = sequelize.define(
  'Viewed',
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
    expireAt: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: { msg: 'pleas provide a valid date for expiration' },
      },
    },
  },
  { createdAt: false, updatedAt: false }
);

module.exports = Viewed;
