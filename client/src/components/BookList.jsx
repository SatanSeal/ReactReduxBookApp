import React, { useEffect, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';

import '../css/main.css';
import Books from './Books';
import Pagination from './Pagination';

const BookList = () => {

    const [AllBooks, setAllBooks] = useState([]);
    const [Loading, setLoading] = useState(false);
    const [CurrentPage, setCurrentPage] = useState(1);
    const [BooksPerPage] = useState(3);

    const indexOfLastBook = CurrentPage * BooksPerPage;
    const indexOfFirstBook = indexOfLastBook - BooksPerPage;
    const CurrentBooks = AllBooks.slice(indexOfFirstBook,indexOfLastBook);

    const getBooks = async () => {
        try {
            setLoading(true);
            const response = await fetch('/books');
            const jsonData = await response.json();
            setAllBooks(jsonData);
            setLoading(false);
        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        getBooks();
    }, []);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Fragment>
            <Link to='/'>
                <button>Home</button>
            </Link>
            <h1 style={{textAlign: 'center'}}>BookList</h1>
            <Books books={CurrentBooks} loading={Loading} />
            <Pagination 
                booksPerPage={BooksPerPage} 
                totalBooks={AllBooks.length} 
                paginate={paginate}
            />
        </Fragment>
    );
};

export default BookList;