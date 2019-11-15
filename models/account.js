'user strict'

module.exports = (sequelize, DataTypes) => {
    const Account = sequelize.define('account', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        fullname: {
            type: DataTypes.STRING,
            required: true
        },
        phone: {
            type: DataTypes.STRING,
            required: true
        },
        email: {
            type: DataTypes.STRING,
            required: true
        },
        password: {
            type: DataTypes.STRING,
            required: true
        },
        state: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
        paranoid: true
    });
    return Account;
};
