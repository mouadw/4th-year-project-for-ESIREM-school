** This is an example project for managing students parents products :
it consist of two sub project : backend-api and front-ui

Backend-api: is an express js project where we provide some http endpoint to the user and manage its requests :
Provided Requests :
SQLite : self containted standalone db
Technical stack/dependencies :
Front-ui: is the ui of the sample . its written using js and css . it makes calls to our prepared api to requests data .
Technical stack/dependencies :


Testing the API :
curl http://localhost:3000
-> Received a GET HTTP method

curl -X POST http://localhost:3000
-> Received a POST HTTP method

curl -X PUT http://localhost:3000
-> Received a PUT HTTP method

curl -X DELETE http://localhost:3000
-> Received a DELETE HTTP method

inside database.js : we cerate and init the main db connection .

