const { DataTypes } = require('sequelize');
const sequelize = require('../db/connect');
const Viewed = require('./Viewed');

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

User.hasMany(Viewed, {
  foreignKey: 'owner',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  hooks: true,
});
Viewed.belongsTo(User, {
  foreignKey: 'owner',
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

module.exports = User;
