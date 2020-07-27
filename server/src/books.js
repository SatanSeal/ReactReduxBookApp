require('dotenv').config();
let express = require('express'),
    router = express.Router(),
    BookPool = require('./bookDB');

// get all books
router.get('/', async (req,res) => {
    try {
        const allBooks = await BookPool.query('SELECT * FROM "Books" ORDER BY id');
        res.status(200).json(allBooks.rows);
    } catch (err) {
        console.error(err);
    }
});

// get searched books 

// added slow fulltext search. must be upgraded
router.get('/search=:select=:value', async (req, res) => {
    try {
        if ( req.params.select === "id") {
            const SearchedBooks = await BookPool.query(`SELECT * FROM "Books" Where id ='` + req.params.value + "' ORDER BY id");
            res.status(200).json(SearchedBooks.rows);
            return;
        } 
        const searchString =    `SELECT *, ts_rank(to_tsvector("${req.params.select}"), plainto_tsquery('${req.params.value}'))
                                FROM "Books"
                                WHERE to_tsvector("${req.params.select}") @@ plainto_tsquery('${req.params.value}')
                                ORDER BY ts_rank(to_tsvector("${req.params.select}"), plainto_tsquery('${req.params.value}')) DESC;`
        const SearchedBooks = await BookPool.query(searchString);
        res.status(200).json(SearchedBooks.rows);
    } catch (err) {
        console.error(err);
    }
});

// get single book
router.get('/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const Book = await BookPool.query('SELECT * FROM "Books" WHERE id=$1', [id]);
        res.status(200).json(Book.rows);
    } catch (err) {
        console.error(err);
    }
});

// post a book
router.post('/add', async (req,res) => {
    try {
        const { title, description, author } = req.body;
        const newBook = await BookPool.query('INSERT INTO "Books"(title, description, author) VALUES($1, $2, $3)', 
        [title, description, author]);
        res.status(200).json();
    } catch (err) {
        console.error(err);
    }
});

// update a book
router.put('/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const updateBook = await BookPool.query('UPDATE "Books" SET title=$1, description=$2 where id=$3', 
        [title, description, id]);
        res.status(200).json();
    } catch (err) {
        console.error(err);
    }
});

// delete a book
router.delete('/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const deleteBook = await BookPool.query(`DELETE FROM "Books" WHERE id=${id}`);
        res.status(200).json();
    } catch (err) {
        console.error(err);        
    }
});

module.exports = router;