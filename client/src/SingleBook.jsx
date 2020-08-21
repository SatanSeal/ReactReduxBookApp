import React, { Fragment, useState, useEffect } from 'react';
import './css/main.css';
import EditModal from './components/EditModal';
import MyHeader from './components/MyHeader';
import { Link, useHistory } from 'react-router-dom';
import MyFooter from './components/myFooter';

const Book = ({ match }) => {

    let history = useHistory();

    const [Loading, setLoading] = useState(false);
    const [book, setBook] = useState({});  
    const [user, setUser] = useState('');
    const [CSRFToken, setCSRFToken] = useState(null);
    

    const getBook = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/books/${match.params.id}`);
            const jsonData = await response.json();
            setBook(jsonData[0]);
            setLoading(false);
        } catch (err) {
            console.error(err.message);
        }
    }

    const vj = async (req, res) => {
        const response = await fetch('/secure/verifyJWT');
        const user = await response.json();
        setUser(user); 
    }; 

    const getCSRFToken = async () => {
        const response = await fetch ('/secure/csrf-token');
        const token = await response.json();
        setCSRFToken(JSON.stringify(token).split('"')[3]);
    };

    const deleteBook = async (id) => {
        let check = window.confirm('Are you sure want to delete this book?');
        if (!check) {
            return;
        }
        try {
            await fetch(`/books/${id}`, {
                method: "DELETE",
                headers: { "CSRF-Token" : CSRFToken }
            }).then(
                alert('Book successfuly deleted!')
            ).then(
                history.push('/books')
            );
        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        getCSRFToken();
        getBook();
        vj();
        // eslint-disable-next-line
    }, []);

    function Buttons () {
        if (book.author === user.username || user.admin === true) {
            return (
                <table width="100%">
                    <tbody>
                        <td width="50%" align="right">
                            <EditModal book={book} CSRFToken={CSRFToken} end={getBook}/>
                        </td>
                        <td width="50%" align="left">
                            <button 
                                className="DeleteButton"
                                onClick={() => deleteBook(book.id)}>
                                Delete Book 
                            </button>
                        </td>
                    </tbody>
                </table>
            )
        }
    };

    if (Loading) {
        return (
            <Fragment>
                <MyHeader />
                <div style={{textAlign: 'center', paddingTop: '50px'}}>
                    <img src='./lightGreenLoading.svg' width='100px' alt="Loading..."></img> 
                </div>
                <MyFooter />
            </Fragment>
        )
    }
    if (book===undefined){
        return (
            <Fragment>
                <MyHeader />
                <div style={{textAlign: 'center', paddingTop: '10px'}}>
                    <h1>Book not found!</h1>
                    <Link to='/books'>
                        <button>Back to library</button>
                    </Link>
                </div>
                <MyFooter />
            </Fragment>
        )
    }
    return (
        <Fragment>
            <MyHeader />
            <div style={{textAlign: 'center', paddingTop: '10px'}}>
                    <Link to='/books'>
                        <button>Back to library</button>
                    </Link>
                <br />
                <br />
                <br />
                <font size="5">Title: </font><font size="6">{book.title}</font>
                <br />
                <br />
                <font size="5">Description: </font><font size="6">{book.description}</font>
                <br />
                <br />
                <font size="5">Author: </font><font size="6">{book.author}</font>
                <br />
                <br />
                <font size="3">id: </font><font size="3">{book.id}</font>
                <br />
                <br />
                {Buttons()}
            </div>
            <MyFooter />
        </Fragment>
    )
}

export default Book;