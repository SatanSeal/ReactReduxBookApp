import React, { Fragment, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AddModal from './components/AddModal';
import Search from './components/BookSearch';
import './css/main.css';

function Home() {

    let history = useHistory();

    const [user, setUser] = useState('');
    const [CSRFToken, setCSRFToken] = useState();

    const vj = async (req, res) => {
        const response = await fetch('/verifyJWT');
        const user = await response.json();
        setUser(user); 
    }; 

    const getCSRFToken = async () => {
        const response = await fetch ('/csrf-token');
        const token = await response.json();
        setCSRFToken(JSON.stringify(token).split('"')[3]);
    };

    function handleClick(adress) {
        history.push(`/${adress}`);
    }

    const logout = async () => {
        await fetch('/logout');
        vj();
    }

    function buttonChange () {
        if (user.username === "Guest"){
            return (
                <Fragment>
                    <button onClick={() => handleClick('registration')}>Register</button> 
                    <button onClick={() => handleClick('login')}>Log In</button>
                </Fragment>
            );
        } else {
            return <button onClick={() => logout()} >Log out</button>;
        }
    }

    function addButton() {
        if (user.username !== "Guest") {
            return (
                <Fragment>
                    <br />
                    <br />
                    <AddModal author={user.username} CSRFToken={CSRFToken}/>
                </Fragment>
            )
        }
    };

    useEffect(() => {
        getCSRFToken();
        vj();
    }, []);

    return (
        <Fragment>
            <h1>Welcome, {user.username}! {buttonChange()}</h1> 
            
            <button onClick={() => handleClick('books')}>Our Library</button>

            {addButton()}
            <br />
            <br />
            <Search />
            <br />
            
        </Fragment>
    );
};

export default Home;