import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import MyHeader from './components/MyHeader'
import MyFooter from './components/myFooter'

function Home() {

    return (
        <Fragment>
            <MyHeader />
            <div style={{textAlign: 'center'}}>
                <br />
                <h1>Welcome to SATAN's Library!</h1> 
                <br />
                <Link to='/books'>
                    <button>Our books</button>
                </Link>
                <br />
                <Link to='/books2'>
                    <button>Our books2</button>
                </Link>
            </div>
            <MyFooter />
        </Fragment>
    );
};

export default Home;