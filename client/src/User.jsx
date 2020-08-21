import React, { useEffect, useState, Fragment } from 'react';
import PureLogoHeader from './components/PureLogoHeader';
import AddModal from './components/AddModal2';
import { useHistory } from 'react-router-dom';
import MyFooter from './components/myFooter';

const User = () => {

    let history = useHistory();

    const [user, setUser] = useState('');
    const [Loading, setLoading] = useState(false);

    const vj = async (req, res) => {
        setLoading(true);
        const response = await fetch('/secure/verifyJWT');
        const user = await response.json();
        if (user.username === "Guest"){
            return history.goBack();
        }
        setUser(user);
        setLoading(false); 
    }; 

    const logout = async () => {
        await fetch('/user/logout');
        history.push('/');
    }

    function userPlace () {
        if (Loading){
            return (
                <div style={{textAlign: 'center', paddingTop: '50px'}}>
                    <img src='./lightGreenLoading.svg' width='80px' alt="Loading..."></img>
                </div>
            ) 
        }
        return (
            <div style={{paddingLeft: "50px", paddingTop: "50px"}}>
                <font size='7'>{user.username} </font>
                <br />
                <br />
                <button onClick={()=>logout()}>Log out</button>            
                <br />
                <br />
                <AddModal author={user.username}/>
            </div>
        )
    }

    useEffect(() => {
        vj();
        // eslint-disable-next-line
    }, []);

    return (
        <Fragment>
            <PureLogoHeader />
            {userPlace()}
            <MyFooter />
        </Fragment>
    )
}

export default User;