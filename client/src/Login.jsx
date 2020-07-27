import React, { Fragment, useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import PureLogoHeader from './components/PureLogoHeader';
import MyFooter from './components/myFooter';

const Login = () => {

    let history = useHistory();

    const [email, setEmail] = useState(null);
    const [pass, setPass] = useState(null);
    const [CSRFToken, setCSRFToken] = useState(null);
    const [Loading, setLoading] = useState(false);

    async function UserCheck() {
        const response = await fetch('/secure/verifyJWT');
        const check = await response.json();
        if (check !== 0){
            history.push('/');
        }
    }

    const getJwt = async (user) => {
        const body = { user };
        await fetch('/secure/jwt', {
            method: "POST",
            headers: {"Content-Type": "application/json",
                      "CSRF-Token" : CSRFToken},
            body: JSON.stringify(body)
        });
    };

    const getCSRFToken = async () => {
        const response = await fetch ('/secure/csrf-token');
        const token = await response.json();
        setCSRFToken(JSON.stringify(token).split('"')[3]);
        return JSON.stringify(token).split('"')[3];
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

        setLoading(true);
        const body = { email };
        const response = await fetch('/user/login', {
            method: "POST",
            headers: {"Content-Type": "application/json",
                      "CSRF-Token" : CSRFToken},
            body: JSON.stringify(body)
        });
        var user = await response.json();
        if (!user) {
            setLoading(false);
            return alert('E-mail or password are incorrect!');
        }
        
        bcrypt.compare(pass, user.password, async (err, res) => {
            if (err) throw err;
            if (res) {
                await getJwt(user);
                setLoading(false);
                alert("Login successeful!");
                history.push('/');
            } else {
                user = null;
                setLoading(false);
                return alert('E-mail or password are incorrect!');
            }
        });
    };

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
    
    useEffect(() => {
        UserCheck();
        getCSRFToken();
        // eslint-disable-next-line
    }, []);

    return (
        <Fragment>
            <PureLogoHeader />
            <div style={{paddingLeft: '10px'}}>
                <h1 style={{textAlign: 'center'}}>Login</h1>
                <form onSubmit={LoginSubmit}>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    E-mail:
                                </td>
                                <td>
                                    <input 
                                        onChange={e => setEmail(e.target.value.toLowerCase())} 
                                        placeholder="example@examle.com"
                                        size="21">
                                    </input>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Password:
                                </td>
                                <td>
                                    <input 
                                        type="password" 
                                        onChange={e => setPass(e.target.value)} 
                                        placeholder="Your super strong password"
                                        size="21">
                                    </input>
                                </td>
                            </tr>
                            <br />
                            <tr>
                                <td>
                                    <input type="submit" value="Log In"></input>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
                <br />
                <div style={{paddingTop: '50px', paddingLeft: '10px'}}>
                    <font size='5'>Don't have an account?       </font>
                    <Link to='/registration'>
                        <button>Register</button>
                    </Link>
                </div>
            </div>
            <MyFooter />
            {loading()}
        </Fragment>
    );
};

export default Login;