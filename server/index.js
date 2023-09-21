const express = require('express');
const mysql = require('mysql');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'https://online-resume-generator.onrender.com',
    methods: ["POST", "GET"],
    credentials: true
}));

const db = mysql.createConnection({
    host: 'bfdn8rxy3ulf0wlt33ff-mysql.services.clever-cloud.com',
    database: 'bfdn8rxy3ulf0wlt33ff',
    password: 'AqkCwjWHOZsZKJHIeoGu',
    user: 'u6uijlgfezxmmwcc'
});

db.connect((error) => {
    if (error) throw error;
    console.log("Connected to the database!");
});

app.post('/api/insert-user', (req, res) => {
    const { email, fullname } = req.body;

    const insert = `INSERT INTO users (email, fullname) VALUES (?, ?)`;
    db.query(insert, [email, fullname], (error, results) => {
        if (error){
            res.status(401).json({message: 'Server side error!'});
        }else{
            res.status(200).json({message: 'success!'});
        }
    });
});

app.listen(3306, () => {
    console.log('Server running on port 3306');
});
