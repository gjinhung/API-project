import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as spotActions from '../../store/spots'
import { ReserveButton } from './ReserveButton';
import { Reviews } from './Reviews';

const SpotsDetails = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots)


    useEffect(() => {
        dispatch(spotActions.spotDetails(spotId))
    }, [dispatch]);

    let images
    let spotDetails
    let hostDetails
    let reserveBox
    let reviews

    if (spot.id) {
        const { city, state, country, name, avgStarRating, description, numReviews, price, SpotImages } = spot
        const { firstName, lastName } = spot.Owner
        const rating = parseFloat(avgStarRating).toFixed(2);
        images = SpotImages.map(img => {
            return (
                < div key={img.id}>
                    <img src={img.url} className={`spotDetailsImg`} alt='' />
                </div >
            )
        })

        spotDetails = (
            <>
                <div style={{ fontSize: 26 }}>
                    {name}
                </div>
                <div style={{ fontSize: 14 }}>
                    {`${city}, ${state}, ${country}`}
                </div>
            </>
        )

        hostDetails = (
            <>
                <div>
                    {`Hosted by ${firstName} ${lastName}`}
                </div>
                <div>
                    {description}
                </div>
            </>
        )

        reserveBox = (
            <ReserveButton
                price={price}
                rating={rating}
                numReviews={numReviews}
            />
        )

        reviews = (
            <Reviews
                rating={rating}
                numReviews={numReviews}
                spotId={spotId}
            />
        )
    }

    return (
        <div className="spotDetailsPage">
            {spotDetails}
            {images}
            {hostDetails}
            {reserveBox}
            <hr className='solid'></hr>
            {reviews}
        </div>
    )
}

export default SpotsDetails