const express = require('express');
const mysql = require('mysql');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ["POST", "GET"],
    credentials: true
}));

const db = mysql.createConnection({
    host: 'localhost',
    database: 'resume_gen_db',
    password: '',
    user: 'root'
});

db.connect((error) => {
    if (error) throw error;
    console.log("Connected to the database!");
});

app.post('/api/insert-user', (req, res) => {
    const { email, fullname } = req.body;

    const select = `SELECT * FROM users WHERE email = ?`;
    db.query(select, [email], (error, results) => {
        if (error) {
            res.status(401).json({ message: "Server side error" });
        } else {
            if (results.length > 0) {
                res.status(401).json({ message: 'already registered!' });
            } else {
                const insert = `INSERT INTO users (email, fullname) VALUES (?, ?)`;
                db.query(insert, [email, fullname], (error, results) => {
                    if (error) {
                        res.status(401).json({ message: 'Server side error!' });
                    } else {
                        res.status(200).json({ message: 'success!' });
                    }
                });
            }
        }
    });
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});