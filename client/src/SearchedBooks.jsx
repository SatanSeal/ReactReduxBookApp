import React, { Fragment, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './css/main.css';
import Books from './components/Books';
import Pagination from './components/Pagination';
import HeaderWithoutSearch from './components/HeaderWithoutSearch';
import MyFooter from './components/myFooter';

const SearchedBooks = () => {
    let history = useHistory();

    const [AllBooks, setAllBooks ] = useState([]);
    const [Loading, setLoading ] = useState(false);
    const [CurrentPage, setCurrentPage] = useState(1);
    const [BooksPerPage, setBooksPerPage] = useState(4);
    const [Select,  setSelect ] = useState('Title');
    const [Value, setValue ] = useState('');
    const [errorSelect,  setErrorSelect ] = useState('Title');
    const [errorValue, setErrorValue ] = useState('');

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
    
    let select = '';
    let value = '';

    const SearchBooks = async () => {        
        const splited = window.location.href.split('=');
        setErrorSelect(splited[1]);
        setErrorValue(splited[2]);
        select = splited[1];
        value = splited[2];
        try {
            setLoading(true);
            const response = await fetch(`/books/search=${select}=${value}`);
            const jsonData = await response.json();
            setAllBooks(jsonData);
            setLoading(false);
        } catch (err) {
            console.error(err) 
        }
    };

    const onSearchClick = async () => {
        if (Value === "") {
            return alert(`${Select} required!`)
        }
        history.push(`/search=${Select.toLowerCase()}=${Value}`);
        SearchBooks(); 
    };

    const enterCheck = (event) => {
        if (event.key === 'Enter'){
            onSearchClick();
        }
    };

    useEffect(() => {    
        SearchBooks();        
        // eslint-disable-next-line 
    }, []);

    const search = () => {
        return (
            <table width="100%">
                <tbody >
                    <tr>
                        <td width="21%"></td>
                        <td width="58%" style={{textAlign: "center"}}>
                            <select style={{height: '22px'}} onChange={e => setSelect(e.target.value)}>
                                <option>Title</option>
                                <option>Author</option>
                                <option>Description</option>
                                <option>id</option>
                            </select>
                            <input type="text" onChange={e => setValue(e.target.value)} onKeyPress={enterCheck}/>
                            <button onClick={onSearchClick}>Search</button>
                        </td>
                        <td width="21%" style={{textAlign: "right", paddingRight: "5px"}}>
                            <font>Books per page: </font>
                            <br /> 
                            <input id="BPPinput" type="text" size="1" maxLength="3" placeholder="4"></input>
                            <button onClick={() => setBPP()}>Set</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }

    if (Loading) {
        return (
            <Fragment>
                <HeaderWithoutSearch />
                <div style={{textAlign: 'center', paddingTop: '50px' }}>
                    <img style={{paddingBottom: '50px'}} src='./lightGreenLoading.svg' width='100px' alt="Loading..."></img>
                    <br />
                    <button onClick={() => history.goBack()}>Go back</button>
                </div>
                <MyFooter />
            </Fragment>
        )
    }
    if (AllBooks.length === 0) {
        return (
            <Fragment>
                <HeaderWithoutSearch />
                {search()}
                <div style={{textAlign: 'center', paddingTop: '50px' }}>
                    <h1>There is no books with {errorSelect} '{decodeURIComponent(errorValue)}'</h1>
                    <br />
                    <br />
                    <button onClick={() => history.goBack()}>Go back</button>
                </div>
                <MyFooter />
            </Fragment>
        )
    }
    return (
        <Fragment>
            <HeaderWithoutSearch />
            {search()}
            <h1 style={{textAlign: 'center'}}>Searched books</h1>
            <Books books={CurrentBooks} loading={Loading} />
            <Pagination 
                booksPerPage={BooksPerPage} 
                totalBooks={AllBooks.length} 
                CurrentPage = {CurrentPage}
            />
            <MyFooter />
        </Fragment>
    );
};

export default SearchedBooks;