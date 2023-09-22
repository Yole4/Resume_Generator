const express = require('express');
const mysql = require('mysql2');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const sanitizeHtml = require('sanitize-html');
const validator = require('validator');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.FE_LINK,
    methods: ["POST", "GET"],
    credentials: true
}));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER
});

db.connect((error) => {
    if (error) throw error;
    console.log("Connected to the database!");
});

// Helper function to sanitize and validate input
// this is the validator and sanitizer of the input of the user
const sanitizeAndValidate = (input, validationRules) => {

    // clean multiple spaces
    const cleanedInput = input.replace(/\s+/g, ' ');

    const sanitizedInput = sanitizeHtml(cleanedInput.trim());

    for (const rule of validationRules) {
        if (!rule.validator(sanitizedInput)) {
            return false;
        }
    }

    return sanitizedInput;
};

// initialize my secret key
const secretKey = process.env.SECRET_KEY;

// require uploads folder
app.use('/uploads', express.static('uploads'));

// #####################################################################    CURRENT DATE FORMAT  ######################################################################################
function getCurrentFormattedDate() {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };

    const currentDate = new Date();
    return new Intl.DateTimeFormat('en-US', options).format(currentDate);
}

// #####################################################################    VERIFY TOKEN SIDE  ######################################################################################
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token missing or invalid' });
    } else {
        const token = authHeader.substring('Bearer '.length);

        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Token is expired or invalid' });
            }

            // Store decoded user data in the request
            req.user = decoded;
            next();
        });
    }
};

// ###################################################################################################################################################################################
// #####################################################################  PROTECTED SIDE  ############################################################################################
// ###################################################################################################################################################################################
app.get('/protected', verifyToken, (req, res) => {
    const { user } = req; // Decoded user data from the token

    res.status(200).json({ message: 'Success', user: user });
});


// ###################################################################################################################################################################################
// #####################################################################  REGISTER USER USING GOOGLE ACCOUNT  ############################################################################################
// ###################################################################################################################################################################################
app.post('/api/insert-user', (req, res) => {
    const { email, fullname } = req.body;

    const select = `SELECT * FROM users WHERE email = ?`;
    db.query(select, [email], (error, results) => {
        if (error) {
            res.status(401).json({ message: "Server side error" });
        } else {
            if (results.length > 0) {
                res.status(401).json({ message: 'Email is already registered!' });
            } else {
                const insert = `INSERT INTO users (email, fullname) VALUES (?, ?)`;
                db.query(insert, [email, fullname], (error, results) => {
                    if (error) {
                        res.status(401).json({ message: 'Server side error!' });
                    } else {
                        // res.status(200).json({ message: 'success!' });
                        const fetchData = {
                            id: results.insertId,
                            email: email,
                            fullname: fullname
                        };

                        const token = jwt.sign(fetchData, secretKey);

                        res.status(200).json({ token: token });
                    }
                });
            }
        }
    });
});

// ###################################################################################################################################################################################
// #####################################################################  LOGIN USER USING GOOGLE ACCOUNT  ############################################################################################
// ###################################################################################################################################################################################
app.post('/api/login', (req, res) => {
    const { email, fullname } = req.body;

    const select = `SELECT * FROM users WHERE email = ?`;
    db.query(select, [email], (error, results) => {
        if (error) {
            res.status(401).json({ message: "Server side error" });
        } else {
            if (results.length > 0) {
                // res.status(200).json({ message: 'success!' });

                const fetchData = {
                    id: results[0].id,
                    email: results[0].email,
                    fullname: results[0].fullname
                };

                const token = jwt.sign(fetchData, secretKey);

                res.status(200).json({ token: token });
            } else {
                res.status(401).json({ message: 'Email is not registered!' });
            }
        }
    });
});

// ###################################################################################################################################################################################
// #####################################################################  REGISTER USER USING MANUAL  ############################################################################################
// ###################################################################################################################################################################################
app.post('/api/manual/register', (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    if (password.length > 7) {
        if (password === confirmPassword) {
            const select = `SELECT * FROM users WHERE email = ?`;
            db.query(select, [email], (error, results) => {
                if (error) {
                    res.status(401).json({ message: "Server side error" });
                } else {
                    if (results.length > 0) {
                        res.status(401).json({ message: 'Email is already in used!' });
                    } else {
                        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

                        const insert = `INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)`;
                        db.query(insert, [name, email, hashedPassword], (error, results) => {
                            if (error) {
                                res.status(401).json({ message: "Server side error!" });
                            } else {
                                const fetchData = {
                                    id: results.insertId,
                                    email: email,
                                    fullname: name
                                };

                                const token = jwt.sign(fetchData, secretKey);

                                res.status(200).json({ token: token });
                            }
                        });
                    }
                }
            });
        }
        else {
            res.status(401).json({ message: "Password and confirm password is not equal!" });
        }
    }
    else {
        res.status(401).json({ message: "Password must have at least 7 characters" });
    }
});

// ###################################################################################################################################################################################
// #####################################################################  LOGIN USER USING MANUAL  ############################################################################################
// ###################################################################################################################################################################################
app.post('/api/manual/login', (req, res) => {
    const { email, password } = req.body;

    const select = `SELECT * FROM users WHERE email = ?`;
    db.query(select, [email], (error, results) => {
        if (error) {
            res.status(401).json({ message: "Server side error" });
        } else {
            if (results.length > 0) {
                const dbPassword = results[0].password;
                const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

                if (dbPassword === hashedPassword) {
                    const fetchData = {
                        id: results[0].id,
                        email: results[0].email,
                        fullname: results[0].fullname,
                        password: results[0].password
                    };

                    const token = jwt.sign(fetchData, secretKey);

                    res.status(200).json({ token: token });
                } else {
                    res.status(401).json({ message: "Invalid Password!" });
                }
            }
            else {
                res.status(401).json({ message: 'Email is not registered!' });
            }
        }
    });
});

// ###################################################################################################################################################################################
// #####################################################################  FETCH USER DATA  ############################################################################################
// ###################################################################################################################################################################################

app.post('/fetch/api/credentials', verifyToken, (req, res) => {
    const { userId } = req.body;

    const select = `SELECT * FROM users WHERE id = ?`;
    db.query(select, [userId], (error, results) => {
        if (error) {
            res.status(401).json({ message: "server side error!" });
        } else {
            if (results.length > 0) {
                res.status(200).json({ message: results });
            } else {
                res.status(401).json({ message: "No user found!" });
            }
        }
    });
});

app.listen(process.env.DB_PORT, () => {
    console.log(`Server running on port ${process.env.DB_PORT}`);
});
