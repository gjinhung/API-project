import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react'
import * as spotActions from '../../store/spots'
import Tooltip from 'react-tooltip-lite'
import { useMenu } from '../../context/ShowMenuContext';
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';
import { DeleteButton } from './DeleteButton'

import './Spots.css'

const SpotsPage = () => {
    const dispatch = useDispatch()
    const spots = useSelector(state => state.spots);
    const { setShowMenu } = useMenu();
    const normalizedSpots = Object.values(spots)

    let show

    if (normalizedSpots[0]) {

        show = normalizedSpots.map((spot) => {
            const { id, previewImg, city, state, price, name, avgRating } = spot
            const rating = parseFloat(avgRating).toFixed(1);

            return (
                <>
                    <a href={`/spots/${id}`}
                        className="spot"
                        key={id}
                    >
                        <Tooltip
                            content={name}
                            direction="up"
                            tagName="span"
                            className='target'>
                            <img src={previewImg}
                                className='spotImg'
                                alt={name}
                            />
                        </Tooltip>
                        <div>{`${city}, ${state}`}</div>
                        <div>{rating}</div>
                        <div>{`$${price} night`}</div>
                    </a >
                    <NavLink to={`/spots/${id}/edit`}>
                        Update
                    </NavLink>

                    <DeleteButton spotId={id} />
                </>
            )
        })
    }


    useEffect(() => {
        dispatch(spotActions.getCurrentSpots())
        setShowMenu(false)
    }, [dispatch, setShowMenu]);

    return (
        <div className="spotsPage">
            <div>Manage Spots</div>
            <div>
                <NavLink to="/spots/new">Create a New Spot</NavLink>
            </div>
            <div>
                {show}
            </div>

        </div>
    )
}

export default SpotsPage