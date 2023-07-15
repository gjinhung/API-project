import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useMenu } from "../../context/ShowMenuContext";

export const ModalSignup = () => {
    const dispatch = useDispatch();
    const history = useHistory()
    const [signupButton, setSignupButton] = useState(true)
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmP, setConfirmP] = useState('')
    const [errors, setErrors] = useState({});
    const { setShowMenu } = useMenu();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmP) {
            setErrors((prevErrors) => ({ ...prevErrors, password: `Passwords do not match` }))
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, password: '' }))
        }

        if (firstName.search(/[^A-Za-z\s]/) !== -1) {
            setErrors((prevErrors) => ({ ...prevErrors, firstName: `Only letters for First Name` }))
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, firstName: '' }))
        }

        if (lastName.search(/[^A-Za-z\s]/) !== -1) {
            setErrors((prevErrors) => ({ ...prevErrors, lastName: `Only letters for Last Name` }))
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, lastName: '' }))
        }

        if (!errors.password && !errors.firstName && !errors.lastName) {



            const user = {
                firstName,
                lastName,
                email,
                username,
                password
            }

            const response = await dispatch(sessionActions.signup(user)).catch((response) => {
                const data = response.json()
                return data
            })
            if (response.user) {
                setShowMenu(false);
                history.push('/')
                document.body.classList.remove('active-modal')
            }
            else {
                const { email, username } = response.errors
                setErrors((prevErrors) => ({ ...prevErrors, email, username }))

            }

        }

    };

    const demoUser = () => {
        setFirstName('Tracey');
        setLastName('Sketchit')
        setEmail('traceysketchit@pokemon.io')
        setUsername("traceysketchit")
        setPassword('password')
        setConfirmP('password')

    }

    useEffect(() => {
        if (firstName && lastName && email && username.length > 3 && password.length > 5 && confirmP) {
            setSignupButton(false)
        }
        else {
            setSignupButton(true)
        }
    }, [setSignupButton, firstName, lastName, email, username, password, confirmP])


    return (
        <>
            <h1>Sign Up</h1>
            <div style={{ color: "red" }}>
                {errors.password && <p>{errors.password}</p>}
                {errors.email && <p>{errors.email}</p>}
                {errors.username && <p>{errors.username}</p>}
                {errors.firstName && <p>{errors.firstName}</p>}
                {errors.lastName && <p>{errors.lastName}</p>}
            </div>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmP}
                        onChange={(e) => setConfirmP(e.target.value)}
                        required
                    />
                </div>

                <button
                    className="loginButton"
                    disabled={signupButton}
                    type="submit">Sign Up</button>
            </form >
            <div className="demoButton">
                <button onClick={demoUser} className="demouser">
                    Log in as Demo User
                </button>
            </div>
        </>

    )
}
