import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import MyHeader from './components/MyHeader';
import MyFooter from './components/myFooter'; 

const NotFound = () => {

    let history = useHistory();

    return (
        <Fragment>
            <MyHeader />
            <div style={{textAlign: 'center'}}>
                <h1>Page Not Found</h1>
                <button onClick={() => history.goBack()}>Go back</button>
            </div>
            <MyFooter />
        </Fragment>
    )
};

export default NotFound;