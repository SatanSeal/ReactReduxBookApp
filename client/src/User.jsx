import React, { useEffect, useState, Fragment } from 'react';
import PureLogoHeader from './components/PureLogoHeader';
import AddModal from './components/AddModal';
import { useHistory } from 'react-router-dom';

const User = () => {

    let history = useHistory();

    const [user, setUser] = useState('');

    const vj = async (req, res) => {
        const response = await fetch('/secure/verifyJWT');
        const user = await response.json();
        if (user.username === "Guest"){
            return history.goBack();
        }
        setUser(user); 
    }; 

    const logout = async () => {
        await fetch('/user/logout');
        history.push('/');
    }

    useEffect(() => {
        vj();
        // eslint-disable-next-line
    }, []);

    return (
        <Fragment>
            <PureLogoHeader />
            <font size='7'>{user.username} </font>
            <button onClick={()=>logout()}>Log out</button>
            <br />
            <br />
            <AddModal author={user.username}/>
        </Fragment>
    )
}

export default User;