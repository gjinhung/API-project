import React, { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import { useMenu } from "../../context/ShowMenuContext";

import './Navigation.css';
import "./Modal.css";

import ModalFunction from "./Modal";


function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const { showMenu, setShowMenu } = useMenu();

    const ulRef = useRef();

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false)
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu, setShowMenu]);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
    };

    let dropdown

    if (user) {
        dropdown = (
            <div className="dropdown-menu">
                <div>{`Hello, ${user.firstName}`}</div>
                <div>{user.email}</div>
                <hr style={{ color: "black" }}></hr>
                <NavLink to="/spots/current" className="manage-spots">Manage Spots</NavLink>
                <div>
                    <hr style={{ color: "black" }}></hr>
                    <button onClick={logout} className="logout-button">Log Out</button>
                </div>
            </div>
        )
    } else {
        dropdown = (
            <div className="dropdown-menu">
                <ModalFunction>

                </ModalFunction>
            </div>
        )
    }


    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    return (
        <div className='menu-container'>
            <button onClick={openMenu}>
                <i className="fas fa-user-circle" />
            </button>
            <div className={ulClassName} ref={ulRef} >
                {dropdown}
            </div>
        </div>
    );
}

export default ProfileButton;