import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react'
import * as spotActions from '../../store/spots'
import Tooltip from 'react-tooltip-lite'
import { useMenu } from '../../context/ShowMenuContext';

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
            const rating = parseFloat(avgRating).toFixed(2);

            return (
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
                    <div>{`$${price} night`}</div>
                    <span>{rating}</span>
                </a >
            )
        })
    }


    useEffect(() => {
        dispatch(spotActions.spots())
        setShowMenu(false)
    }, [dispatch, setShowMenu]);

    return (
        <div className="spotsPage" >
            {show}
        </div>
    )
}

export default SpotsPage