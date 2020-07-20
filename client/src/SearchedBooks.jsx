import React, { Fragment, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import './css/main.css';
import Books from './components/Books';
import Pagination from './components/Pagination';

const SearchedBooks = () => {
    let history = useHistory();

    const splited = window.location.href.split('=');
    const select = splited[1];
    const value = splited[2];

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
            const response = await fetch(`/books/search=${select}=${value}`);
            const jsonData = await response.json();
            setAllBooks(jsonData);
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
    if (Loading) {
        return (
            <Fragment>
                <h1>Loading</h1>
                <button onClick={() => history.goBack()}>Go back</button>
            </Fragment>
        )
    }
    if (AllBooks.length === 0) {
        return (
            <Fragment>
                <h1> There is no books with {select} '{value}'</h1>
                
            </Fragment>
        )
    }
    return (
        <Fragment>
            <button onClick={() => history.goBack()}>Go back</button>
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