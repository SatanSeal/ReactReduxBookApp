import React, { Fragment, useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import bcrypt from 'bcryptjs';

const Login = () => {

    let history = useHistory();

    const [email, setEmail] = useState(null);
    const [pass, setPass] = useState(null);
    const [CSRFToken, setCSRFToken] = useState(null);

    const getJwt = async (user) => {
        const body = { user };
        await fetch('/jwt', {
            method: "POST",
            headers: {"Content-Type": "application/json",
                      "CSRF-Token" : CSRFToken},
            body: JSON.stringify(body)
        });
    };
    
    const getCSRFToken = async () => {
        const response = await fetch ('/csrf-token');
        const token = await response.json();
        setCSRFToken(JSON.stringify(token).split('"')[3]);
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

    const LoginSubmit = async e =>{
        e.preventDefault();
        if (!email){
            return alert('E-mail required!');
        }
        if (!mailCheck(email)){
            return alert('E-mail incorrect!');
        }
        if (!pass){
            return alert('Password required!');
        }        
        if (!passCheck(pass)){
            return alert('Password incorrect!\nPassword must contain at least: 1 capital letter, 3 letters , 3 numeric, 1 special( !#%&,-.:;<=>@_ )');
        }
        const body = { email };
        //await getCSRFToken(); не работает
        const response = await fetch('/login', {
            method: "POST",
            headers: {"Content-Type": "application/json",
                      "CSRF-Token" : CSRFToken},
            body: JSON.stringify(body)
        });
        var user = await response.json();
        if (!user) {
            return alert('E-mail or password are incorrect!');
        }
        
        bcrypt.compare(pass, user.password, async (err, res) => {
            if (err) throw err;
            if (res) {
                await getJwt(user);
                alert("Login successeful!");
                history.push('/');
            } else {
                user = null;
                return alert('E-mail or password are incorrect!');
            }
        });
    };
    
    useEffect(() => {
        getCSRFToken();
    }, []);

    return (
        <Fragment>
            <Link to='/'>
                <button>Home</button>
            </Link>
            <h1>Login</h1>
            <form onSubmit={LoginSubmit}>
                E-mail: <input onChange={e => setEmail(e.target.value)} placeholder="example@examle.com"></input>
                <br />
                Password: <input type="password" onChange={e => setPass(e.target.value)} placeholder="Your super strong password"></input>
                <br />
                <input type="submit" value="Log In"></input>
            </form>
            <br />
            <div>
                <h3>Don't have an account?</h3>
                <button onClick={() => history.push('/registration')}>Register</button>
            </div>
            <br />
            <br />
            <h3>HappySeal333! seal@gmail.com</h3>
        </Fragment>
    );
};

export default Login;


/*
    const [fetchError, setFetchError] = useState(null);

              {fetchError && (
            <p style={{ color: 'red' }}>{fetchError}</p>
            )}

*/