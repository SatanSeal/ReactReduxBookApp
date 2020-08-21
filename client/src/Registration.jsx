import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import PureLogoHeader from './components/PureLogoHeader';
import MyFooter from './components/myFooter';

const Registration = () => {

    let history = useHistory();

    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState('');
    const [firstPass, setFirstPass] = useState(null);
    const [secondPass, setSecondPass] = useState(null);
    const [CSRFToken, setCSRFToken] = useState(null);
    const [Loading, setLoading] = useState(false);

    async function UserCheck() {
        const response = await fetch('/secure/verifyJWT');
        const check = await response.json();
        if (check !== 0){
            history.push('/');
        }
    }

    const getCSRFToken = async () => {
        const response = await fetch ('/secure/csrf-token');
        const token = await response.json();
        setCSRFToken(JSON.stringify(token).split('"')[3]);
    }

    const FindUser = async (parameter, value) => {
        try{
            setLoading(true);
            const body = { parameter, value };
            const response = await fetch('/user/check', {
                method: "POST",
                headers: {"Content-Type": "application/json",
                          "CSRF-Token" : CSRFToken},
                body: JSON.stringify(body)
            });
            const existance = await response.json();
            setLoading(false);
            return existance;
        } catch (err) {
            console.error(err.message);
        }
    };    

    const usernameCheck = (username) => {
        const er = /^[A-Za-z0-9_-]{3,30}$/; 
        const res = er.test(username);
        return res;
    };

    const mailCheck = (mail) => {
        const er = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i;
        const res = er.test(mail);
        return res;
    };

    const passCheck = (pass) => {
        let flag = true;
        const res1 = pass.match(/[A-Z]/g);
        const res2 = pass.match(/[0-9]/g);
        const res3 = pass.match(/[a-z]/gi);
        const res4 = pass.match(/[!#%&,-.:;<=>@_]/g);
        if (res1 === null || res2 === null || res2.length < 3 || res3 === null || res3.length < 3 || res4 === null){
            flag = false;
        }
        return flag;
    }

    const RegistrationSubmit = async e => {
        e.preventDefault();
        if (!username){
            return alert('Username required!');
        }
        if (!usernameCheck(username)){
            return alert("Username incorrect! Username must be from 3 to 20  characters and may contain only latin upper and lower case letters and signs '_' and '-'");
        }
        const availability = await FindUser('username', username);
        if (availability) {
            return alert('This username already used!');
        }
        if (!email){
            return alert('E-mail required!');
        }    
        if (!mailCheck(email)){
            return alert('E-mail incorrect!');
        }
        const existance = await FindUser('email', email);
        if (existance){
            return alert('User with this e-mail already registred!');
        }
        if (!firstPass){
            return alert('Password required!');
        }        
        if (!passCheck(firstPass)){
            return alert('Password incorrect!\nPassword must contain at least: 1 capital letter, 3 letters , 3 numeric, 1 special( !#%&,-.:;<=>@_ )');
        }
        if (!secondPass){
            return alert('You should repeat password!');
        }
        if (!(firstPass === secondPass)) { 
            return alert('Passwords mismatch!');
        }

        setLoading(true);
        bcrypt.genSalt(12, (err, salt) => {
            if (err) throw err;
            bcrypt.hash(firstPass, salt, (err, hashedPassword) => {
                if (err) throw err;
                try {
                    const body = { username, email, hashedPassword };
                    fetch('/user/register', {
                        method: "POST",
                        headers: {"Content-Type": "application/json",
                                  "CSRF-Token" : CSRFToken},
                        body: JSON.stringify(body)
                    }).then(
                        setFirstPass('')
                    ).then(
                        setSecondPass('')
                    ).then(
                        setLoading(false)
                    ).then(
                        alert('User created!')
                    ).then(
                        history.push('/login')
                    );
                } catch (err) {
                    alert('Sorry, something went wrong...');
                    console.error(err);
                }
            });
        });
    };

    useEffect(() => {
        UserCheck();
        getCSRFToken();
        // eslint-disable-next-line
    }, []);

    function loading () {
        if (Loading) {
            return (
                <div className="modal">
                    <div className="loadingContent">
                        <img src='./darkestGreenLoading.svg' width='100px' alt="Loading..."></img>
                    </div>
                </div>
            )
        }
    }

    return (
        <div>
            <PureLogoHeader />
            <div style={{paddingLeft: '10px'}}>
                <h1 style={{textAlign: 'center'}}>Registration</h1>
                <form onSubmit={RegistrationSubmit}>
                    <table cellPadding="100">
                        <tbody>
                            <tr>
                                <td>
                                    Username:
                                </td>
                                <td>
                                    <input onChange={e => setUsername(e.target.value)}></input>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    E-mail:
                                </td>
                                <td>
                                    <input onChange={e => setEmail(e.target.value.toLowerCase())}></input>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Password:
                                </td>
                                <td>
                                    <input type="password" title="Password must contain at least: 1 capital letter, 3 letters , 3 numeric, 1 special( !#%&,-.:;<=>@_ )" onChange={e => setFirstPass(e.target.value)}></input>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Repeat password:
                                </td>
                                <td>
                                    <input type="password" onChange={e => setSecondPass(e.target.value)}></input>
                                </td>
                            </tr>
                            <br />
                            <tr>
                                <td>
                                    <input type="reset" value="Clear" />
                                </td>
                                <td>
                                    <button>Submit</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
                <div style={{paddingTop: '50px', paddingLeft: '10px'}}>
                    <font size='5'>Have an account?    </font>
                    <button onClick={() => history.push('/login')}>Log In</button>
                </div>
            </div>
            <MyFooter />
            {loading()}
        </div>
    )
};

export default Registration;