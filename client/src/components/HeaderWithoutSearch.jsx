import React, { useEffect, useState, Fragment } from 'react';
import '../css/main.css';
import { Link } from 'react-router-dom';

const MyHeader = () => {

    const [user, setUser] = useState('');
    const [Loading, setLoading] = useState(false);

    const vj = async (req, res) => {
        setLoading(true);
        const response = await fetch('/secure/verifyJWT');
        const user = await response.json(); // {normal user} / 0 if no user / 1 if bad jwt
        const error = JSON.stringify(user);
        if (error === '1'){
            setUser({ username: 'Guest', admin: false});
            alert('Ooops... There is some problems with your account :(');
            setLoading(false);
            return;
        }
        if (user && error !== 0 && error !== 1){
            setUser(user);
            setLoading(false);
            return;         
        }
        setUser({ username: 'Guest', admin: false});
        setLoading(false);
    }; 

    function buttonChange () {
        if (user.username === "Guest"){
            return (
                <Fragment>
                    <Link to='/registration'>
                        <button>Register</button>
                    </Link>
                    <Link to='/login'>
                        <button>Log In</button>
                    </Link>
                </Fragment>
            );
        } else {
            return (
                <Link to='/user'>
                    <button>Account</button>
                </Link>
            )
        }
    }

    function userColumn () {
        if (Loading){
            return <img src='./darkGreenLoading.svg' width='40px' alt="Loading..."></img>;
        }
        return (
            <Fragment>
                <font size='5'>{user.username} </font>
                <br />
                <br />
                {buttonChange()}
            </Fragment>
        )
    }

    useEffect(() => {
        vj();
    }, []);

    return (
        <table className="HeaderTable" cellPadding='20'>
            <tbody>
                <tr >
                    <td width="33%" >
                    </td>
                    <td width="33%" align='center'>
                        <Link to='/'>
                            <img src="./sl.png" className="HeaderLogo" alt='logo'/>
                        </Link>
                    </td>
                    <td width="33%" align='right'>
                        {userColumn()}
                    </td>
                </tr>
            </tbody>
        </table>
    )
};

export default MyHeader;