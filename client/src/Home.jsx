import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import MyHeader from './components/MyHeader';

function Home() {

    let history = useHistory();

    return (
        <Fragment>
            <MyHeader />
            <div style={{textAlign: 'center'}}>
                <br />
                <h1>Welcome to SATAN's Library!</h1> 
                <br />
                <button  onClick={() => history.push('/books')}>Our books</button>
            </div>
        </Fragment>
    );
};

export default Home;