import React, { Fragment, useState, useEffect } from 'react';
import './css/main.css';
import EditModal from './components/EditModal';
import MyHeader from './components/MyHeader';
import { useHistory } from 'react-router-dom';

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
                <Fragment>
                    <EditModal book={book} CSRFToken={CSRFToken} end={getBook}/>
                    <button 
                        className="DeleteButton"
                        onClick={() => deleteBook(book.id)}>
                        Delete Book 
                    </button>  
                </Fragment>
            )
        }
    };

    if (Loading) {
        return (
            <Fragment>
                <MyHeader />
                <h1 className='loading'>Loading...</h1>
                <button onClick={() => history.goBack()}>Go back</button>
            </Fragment>
        )
    }
    if (book===undefined){
        return (
            <div>
                <h1>Book not found!</h1>
                <button onClick={() => history.goBack()}>Go back</button>
            </div>
        )
    }
    return (
        <Fragment>
            <MyHeader />
            <button onClick={() => history.goBack()}>Go back</button>
            <div style={{textAlign: 'center'}}>
                <h1>Title: {book.title}</h1>
                <h1>Description: {book.description}</h1>
                <h1>Author: {book.author}</h1>
                <h3>id: {book.id}</h3>
                {Buttons()}
            </div>
        </Fragment>
    )
}

export default Book;