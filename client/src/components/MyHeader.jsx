import React, { useEffect, useState, Fragment } from 'react';
import '../css/main.css';
import { useHistory } from 'react-router-dom';
import Search from './BookSearch';

const MyHeader = () => {

    let history = useHistory();

    const [user, setUser] = useState('');

    const vj = async (req, res) => {
        const response = await fetch('/secure/verifyJWT');
        const user = await response.json();
        setUser(user); 
    }; 

    function buttonChange () {
        if (user.username === "Guest"){
            return (
                <Fragment>
                    <button onClick={() => history.push('/registration')}>Register</button> 
                    <button onClick={() => history.push('/login')}>Log In</button>
                </Fragment>
            );
        } else {
            return <button onClick={()=>history.push('/user')}>Account</button>
        }
    }

    useEffect(() => {
        vj();
    }, []);

    return (
        <table className="HeaderTable" cellPadding='20'>{/*border='1'*/}
            <tbody>
                <tr >
                    <td width="33%" >
                        <Search />
                    </td>
                    <td width="33%" align='center'>
                        <img src="./sl.png" className="HeaderLogo" alt='logo' onClick={() => history.push('/')}/>
                    </td>
                    <td width="33%" align='right'>
                        <font size='5'>{user.username} </font>
                        <br />
                        {buttonChange()}
                    </td>
                </tr>
            </tbody>
        </table>
    )
};

export default MyHeader;