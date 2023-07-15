import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useMenu } from "../../context/ShowMenuContext";

export const ModalLogin = () => {
    const dispatch = useDispatch();
    const history = useHistory()
    const [loginButton, setLoginButton] = useState(true)
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [res, setRes] = useState('')
    const { setShowMenu } = useMenu();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        const response = await dispatch(sessionActions.login({ credential, password }))
        if (response.user) {
            setShowMenu(false);
            history.push('/')
            document.body.classList.remove('active-modal')
        }
        else {
            setErrors(response.message)
        }

        if (Object.values(errors)) {
            setRes('The provided credentials were invalid.')
        }

    };


    useEffect(() => {
        if (credential.length <= 3) {
            setLoginButton(true)
        } else {
            setLoginButton(false)
        }
        if (password.length <= 5) {
            setLoginButton(true)
        } else {
            setLoginButton(false)
        }
    }, [credential, password])

    const demoUser = () => {
        setCredential('demo@user.com');
        setPassword('password')
    }

    return (
        <>
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                <div className="errorResponse">
                    {res}
                </div>
                <label>
                    Username or email
                    <div>
                        <input
                            type="text"
                            value={credential}
                            onChange={(e) => setCredential(e.target.value)}
                            required
                        />
                    </div>
                </label>
                <label>
                    Password
                    <div>
                        <input
                            type="password"
                            value={password}
                            autoComplete="on"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </label>
                {errors.credential && <p>{errors.credential}</p>}
                <button
                    className="loginButton"
                    disabled={loginButton}
                    type="submit">Log In</button>
                <div className="demoButton">
                    <button onClick={demoUser} className="demouser">
                        Log in as Demo User
                    </button>
                </div>
            </form >
        </>

    )
}
