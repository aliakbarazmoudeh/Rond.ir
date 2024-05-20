const { DataTypes } = require("sequelize");
const sequelize = require("../db/connect");
const Ad = require("./Ad");

const User = sequelize.define(
  "User",
  {
    phoneNumber: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
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
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { notEmpty: true },
    },
    telephoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productCount: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
      allowNull: false,
    },
  },
  {
    createdAt: false,
    updatedAt: false,
    indexes: [{ unique: true, fields: ["phoneNumber"] }],
  },
);

User.hasMany(Ad, {
  foreignKey: "ownerID",
  onDelete: "cascade",
  onUpdate: "cascade",
  hooks: true,
});
Ad.belongsTo(User, {
  foreignKey: "ownerID",
  onDelete: "cascade",
  onUpdate: "cascade",
});

module.exports = User;
