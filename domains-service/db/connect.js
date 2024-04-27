const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.MYSQL_DB, {
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    multipleStatements: true,
  },
});

module.exports = sequelize;
