# Node.js-Accounts-REST-API

This service is a boilerplate to start new applications. It provides a
restful API for user accounts management.


## Environment variables

This service uses enviroment variables to gather config information. You can for example edit your environment variables using the command:

```
sudo nano /etc/environment
```

This configuration you need to add is used to connect to database and for app setup and is as as follows:

```
export USRACCNT_DB_HOST=localhost
export USRACCNT_DB_PORT=3306
export USRACCNT_DB_NAME=my_app
export USRACCNT_DB_USER=my_app
export USRACCNT_DB_PASSWORD=my_app_password
export USRACCNT_PORT=3000
export USRACCNT_JWT_SECRET=you_must_change_this_value
```


## General API Information
* The base endpoint is: **/v1/accounts**
* All endpoints return either a JSON object or array.
* All time and timestamp related fields are in **milliseconds**.

## HTTP Return Codes

* HTTP `4XX` return codes are used for malformed requests;
  the issue is on the sender's side.
* HTTP `403` return code is used when invalid credentials are provided.
* HTTP `5XX` return codes are used for internal errors; the issue is on
  the service side.
  
## Error Codes
Any endpoint can return an ERROR with a message for extended information.

Sample ERROR Payload:
```javascript
{
  "message": "Invalid authorization header."
}
```

## General Information on Endpoints
* For `GET` endpoints, parameters must be sent as a `query string`.
* For `POST`, `PUT`, and `DELETE` endpoints, the parameters must be sent as a `request body` with content type
  `application/json`. 
* Parameters may be sent in any order.

## Endpoints

This service provides the following endpoints:

| Method       | endpoint      | VERB  | Descripcion         |
| ------------ |:------------- | :---: | --------------------|
| [account-info](#account-info-get) | /v1/accounts  | GET   | Returns current account information based on a valid JWT token |
| [account-info](#account-info-put) | /v1/accounts  | PUT   | Updates user account based on a valid JWT token |
| [check-token](#check-token)  | /v1/accounts  | GET   | Check authorization header for valid JWT token |
| [login](#login)        | /v1/accounts  | POST  | Process login request |
| [register](#register)     | /v1/accounts  | POST  | Register an account |
| [status](#status)     | /v1/accounts  | GET  | Returns server status |

## Account Info GET

Returns current account information based on a valid JWT token
```
GET /v1/accounts/account-info
```

**Parameters:**
```
NONE
```

**Response:**
```javascript
{
  "fullname": "User Name",
  "phone": "12345678910",
  "email": "address@email.com"
}
```

## Account Info PUT

Updates user account based on a valid JWT token
```
PUT /v1/accounts/account-info
```

**Request Body:**
```javascript
{
  "fullname": "User Name",
  "email": "address@emal.com",
  "phone": "12345678910"
}
```

**Response:**
```
NONE
```

## Check token

Check authorization header for valid JWT token
```
GET /v1/accounts/check-token
```

**Parameters:**
```
NONE
```

**Response:**
```javascript
{
  "serverTime": 1575435948,
  "iat": 1575430011,
  "exp": 1575516411
}
```

## Login

Process login request
```
POST /v1/accounts/login
```
**Request Body:**
```javascript
{
  "email": "address@emal.com",
  "password": "sha3(512)password"
}
```

**Response:**
```javascript
{
  "fullname": "User Name",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZC..."
}
```

## Register

Register an account
```
POST /v1/accounts/register
```

**Request Body:**
```javascript
{
  "fullname": "User Name",
  "email": "address@emal.com",
  "phone": "12345678910",
  "password": "sha3(512)password"
}
```

**Response:**
```
NONE
```

## Status

Returns server status
```
POST /v1/accounts/status
```

**Request Body:**
```
NONE
```

**Response:**
```javascript
{
  "serverTime": 1576029283
  "version": "1.0",
  "endPoint": "/v1/accounts",
}
```

## Dependencies 

This service is a Node.js app. The npm modules (or packages) used are:

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
