const { DataTypes } = require("sequelize");
const sequelize = require("../db/connect");
const Save = require("./Save");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
      primaryKey: true,
    },
  },
  { createdAt: false, updatedAt: false },
);

User.hasMany(Save, {
  foreignKey: "owner",
  onDelete: "cascade",
  onUpdate: "cascade",
  hooks: true,
});
Save.belongsTo(User, {
  foreignKey: "owner",
  onDelete: "cascade",
  onUpdate: "cascade",
});

module.exports = User;
