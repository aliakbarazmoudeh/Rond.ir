const { Sequelize } = require('sequelize');

// conecction for dev mode
// const sequelize = new Sequelize(
//   process.env.MySQL_DATABASE,
//   process.env.MySQL_USERNAME,
//   process.env.MySQL_PASSWORD,
//   {
//     host: 'localhost',
//     dialect: 'mysql',
//     logging: false,
//     logQueryParameters: false,
//   }
// );

// connection for production mode
const sequelize = new Sequelize(process.env.MYSQL_DB, {
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    multipleStatements: true,
  },
});

module.exports = sequelize;
