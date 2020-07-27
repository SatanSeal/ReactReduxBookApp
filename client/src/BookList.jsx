import React, { useEffect, useState, Fragment } from 'react';
import './css/main.css';
import Books from './components/Books';
import Pagination from './components/Pagination';
import MyHeader from './components/MyHeader';
import MyFooter from './components/myFooter';

const BookList = () => {

    const [AllBooks, setAllBooks] = useState([]);
    const [Loading, setLoading] = useState(true);
    const [CurrentPage, setCurrentPage] = useState(1);
    const [BooksPerPage, setBooksPerPage] = useState(4);

    const indexOfLastBook = CurrentPage * BooksPerPage;
    const indexOfFirstBook = indexOfLastBook - BooksPerPage;
    const CurrentBooks = AllBooks.slice(indexOfFirstBook,indexOfLastBook);

    function setBPP () {
        let BPPval = +document.getElementById('BPPinput').value;
        if (!Number.isInteger(BPPval)){
            setBooksPerPage(4);
            return;
        }
        if (BPPval === 0) {
            return alert('Books per page cannot be 0');
        }
        setCurrentPage(1);
        setBooksPerPage(BPPval); 
    }

    const getBooks = async () => {
        try {
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

    function booksLoading () {
        if (Loading) {
            return (
                <div style={{textAlign: 'center', paddingTop: '50px'}}>
                    <img src='./lightGreenLoading.svg' width='100px' alt="Loading..."></img> 
                </div>
            )
        }
        if (Loading === false  && AllBooks.length === 0) {
            return (
                <Fragment>
                    <h1 style={{textAlign: 'center'}}>Sorry, but library is empty...</h1>
                </Fragment>
            )
        } else {
            return (
                <Fragment>
                    <div style={{paddingTop: "5px", paddingRight: "5px", textAlign: "right"}}>
                        <font>Books per page: </font>
                        <br /> 
                        <input id="BPPinput" type="text" size="1" maxLength="3" placeholder="4"></input>
                        <button onClick={() => setBPP()}>Set</button>
                    </div>
                    <h1 style={{textAlign: 'center'}}>BookList</h1>

                    <Books books={CurrentBooks} />
                    <Pagination 
                        booksPerPage={BooksPerPage} 
                        totalBooks={AllBooks.length} 
                        paginate={paginate}
                        CurrentPage = {CurrentPage}
                    />
                </Fragment>
            )
        }
    }

    return (
        <Fragment>
            <MyHeader />
            {booksLoading()}
            <MyFooter />
        </Fragment>
    );
};

export default BookList;