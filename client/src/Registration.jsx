import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import PureLogoHeader from './components/PureLogoHeader';

const Registration = () => {

    let history = useHistory();

    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [firstPass, setFirstPass] = useState(null);
    const [secondPass, setSecondPass] = useState(null);
    const [CSRFToken, setCSRFToken] = useState(null);
    //const [regError, setRegError] = useState(null);

    async function UserCheck() {
        const response = await fetch('/secure/verifyJWT');
        const user = await response.json();
        if (user.username !== 'Guest'){
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
            const body = { parameter, value };
            const response = await fetch('/user/check', {
                method: "POST",
                headers: {"Content-Type": "application/json",
                          "CSRF-Token" : CSRFToken},
                body: JSON.stringify(body)
            });
            const existance = await response.json();
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
        //setRegError(null);
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
            //return setRegError('User with this e-mail already registred!');
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
        // setloading true
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
                        alert('User created!')
                    ).then(
                        history.push('/user/login')
                    );
                } catch (err) {
                    console.error(err.message)
                }
            });
        });
        //setloading false
    };

    useEffect(() => {
        UserCheck();
        getCSRFToken();
        // eslint-disable-next-line
    }, []);

    return (
        <div>
            <PureLogoHeader />
            <div style={{paddingLeft: '10px'}}>
                <h1>Registration</h1>

                <form onSubmit={RegistrationSubmit}>
                    Username: <input onChange={e => setUsername(e.target.value)}></input>
                    <br />
                    E-mail: <input onChange={e => setEmail(e.target.value)}></input>
                    <br />
                    Password: <input type="password" onChange={e => setFirstPass(e.target.value)}></input>
                    <br />
                    Repeat password: <input type="password" onChange={e => setSecondPass(e.target.value)}></input>
                    <br />
                    <input type="reset" value="Clear" />
                    <button>Submit</button>
                </form>

                <div>
                    <h3>Have an account?</h3>
                    <button onClick={() => history.push('/user/login')}>Log In</button>
                </div>
            </div>
        </div>
    )
};

export default Registration;