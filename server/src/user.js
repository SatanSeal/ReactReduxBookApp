require('dotenv').config();
let express = require('express'),
    router = express.Router(),
    UserPool = require('./userDB');


// post new user

router.post('/register', async (req, res) => {
    try {
        const { username, email, hashedPassword } = req.body;
        const newUser = await UserPool.query('INSERT INTO "Users"(username, email, password, admin) VALUES($1, $2, $3, false)', 
        [username, email, hashedPassword]);
        res.status(200).json('User created!');
    } catch (err) {
        console.error(err.messaage);
    }
});

//log in

router.post('/login' , async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserPool.query(`SELECT * FROM "Users" WHERE email='${email}'`);
        if (user.rowCount){
            res.status(200).json(user.rows[0]);
        } else {
            res.status(200).json(0);
        }
    } catch (err) {
        console.error(err.messaage);
    }
});

// log out

router.get('/logout', (req, res) => {
    res.cookie('hps', null, { maxAge: -1 });
    res.status(200).json();
});

// E-mail and username checking

router.post('/check' , async (req, res) => {
    try {
        const { parameter, value } = req.body;
        const User = await UserPool.query(`SELECT * FROM "Users" WHERE ${parameter}='${value}'`);
        if (User.rowCount){
            res.status(200).json(1);
        } else {
            res.status(200).json(0);
        }
    } catch (err) {
        console.error(err.messaage);
    }
});

module.exports = router;