const { DataTypes } = require('sequelize');
const sequelize = require('../db/connect');
const Save = require('./Save');

const User = sequelize.define(
  'User',
  {
    phoneNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      primaryKey: true,
    },
  },
  { createdAt: false, updatedAt: false }
);

User.hasMany(Save, {
  foreignKey: 'owner',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  hooks: true,
});
Save.belongsTo(User, {
  foreignKey: 'owner',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

module.exports = User;
