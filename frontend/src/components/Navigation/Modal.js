import React, { useState } from "react";
import { ModalLogin } from './ModalLogin'
import { ModalSignup } from "./ModalSignUp";
import "./Modal.css";

export default function Modal() {
    const [modal, setModal] = useState(false);
    const [modalType, setModalType] = useState('')

    const toggleModalLogin = () => {
        setModal(!modal);
        setModalType('login')
    };

    const toggleModalSignup = () => {
        setModal(!modal);
        setModalType('signup')
    };

    let show
    if (modalType === 'login') {
        show = <ModalLogin />
    }
    if (modalType === 'signup') {
        show = <ModalSignup />
    }


    if (modal) {
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }



    return (
        <>
            <nav onClick={toggleModalSignup} className="linkText">SignUp</nav>
            {modal && (
                <div className="modal">
                    <div onClick={toggleModalSignup} className="overlay"></div>
                    <div className="modal-content">
                        {show}
                    </div>
                </div>
            )}


            <nav onClick={toggleModalLogin} className="linkText">Login</nav>
            {modal && (
                <div className="modal">
                    <div onClick={toggleModalLogin} className="overlay"></div>
                    <div className="modal-content">
                        {show}
                    </div>
                </div>
            )}
        </>
    );
}