const { DataTypes } = require("sequelize");
const sequelize = require("../db/connect");
const { hashSync } = require("bcryptjs");
const regularExpressionPhone = /09(1[0-9]|3[1-9])[0-9]{7}/gm;

const regularExpressionist = /0[1-9](1[0-9]|3[1-9])[0-9]{7}/gm;

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    phoneNumber: {
      type: DataTypes.BIGINT,
      validate: {
        is: {
          args: regularExpressionPhone,
          msg: "pleas enter a valid phone number",
        },
      },
    },
    userType: {
      type: DataTypes.STRING,
      values: ["Customer", "Legal", "Admin", "Owner"],
      defaultValue: "Customer",
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "pleas enter a valid first name",
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "pleas enter a valid last name",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: {
          msg: "pleas enter a valid email",
        },
      },
    },
    nationalCode: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [10, 10],
          msg: "length of national code must be 10",
        },
        isInt: { msg: "pleas enter a valid national code" },
      },
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: {
          msg: "pleas enter a valid city",
        },
      },
    },
    province: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: {
          msg: "pleas enter a valid province",
        },
      },
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: {
          msg: "pleas provide a valid company name",
        },
      },
    },
    nationalId: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: {
          msg: "pleas provide a valid national id",
        },
        len: { args: [11, 11], msg: "pleas enter a valid national id" },
        isInt: { msg: "pleas provide a valid national id" },
      },
    },
    registerationCode: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: { msg: "pleas enter a valid registeration code" },
        isInt: {
          msg: "pleas provide a valid registration code",
        },
        len: { args: [4, 6], msg: "pleas enter a valid registeration code" },
      },
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
    postalCode: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: {
          msg: "pleas provide a valid postal code",
        },
        isInt: { msg: "pleas enter a valid postalCode" },
        len: { args: [10, 10], msg: "pleas enter a valid postal code" },
      },
    },
    telephoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: {
          msg: "pleas provide a valid telephone number",
        },
        is: {
          args: regularExpressionist,
          msg: "pleas provid a valid telephone number",
        },
      },
    },
    productCount: {
      type: DataTypes.SMALLINT,
      defaultValue: 10,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "pleas enter a valid password" },
      },
      set(password) {
        this.setDataValue("password", hashSync(password));
      },
    },
  },
  {
    createdAt: true,
    updatedAt: true,
    indexes: [
      { unique: true, fields: ["id"] },
      { unique: true, fields: ["phoneNumber"] },
      { unique: true, fields: ["nationalCode"] },
    ],
  },
);

module.exports = User;
