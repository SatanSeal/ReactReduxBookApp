require('dotenv').config();
let express = require('express'),
    router = express.Router(),
    { Pool } = require('pg');

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

router.get('/', async (req,res) => {
    try {
        const allBooks = await BookPool.query('SELECT * FROM "BookList" ORDER BY id');
        res.status(200).json(allBooks.rows);
    } catch (err) {
        console.error(err.messaage);
    }
});

// get searched books

router.get('/search=:select=:value', async (req, res) => {
    try {
        const SearchedBooks = await BookPool.query('SELECT * FROM "BookList" Where ' + req.params.select + "='" + req.params.value + "' ORDER BY id");
        res.status(200).json(SearchedBooks.rows);
    } catch (err) {
        console.error(err.messaage);
    }
});

// get single book

router.get('/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const Book = await BookPool.query('SELECT * FROM "BookList" WHERE id=$1', [id]);
        res.status(200).json(Book.rows);
    } catch (err) {
        console.error(err.messaage);
    }
});

// post a book

router.post('/add', async (req,res) => {
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

router.put('/:id', async (req,res) => {
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

router.delete('/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const deleteBook = await BookPool.query(`DELETE FROM "BookList" WHERE id=${id}`);
        res.status(200).json();
    } catch (err) {
        console.error(err.messaage);        
    }
});

module.exports = router;