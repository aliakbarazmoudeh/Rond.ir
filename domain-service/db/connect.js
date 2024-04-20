const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.MySQL_DATABASE,
  process.env.MySQL_USERNAME,
  process.env.MySQL_PASSWORD,
  {
    host: 'localhost',
    dialect: 'mysql',
  }
);

module.exports = sequelize;
