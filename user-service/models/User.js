const { DataTypes } = require('sequelize');
const sequelize = require('../db/connect');
const { hashSync } = require('bcryptjs');
const reqularExpressionPhone = /09(1[0-9]|3[1-9])[0-9]{7}/;

const reqularExpressiontele = /^0\d{2,3}-\d{8}$/;

const User = sequelize.define(
  'User',
  {
    phoneNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      primaryKey: true,
      validate: {
        is: {
          args: reqularExpressionPhone,
          msg: 'pleas enter a valid phone number',
        },
      },
    },
    userLevel: {
      type: DataTypes.INTEGER,
      values: [1, 2, 3],
      defaultValue: 1,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'pleas enter a valid first name',
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'pleas enter a valid last name',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: {
          msg: 'pleas enter a valid email',
        },
      },
    },
    nationalCode: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [10, 10],
          msg: 'length of national code must be 10',
        },
        isInt: { msg: 'pleas enter a valid national code' },
      },
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'pleas enter a valid city',
        },
      },
    },
    province: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'pleas enter a valid province',
        },
      },
    },
    productCount: {
      type: DataTypes.INTEGER,
      defaultValue: 2,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'pleas enter a valid password' },
      },
      set(password) {
        this.setDataValue('password', hashSync(password));
      },
    },
  },
  {
    createdAt: true,
    updatedAt: true,
  }
);

module.exports = User;
