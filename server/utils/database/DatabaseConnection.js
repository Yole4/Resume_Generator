const mysql = require('mysql2');

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const database = process.env.DB_DATABASE;
const password = process.env.DB_PASSWORD;

const db = mysql.createConnection({
    host: host,
    user: user,
    database: database,
    password: password
});

db.connect((error) => {
    if (error) throw new error;
    else{
        console.log("Connected to the database!");
    }
});

module.exports = db;