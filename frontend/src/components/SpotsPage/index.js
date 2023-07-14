import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react'
import * as spotActions from '../../store/spots'
import Tooltip from 'react-tooltip-lite'
import { useMenu } from '../../context/ShowMenuContext';

import pokemonback from '../../images/pokemon-card-back.png'

import './Spots.css'

const SpotsPage = () => {
    const dispatch = useDispatch()
    const spots = useSelector(state => state.spots);
    const { setShowMenu } = useMenu();
    const normalizedSpots = Object.values(spots)

    let show

    normalizedSpots.sort((a, b) => a.createdAt < b.createdAt ? 1 : -1)

    if (normalizedSpots[0]) {
        if (normalizedSpots[0].id) {
            show = normalizedSpots.map((spot) => {
                const { id, previewImg, city, state, price, name, avgRating } = spot
                let rating = parseFloat(avgRating).toFixed(1);
                if (!Number(rating)) {
                    rating = "New"
                }

                return (
                    <div className='spot'>
                        <a href={`/spots/${id}`}
                            className="spot-link"
                            key={id}
                        >
                            <Tooltip
                                content={name}
                                direction="up"
                                tagName="span"
                                className='target'
                            >
                                <img src={previewImg}
                                    // onerror={(e) => { e.target.onerror = null; e.target.src = { pokemonback } }}

                                    style={{ color: 'black' }}
                                    className='spotImg'
                                    alt={name}
                                    key={id}
                                />
                            </Tooltip>
                            <div className="details-container">
                                <span style={{ color: 'black' }} className='city-state'>{`${city}, ${state}`}</span>
                                <span style={{ color: 'black' }} className='ratings'>
                                    <i className="fa-solid fa-star"></i>
                                    {rating}
                                </span>
                            </div>
                            <div style={{ color: 'black' }} className='price'>{`$${price} night`}</div>

                        </a >
                    </div>
                )
            })
        }
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