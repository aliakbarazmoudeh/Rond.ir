const { DataTypes } = require("sequelize");
const sequelize = require("../db/connect");
const domainRegex =
  /^(((?!-))(xn--|_)?[a-z0-9-]{0,61}[a-z0-9]{1,1}\.)*(xn--)?([a-z0-9][a-z0-9\-]{0,60}|[a-z0-9-]{1,30}\.[a-z]{2,})$/;
const phoneRegex =
  /(0|\+98)?([ ]|-|[()]){0,2}9[1|2|3|4]([ ]|-|[()]){0,2}(?:[0-9]([ ]|-|[()]){0,2}){8}/gi;

const Domain = sequelize.define(
  "Domain",
  {
    domain: {
      type: DataTypes.STRING,
      unique: true,
      primaryKey: true,
      allowNull: false,
      validate: {
        is: {
          args: domainRegex,
          msg: "pleas provide a valid domain",
        },
        notEmpty: true,
      },
    },
    domainInFarsi: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "pleas provide a valid string for domain",
        },
      },
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "pleas provide a valid category",
        },
      },
    },
    termOfSale: {
      type: DataTypes.INTEGER,
      allowNull: false,
      values: [1, 2, 3],
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "pleas provide a valid phone number for your domain" },
        isInt: { msg: "pleas provide a valid phone number for your domain" },
        is: {
          args: phoneRegex,
          msg: "pleas provide a valid phone number for your domain",
        },
      },
    },
    plan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      values: [0, 1, 3, 5],
      defaultValue: 1, //TODO change defaultValue of Models
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
      defaultValue: "فاقد توضیحات",
    },
  },
  { updatedAt: true, createdAt: true, indexes: [{ fields: ["payment"] }] },
);

module.exports = Domain;
