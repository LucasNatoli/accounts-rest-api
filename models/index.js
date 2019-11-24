const env = process.env;
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    env.USRACCNT_DB_NAME,
    env.USRACCNT_DB_USER,
    env.USRACCNT_DB_PASSWORD,
    {
        host: env.USRACCNT_DB_HOST,
        port: env.USRACCNT_DB_PORT,
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
