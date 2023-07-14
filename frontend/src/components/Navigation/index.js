import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import ProfileButton from './ProfileButton';
import Logo from './LogoButton'
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

    let sessionLinks;

    sessionLinks = (
        <div>
            <ProfileButton user={sessionUser} />
        </div>
    );

    let createNewSpotLink;

    if (sessionUser) {
        createNewSpotLink =
            (<NavLink to="/spots/new" style={{ color: "white" }} key="new">
                Create a New Spot
            </NavLink>)
    }


    return (
        <header>
            <div>
                <Logo></Logo>
            </div>
            {sessionLinks}
        </header>
    );
}

export default Navigation;