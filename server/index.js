const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cors = require('cors');
const mime = require('mime-types');
const fs = require('fs');
const { OAuth2Client } = require('google-auth-library');
const sanitizeHtml = require('sanitize-html');
const validator = require('validator');
require('dotenv').config();

// documents required
const Docxtemplater = require('docxtemplater');
const axios = require('axios');
const FormData = require('form-data');
const JSZip = require('jszip');

// require database connection
const db = require('./utils/database/DatabaseConnection');
// require auth
const { verifyToken } = require('./utils/auth/AuthVerify');
// require sanitize and validator
const { sanitizeAndValidate } = require('./utils/validator and sanitizer/ValidatorAndSanitizer');

const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.FE_LINK,
    methods: ["POST", "GET"],
    credentials: true
}));

// initialize my secret key
const secretKey = process.env.SECRET_KEY;
// initailize GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// ###################################################################################################################################################################################
// #####################################################################  PROTECTED SIDE  ############################################################################################
// ###################################################################################################################################################################################
app.get('/protected', verifyToken, (req, res) => {
    const { user } = req;

    res.status(200).json({ message: 'Success', user: user });
});


// ###################################################################################################################################################################################
// #####################################################################  REGISTER USER USING GOOGLE ACCOUNT  ############################################################################################
// ###################################################################################################################################################################################
app.post('/api/insert-user', (req, res) => {

    const someAsyncFunction = async () => {
        try {

            const { userData } = req.body;
            const ticket = await googleClient.verifyIdToken({
                idToken: userData,
                audience: GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            const user = {
                googleId: payload.sub,
                email: payload.email,
                name: `${payload.given_name} ${payload.family_name}`,
                picture: payload.picture,
            };

            const select = `SELECT * FROM users WHERE google_id = ?`;
            db.query(select, [user.googleId], (error, results) => {
                if (error) {
                    res.status(401).json({ message: "Server side error" });
                } else {
                    if (results.length > 0) {
                        res.status(401).json({ message: 'Email is already registered!' });
                    } else {

                        const insert = `INSERT INTO users (google_id, email, fullname, image) VALUES (?, ?, ?, ?)`;
                        db.query(insert, [user.googleId, user.email, user.name, user.picture], (error, results) => {
                            if (error) {
                                res.status(401).json({ message: 'Server side error!' });
                            } else {
                                // res.status(200).json({ message: 'success!' });
                                const fetchData = {
                                    id: results.insertId,
                                    email: user.email,
                                    fullname: user.name
                                };

                                const token = jwt.sign(fetchData, secretKey);

                                res.status(200).json({ token: token });
                            }
                        });
                    }
                }
            });

        } catch (error) {
            res.status(401).json({ message: 'Google login failed' });
            console.log(error);
        }
    }
    someAsyncFunction();
});

// ###################################################################################################################################################################################
// #####################################################################  LOGIN USER USING GOOGLE ACCOUNT  ############################################################################################
// ###################################################################################################################################################################################
app.post('/api/login', (req, res) => {

    const someAsyncFunction = async () => {
        try {

            const { userLoginData } = req.body;
            const ticket = await googleClient.verifyIdToken({
                idToken: userLoginData,
                audience: GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            const user = {
                googleId: payload.sub,
                email: payload.email,
                name: `${payload.given_name} ${payload.family_name}`,
                picture: payload.picture,
            };

            const select = `SELECT * FROM users WHERE google_id = ?`;
            db.query(select, [user.googleId], (error, results) => {
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

        } catch (error) {
            res.status(401).json({ message: 'Google login failed' });
            console.log(error);
        }
    }
    someAsyncFunction();
});

// ###################################################################################################################################################################################
// #####################################################################  REGISTER USER USING MANUAL  ############################################################################################
// ###################################################################################################################################################################################
app.post('/api/manual/register', (req, res) => {
    const { name, username, password, confirmPassword } = req.body;

    const validationRules = [
        { validator: validator.isLength, options: { min: 1, max: 50 } },
    ]

    const santiizedName = sanitizeAndValidate(name, validationRules);
    const sanitizeUsername = sanitizeAndValidate(username, validationRules);
    const sanitizePassword = sanitizeAndValidate(password, validationRules);
    const sanitizeConfirmPassword = sanitizeAndValidate(confirmPassword, validationRules);

    if (!santiizedName || !sanitizeUsername || !sanitizePassword || !sanitizeConfirmPassword) {
        res.status(401).json({ message: "Invalid Input!" });
    }
    else {
        if (sanitizePassword.length >= 7 && password.length <= 20) {
            if (sanitizePassword === sanitizeConfirmPassword) {
                if (sanitizeUsername.length >= 5) {
                    const select = `SELECT * FROM users WHERE username = ?`;
                    db.query(select, [sanitizeUsername], (error, results) => {
                        if (error) {
                            res.status(401).json({ message: "Server side error" });
                        } else {
                            if (results.length > 0) {
                                res.status(401).json({ message: 'Username is already in used!' });
                            } else {
                                const hashedPassword = crypto.createHash('sha256').update(sanitizePassword).digest('hex');

                                const insert = `INSERT INTO users (fullname, username, password) VALUES (?, ?, ?)`;
                                db.query(insert, [santiizedName, sanitizeUsername, hashedPassword], (error, results) => {
                                    if (error) {
                                        res.status(401).json({ message: "Server side error!" });
                                    } else {
                                        const fetchData = {
                                            id: results.insertId,
                                            username: sanitizeUsername,
                                            fullname: santiizedName
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
                    res.status(401).json({ message: "Username must have at least 5 characters" });
                }

            }
            else {
                res.status(401).json({ message: "Password and confirm password is not equal!" });
            }
        }
        else {
            res.status(401).json({ message: "Password must have only 7 to 20 characters!" });
        }
    }
});

// ###################################################################################################################################################################################
// #####################################################################  LOGIN USER USING MANUAL  ############################################################################################
// ###################################################################################################################################################################################
app.post('/api/manual/login', (req, res) => {
    const { username, password } = req.body;

    const validationRules = [
        { validator: validator.isLength, options: { min: 1, max: 50 } },
    ];

    const usernameSanitized = sanitizeAndValidate(username, validationRules);
    const passwordSanitized = sanitizeAndValidate(password, validationRules);

    if (!usernameSanitized || !passwordSanitized) {
        res.status(401).json({ message: "Invalid Input!" });
    } else {
        const select = `SELECT * FROM users WHERE username = ?`;
        db.query(select, [usernameSanitized], (error, results) => {
            if (error) {
                res.status(401).json({ message: "Server side error" });
            } else {
                if (results.length > 0) {
                    const dbPassword = results[0].password;
                    const hashedPassword = crypto.createHash('sha256').update(passwordSanitized).digest('hex');

                    if (dbPassword === hashedPassword) {
                        const fetchData = {
                            id: results[0].id,
                            username: results[0].usernameSanitized,
                            fullname: results[0].fullname
                        };

                        const token = jwt.sign(fetchData, secretKey);

                        res.status(200).json({ token: token });
                    } else {
                        res.status(401).json({ message: "Invalid Password!" });
                    }
                }
                else {
                    res.status(401).json({ message: 'Invalid Username!' });
                }
            }
        });
    }
});

// ###################################################################################################################################################################################
// #####################################################################  FETCH USER DATA  ############################################################################################
// ###################################################################################################################################################################################

app.post('/fetch/api/credentials', verifyToken, (req, res) => {
    const { userId } = req.body;

    const validationRules = [
        { validator: validator.isLength, options: { min: 1, max: 50 } },
    ];

    const sanitizeUserId = sanitizeAndValidate(userId, validationRules);

    if (!sanitizeUserId) {
        res.status(401).json({ message: "Invalid Input!" });
    }
    else {
        const select = `SELECT * FROM users WHERE id = ?`;
        db.query(select, [sanitizeUserId], (error, results) => {
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
    }
});

// ###################################################################################################################################################################################
// #####################################################################  AUTO IMAGE UPLOAD  ############################################################################################
// ###################################################################################################################################################################################
// require uploads folder
app.use('/assets', express.static('assets'));
const imageUpload = multer({
    dest: 'assets/image uploads/',
});

app.post('/api/auto-image-upload', verifyToken, imageUpload.single('image'), (req, res) => {
    const { userId } = req.body;

    const validationRules = [
        { validator: validator.isLength, options: { min: 1, max: 50 } },
    ];

    const sanitizeUserId = sanitizeAndValidate(userId, validationRules);

    if (!sanitizeUserId) {
        res.status(401).json({ message: "Invalid Input!" });
    }
    else {
        const originalFileName = req.file.originalname;
        const uniqueFileName = `${Date.now()}_+_${originalFileName}`;
        const uniqueFilePath = `assets/image uploads/${uniqueFileName}`;

        const typeMime = mime.lookup(originalFileName);

        if ((typeMime === 'image/png') || (typeMime === 'image/jpeg')) {
            fs.rename(req.file.path, uniqueFilePath, (err) => {
                if (err) {
                    res.status(401).json({ message: "Error to upload file" });
                } else {
                    const sanitizedFileName = sanitizeHtml(req.file.originalname); // Sanitize HTML content
                    if (!validator.isLength(sanitizedFileName, { min: 1, max: 255 })) {
                        return res.status(401).send({ message: "Invalid File Name!" });
                    }
                    else {
                        const insert = `UPDATE users SET image = ? WHERE id = ?`;
                        db.query(insert, [uniqueFileName, sanitizeUserId], (error, results) => {
                            if (error) {
                                res.status(401).json({ message: "Server side error!" });
                            } else {
                                res.status(200).json({ message: "Profile image changed!" });
                            }
                        });
                    }
                }
            });
        }
        else {
            res.status(401).json({ message: "Invalid Image Type!" });
            return;
        }
    }
});

// ###################################################################################################################################################################################
// #####################################################################  FETCH USER RESUME DATA  ############################################################################################
// ###################################################################################################################################################################################
app.post('/api/get-resume-data', verifyToken, (req, res) => {
    const { userId } = req.body;

    const select = `SELECT * FROM resume_data WHERE user_id = ?`;
    db.query(select, [userId], (error, results) => {
        if (error) {
            res.status(401).json({ message: "Server side error!" });
        } else {
            if (results.length > 0) {
                res.status(200).json({ message: results });
            } else {
                res.status(401).json({ message: "No data found!" });
            }
        }
    });
});

// ###################################################################################################################################################################################
// #####################################################################  AUTO FETCH UPDATED DOCUMENT  ############################################################################################
// ###################################################################################################################################################################################
// require uploads folder
app.use('/pdfFiles', express.static('pdfFiles'));

app.post('/api/auto-fetch-document', verifyToken, (req, res) => {
    const { personalDetails, computerLiterate, webDevelopment, programming, database, language, userId } = req.body;

    const languages = language.join(',');
    const computerLiterates = computerLiterate.join(',');
    const webDevelopments = webDevelopment.join(',');
    const programmings = programming.join(',');
    const databases = database.join(',');

    // check the name first if not empty
    if (personalDetails.firstName === "" || personalDetails.middleName === "" || personalDetails.lastName === "") {
        res.status(401).json({ message: "Please provide the complete name first!" });
    } else {
        // computer literate
        const computer_literate = computerLiterate.map(item => {
            return {
                items: item
            }
        });

        // web development
        const web_development = webDevelopment.map(item => {
            return {
                items: item
            }
        });

        // programming
        const programmingList = programming.map(item => {
            return {
                items: item
            }
        });

        // database
        const databaseList = database.map(item => {
            return {
                items: item
            }
        });

        // Languages
        const languageList = language.map(item => {
            return {
                items: item
            }
        });

        const templateContent = fs.readFileSync('document templates/my cv.docx', 'binary');

        // Create a new Docxtemplater instance
        const doc = new Docxtemplater();
        doc.loadZip(new JSZip(templateContent));

        const list = {
            first_name: (personalDetails.firstName).toUpperCase(),
            middle_name: (personalDetails.middleName).toUpperCase(),
            last_name: (personalDetails.lastName).toUpperCase(),
            // image: 'pdfFiles/1.jpg',
            address: personalDetails.address,
            phone_number: personalDetails.phoneNumber,
            email: personalDetails.email,
            objectives: personalDetails.objectives,
            course: personalDetails.course,
            gender: personalDetails.gender,
            civil_status: personalDetails.civilStatus,
            religion: personalDetails.religion,
            nationality: personalDetails.nationality,
            place_of_birth: personalDetails.placeOfBirth,
            age: personalDetails.age,
            birth_date: personalDetails.birthDate,
            languageList: languageList,
            computer_literate: computer_literate,
            programmingList: programmingList,
            web_development: web_development,
            databaseList: databaseList
        };

        doc.setData(list);

        try {
            doc.render();

            // file name of user
            const fileName = `${personalDetails.lastName} ${personalDetails.firstName} ${personalDetails.middleName}.pdf`;

            // Generate the output DOCX file content
            const outputContent = doc.getZip().generate({ type: 'nodebuffer' });

            // Write the output to a new DOCX file
            fs.writeFileSync('pdfFiles/generated.docx', outputContent);

            const formData = new FormData()
            formData.append('instructions', JSON.stringify({
                parts: [
                    {
                        file: "document"
                    }
                ]
            }))
            formData.append('document', fs.createReadStream('pdfFiles/generated.docx'))

                ; (async () => {
                    try {
                        const response = await axios.post('https://api.pspdfkit.com/build', formData, {
                            headers: formData.getHeaders({
                                'Authorization': 'Bearer pdf_live_1r20h0fQcxRP3jWBLeB97zNZAZMYkXjcuPVzPIfCt0d'
                            }),
                            responseType: "stream"
                        })

                        response.data.pipe(fs.createWriteStream(`pdfFiles/${fileName}`));
                        fs.unlinkSync('pdfFiles/generated.docx');

                        // insert credentials to database
                        const select = `SELECT * FROM resume_data WHERE user_id = ?`;
                        db.query(select, [userId], (error, results) => {
                            if (error) {
                                res.status(401).json({ message: "Server side error!" });
                            }
                            if (results.length > 0) {
                                // update
                                const updateResumeData = `UPDATE resume_data SET first_name = ?, middle_name = ?, last_name = ?, address = ?, phone_number = ?,
                                email = ?,
                                objectives = ?,
                                course = ?,
                                gender = ?,
                                civil_status = ?,
                                religion = ?,
                                nationality = ?,
                                place_of_birth = ?,
                                age = ?,
                                birth_date = ?,
                                file_name = ?,
                                language = ?,
                                computer_literate = ?,
                                programming = ?,
                                web_development = ?,
                                db = ?
                            WHERE user_id = ?
                            `;

                                db.query(updateResumeData, [
                                    personalDetails.firstName,
                                    personalDetails.middleName,
                                    personalDetails.lastName,
                                    personalDetails.address,
                                    personalDetails.phoneNumber,
                                    personalDetails.email,
                                    personalDetails.objectives,
                                    personalDetails.course,
                                    personalDetails.gender,
                                    personalDetails.civilStatus,
                                    personalDetails.religion,
                                    personalDetails.nationality,
                                    personalDetails.placeOfBirth,
                                    personalDetails.age,
                                    personalDetails.birthDate,
                                    fileName,
                                    languages,
                                    computerLiterates,
                                    programmings,
                                    webDevelopments,
                                    databases,
                                    userId
                                ], (error, results) => {
                                    if (error) {
                                        res.status(401).json({ message: "server side error!" });
                                    } else {
                                        res.status(200).json({ message: "success!" });
                                    }
                                });
                            }
                            else {
                                const insertResumeData = `INSERT INTO resume_data (first_name, middle_name, last_name, address, phone_number, email, objectives, course, gender, civil_status, religion, nationality, place_of_birth, age, birth_date, file_name, language, computer_literate, programming, web_development, db,user_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
                                db.query(insertResumeData, [
                                    personalDetails.firstName,
                                    personalDetails.middleName,
                                    personalDetails.lastName,
                                    personalDetails.address,
                                    personalDetails.phoneNumber,
                                    personalDetails.email,
                                    personalDetails.objectives,
                                    personalDetails.course,
                                    personalDetails.gender,
                                    personalDetails.civilStatus,
                                    personalDetails.religion,
                                    personalDetails.nationality,
                                    personalDetails.placeOfBirth,
                                    personalDetails.age,
                                    personalDetails.birthDate,
                                    fileName,
                                    languages,
                                    computerLiterates,
                                    programmings,
                                    webDevelopments,
                                    databases,
                                    userId
                                ], (error, results) => {
                                    if (error) {
                                        res.status(401).json({ message: "server side error!" });
                                    } else {
                                        // insert language, skills etc.
                                        res.status(200).json({ message: "partial success!" });
                                    }
                                });
                            }
                        });

                    } catch (e) {
                        const errorString = await streamToString(e.response.data)
                        console.log(errorString)
                    }
                })()

            function streamToString(stream) {
                const chunks = []
                return new Promise((resolve, reject) => {
                    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)))
                    stream.on("error", (err) => reject(err))
                    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
                })
            }
        } catch (error) {
            console.error('Error generating DOCX file:', error);
        }
    }
});

app.listen(process.env.DB_PORT, () => {
    console.log(`Server running on port ${process.env.DB_PORT}`);
});
