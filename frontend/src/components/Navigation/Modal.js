import React, { useState, createContext, useContext } from "react";
import { ModalLogin } from './ModalLogin'
import "./Modal.css";

export const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export default function Modal() {
    const [modal, setModal] = useState(false);
    const [modalType, setModalType] = useState('')

    const toggleModalLogin = () => {
        setModal(!modal);
        setModalType('login')
    };

    let show
    if (modalType === 'login') {
        show = <ModalLogin />
    }


    if (modal) {
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }

    return (
        <>
            <nav
                to='/spots/new'
                className="linkText">
                Sign up
            </nav>


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