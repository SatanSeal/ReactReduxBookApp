import React, { Fragment, useState, useEffect }/*, { useEffect, useState, Fragment }*/ from 'react';
import { Link } from 'react-router-dom';

import './css/main.css';
import Books from './components/Books';
import Pagination from './components/Pagination';

const SearchedBooks = () => {
    const select = window.location.href.split('=')[1];
    const value = window.location.href.split('=')[2];

    const [AllBooks, setAllBooks ] = useState([]);
    const [Loading, setLoading ] = useState(false);
    const [CurrentPage, setCurrentPage] = useState(1);
    const [BooksPerPage] = useState(3);

    const indexOfLastBook = CurrentPage * BooksPerPage;
    const indexOfFirstBook = indexOfLastBook - BooksPerPage;
    const CurrentBooks = AllBooks.slice(indexOfFirstBook,indexOfLastBook);

    const SearchBooks = async () => {
        try {
            setLoading(true);
            //const response = await fetch(`http://localhost:80/search=${select}=${value}`);
            const response = await fetch(`/search=${select}=${value}`);
            const jsonData = await response.json();
            await setAllBooks(jsonData);
            setLoading(false);
        } catch (err) {
            console.error(err.message) 
        }
    };

    useEffect(() => {
        SearchBooks();
        // eslint-disable-next-line 
    }, []);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (AllBooks.length === 0) {
        return (
            <Fragment>
                <h1> There is no books with {select} '{value}'</h1>
                <Link to='/'>Go back</Link>
            </Fragment>
            
        )
    }
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

export default SearchedBooks;