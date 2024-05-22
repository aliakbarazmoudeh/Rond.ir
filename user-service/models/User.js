const { DataTypes } = require("sequelize");
const sequelize = require("../db/connect");
const { hashSync } = require("bcryptjs");
const regularExpressionPhone = /9(1[0-9]|3[1-9])[0-9]{7}/gm;

const regularExpressionist = /[1-9](1[0-9]|3[1-9])[0-9]{7}/gm;

const User = sequelize.define(
  "User",
  {
    phoneNumber: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
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
      type: DataTypes.BIGINT,
      allowNull: true,
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
      type: DataTypes.BIGINT,
      allowNull: true,
      validate: {
        notEmpty: {
          msg: "pleas provide a valid national id",
        },
        len: { args: [11, 11], msg: "pleas enter a valid national id" },
        isInt: { msg: "pleas provide a valid national id" },
      },
    },
    registrationCode: {
      type: DataTypes.BIGINT,
      allowNull: true,
      validate: {
        notEmpty: { msg: "pleas enter a valid registration code" },
        isInt: {
          msg: "pleas provide a valid registration code",
        },
        len: { args: [4, 6], msg: "pleas enter a valid registration code" },
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
      type: DataTypes.BIGINT,
      allowNull: true,
      validate: {
        notEmpty: {
          msg: "pleas provide a valid telephone number",
        },
        is: {
          args: regularExpressionist,
          msg: "pleas provide a valid telephone number",
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
      { unique: true, fields: ["phoneNumber"] },
      { unique: true, fields: ["nationalID"] },
      { unique: true, fields: ["postalCode"] },
      { unique: true, fields: ["registrationCode"] },
    ],
  },
);

module.exports = User;
