const env = process.env;
const Sequelize = require('sequelize');
console.log('dbuser', env.MYAPP_DB_USER)
const sequelize = new Sequelize(
    env.MYAPP_DB_NAME,
    env.MYAPP_DB_USER,
    env.MYAPP_DB_PASSWORD,
    {
        host: env.MYAPP_DB_HOST,
        port: env.MYAPP_DB_PORT,
        dialect: 'mysql',
        define: {
            underscored: true
        },
        logging: false
    }
);


var models = {};

models.Sequelize = Sequelize;
models.sequelize = sequelize;

//Models/tables
models.account = require('./account')(sequelize, Sequelize)

module.exports = models;
