import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <Fragment>
            <h1>Page Not Found</h1>
            <Link to='/'>Go home</Link>
        </Fragment>
    )
};

export default NotFound;