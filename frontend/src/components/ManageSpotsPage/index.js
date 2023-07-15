import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react'
import * as spotActions from '../../store/spots'
import { useMenu } from '../../context/ShowMenuContext';
import { NavLink, useHistory } from 'react-router-dom';
import { DeleteButton } from './DeleteButton'

import './Spots.css'

const SpotsPage = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const spots = useSelector(state => state.spots);
    const { setShowMenu } = useMenu();
    const normalizedSpots = Object.values(spots)



    let show
    let showCreate
    normalizedSpots.sort((a, b) => a.createdAt < b.createdAt ? 1 : -1)

    if (normalizedSpots[0]) {
        if (normalizedSpots[0].id) {

            show = normalizedSpots.map((spot) => {
                const { id, previewImg, city, state, price, name, avgRating } = spot
                const rating = parseFloat(avgRating).toFixed(1);
                const updateButton = (e) => {
                    history.push(`/spots/${id}/edit`)
                }
                return (
                    <div className='spot'>
                        <a href={`/spots/${id}`}
                            className='spot-link'
                            key={id}
                        >
                            <img src={previewImg}
                                className='spotImg'
                                alt={name}
                            />
                            <div className="details-container">
                                <span style={{ color: 'black' }} className='city-state'>{`${city}, ${state}`}</span>
                                <span style={{ color: 'black' }} className='ratings'>
                                    <i className="fa-solid fa-star"></i>
                                    {rating}
                                </span>
                            </div>
                            <div style={{ color: 'black' }} className='price'>{`$${price} night`}</div>

                        </a >
                        <div>
                            <button className="updateButton" onClick={updateButton}>
                                Update
                            </button>

                            <DeleteButton spotId={id} />
                        </div>
                    </div >
                )
            })
        }
    } else {
        showCreate = (
            <div className='create-spot-container'>
                <a href="/spots/new" class="new-spot-button">Create a New Spot</a>
            </div>
        )
    }


    useEffect(() => {
        dispatch(spotActions.getCurrentSpots())
        setShowMenu(false)
    }, [dispatch, setShowMenu]);

    return (
        <div className="spots-page">
            <div className='manage-spots-title'>Manage Spots</div>
            {showCreate}
            <div className='spotsContainer'>
                {show}
            </div>

        </div >
    )
}

export default SpotsPage