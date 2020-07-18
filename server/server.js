const express = require('express'),
      cors = require('cors'),
      jsonwebtoken = require('jsonwebtoken'),
      cookieParser = require('cookie-parser'),
      csrf = require('csurf'),
      helmet = require('helmet'),
      app = express();
require('dotenv').config();

const { Pool } = require('pg');

let csrfProtection = csrf({ cookie: true });

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

// csurf

app.use(csrfProtection);
app.get('/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

//jwt

app.post('/jwt', async (req, res) => {
    try {
        const { user } = req.body; 
        const payload = { id: user.id, username: user.username, admin: user.admin, email: user.email};
        const token = jsonwebtoken.sign(payload, process.env.JWTSECRET , {algorithm: 'HS256'}).split('.');
        res.cookie('hp', token[0] + '.' + token[1], {maxAge: 30* 60 * 1000/* 30 mins*/ /*,secure: true /*, sameSite: "strict"*/});
        res.cookie('s', token[2], {/*secure: true*/ httpOnly: true /*sameSite: "strict" под вопросом*/});
        res.status(200).json(1);
    } catch (err) {
        console.error(err.messaage);
    }
});

app.get('/verifyJWT', async (req, res) => {
    try {
        if (req.cookies.hp === undefined ||  req.cookies.s === undefined){
            res.status(200).json({ username: 'Guest', admin: false});
        } else {
            const token = req.cookies.hp + '.' + req.cookies.s;
            const decoded = jsonwebtoken.verify(token, process.env.JWTSECRET)
            res.status(200).json(decoded);
        }
    } catch (err) {
        console.error(err.messaage);
    }
});

// connection to user db

const UserPool = new Pool({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
    table: process.env.USERSTABLE,
    password: process.env.PASSWORD,
    port: process.env.PORT
});

// post new user

app.post('/register', async (req, res) => {
    try {
        const { username, email, hashedPassword } = req.body;
        const newUser = await UserPool.query('INSERT INTO "Users"(username, email, password, admin) VALUES($1, $2, $3, false)', 
        [username, email, hashedPassword]);
        res.status(200).json('User created!');
        //res.json(newUser.rows[0]);
    } catch (err) {
        console.error(err.messaage);
    }
});

//log in

app.post('/login' , async (req, res) => {
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

app.get('/logout', (req, res) => {
    res.cookie('s', null, { maxAge: -1 } );
    res.cookie('hp', null, { maxAge: -1 } );
    res.status(200).json();
});

// E-mail and username checking

app.post('/check' , async (req, res) => {
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

// connection to book db

const BookPool = new Pool({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
    table: process.env.BOOKSTABLE,
    password: process.env.PASSWORD,
    port: process.env.PORT
});

// get all books

app.get('/books', async (req,res) => {
    try {
        const allBooks = await BookPool.query('SELECT * FROM "BookList" ORDER BY id');
        res.json(allBooks.rows);
    } catch (err) {
        console.error(err.messaage);
    }
});

// get searched books

app.get('/search=:select=:value', async (req, res) => {
    try {
        const SearchedBooks = await BookPool.query('SELECT * FROM "BookList" Where ' + req.params.select + "='" + req.params.value + "' ORDER BY id");
        res.json(SearchedBooks.rows);
    } catch (err) {
        console.error(err.messaage);
    }
});

// get single book

app.get('/books/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const Book = await BookPool.query('SELECT * FROM "BookList" WHERE id=$1', [id]);
        res.json(Book.rows);
    } catch (err) {
        console.error(err.messaage);
    }
});

// post a book

app.post('/add', async (req,res) => {
    try {
        const { title, description, author } = req.body;
        const newBook = await BookPool.query('INSERT INTO "BookList"(title, description, author) VALUES($1, $2, $3)', 
        [title, description, author]);
        res.status(200).json();
    } catch (err) {
        console.error(err.messaage);
    }
});

// update a book

app.put('/books/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const updateBook = await BookPool.query('UPDATE "BookList" SET title=$1, description=$2 where id=$3', 
        [title, description, id]);
        res.status(200).json();
    } catch (err) {
        console.error(err.messaage);
    }
});

// delete a book

app.delete('/books/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const deleteBook = await BookPool.query('DELETE FROM "BookList" WHERE id=$1', [ id]);
        res.status(200).json();
    } catch (err) {
        console.error(err.messaage);        
    }
});

app.listen(3001, () => {
    console.log('server started');
});