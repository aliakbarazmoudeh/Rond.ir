const { DataTypes } = require('sequelize');
const sequelize = require('../db/connect');
const Domain = require('./Domain');

const User = sequelize.define(
  'User',
  {
    phoneNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      primaryKey: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: {
          msg: 'pleas provide a valid address',
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
    userLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productCount: {
      type: DataTypes.INTEGER,
      defaultValue: 2,
      allowNull: false,
    },
  },
  { createdAt: false, updatedAt: false }
);

User.hasMany(Domain, {
  foreignKey: 'owner',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  hooks: true,
});
Domain.belongsTo(User, {
  foreignKey: 'owner',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

module.exports = User;
