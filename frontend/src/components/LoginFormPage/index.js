import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import "./LoginForm.css";

function LoginFormPage() {
    const dispatch = useDispatch();
    const history = useHistory()
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        const response = await dispatch(sessionActions.login({ credential, password }))
        if (response.user) {
            history.push('/')
        }
        else {
            setErrors(response.message)
        }
    };


    return (
        <>
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Username or Email
                    <input
                        type="text"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                {errors.credential && <p>{errors.credential}</p>}
                <button type="submit">Log In</button>
            </form>
        </>
    );
}

export default LoginFormPage;