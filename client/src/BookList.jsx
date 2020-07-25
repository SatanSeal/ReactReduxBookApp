import React, { useEffect, useState, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import './css/main.css';
import Books from './components/Books';
import Pagination from './components/Pagination';
import MyHeader from './components/MyHeader';

const BookList = () => {

    let history = useHistory();

    const [AllBooks, setAllBooks] = useState([]);
    const [Loading, setLoading] = useState(false);
    const [CurrentPage, setCurrentPage] = useState(1);
    const [BooksPerPage] = useState(4);

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
    if (Loading) {
        return (
            <Fragment>
                <MyHeader />
                <h1>Loading</h1>
                <button onClick={()=>history.push('/')}>Home</button>
            </Fragment>
        )
    }
    return (
        <Fragment>
            <MyHeader />
            <h1 style={{textAlign: 'center'}}>BookList</h1>
            <Books books={CurrentBooks} />
            <Pagination 
                booksPerPage={BooksPerPage} 
                totalBooks={AllBooks.length} 
                paginate={paginate}
            />
        </Fragment>
    );
};

export default BookList;