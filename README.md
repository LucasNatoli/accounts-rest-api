# Node.js-Accounts-REST-API
Restful API for user accounts management.


## Prerequisites

### Node
* version: v8.10.0
* [Home](https://nodejs.org)
* Dependencies:


### Npm
### Environment variables

This service uses enviroment variables to gather config information. You can for example edit your environment variables using the command:

`sudo nano /etc/environment`

This configuration you need to add is used to connect to database and for app setup and is as as follows:

```
export USRACCNT_DB_HOST=localhost
export USRACCNT_DB_PORT=3306
export USRACCNT_DB_NAME=my_app
export USRACCNT_DB_USER=my_app
export USRACCNT_DB_PASSWORD=my_app_password
export USRACCNT_PORT=3000
```

## How to install

Clone repo and install dependencies using `node install`. 
Then start the service using: `node start index.js`

## How to use

### API Routes
| Method       | endpoint      | VERB  | Descripcion         |
| ------------ |:------------- | :---: | --------------------|
| register     | /v1/accounts  | POST  | Register an account |
| login        | /v1/accounts  | POST  | Process login request |
| logout       | /v1/accounts  | GET   | Logout user and finish current session |
| check-session| /v1/accounts  | GET   | Check if there is a live current session |


## Dependencies / Acknowledgements / Help references

This service runs as a Node.js app. The npm modules (or packages) used are:

* [body-parser (^1.19.0)](https://www.npmjs.com/package/body-parser)
* [credential (^2.0.0)](https://www.npmjs.com/package/credential)
* [express (^4.17.1)](https://www.npmjs.com/package/express)
* [mysql2 (^2.0.0)](https://www.npmjs.com/package/mysql2)
* [sequelize (^5.21.2)](https://sequelize.org/)
* [express-session (^1.17.0)](https://www.npmjs.com/package/express-session)
* [connect-sqlite3 (^0.9.11)](https://www.npmjs.com/package/connect-sqlite3)
## Contact information

* [Web: https://cuatroveinte.digital](https://cuatroveinte.digital)
* [Github: /LucasNatoli](https://github.com/LucasNatoli)
