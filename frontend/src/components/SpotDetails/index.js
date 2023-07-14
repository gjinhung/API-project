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
    // const spotReviews = useSelector(state => state.reviews)


    useEffect(() => {
        dispatch(spotActions.spotDetails(spotId))
    }, [dispatch, spotId]);



    let spotDetails
    let hostDetails
    let reserveBox
    let reviews
    let section1
    let section2 = []
    if (spot.Owner) {
        const { city, state, country, name, description, numReviews, price, SpotImages, avgStarRating } = spot
        const { firstName, lastName } = spot.Owner
        let parsedAvgStarRating = parseFloat(avgStarRating).toFixed(1);

        SpotImages.forEach(img => {
            if (img.preview) {
                section1 = (
                    <img src={img.url} className="previmg" alt='' />)
            } else {
                section2.push(
                    img
                )

            }
        })

        spotDetails = (
            <>
                <div style={{ fontSize: 26 }} className='detail-name'>
                    {name}
                </div>
                <div style={{ fontSize: 14 }} className='detail-location'>
                    {`${city}, ${state}, ${country}`}
                </div>
            </>
        )

        hostDetails = (
            <>
                <div className='hostDetails span2'>
                    {`Hosted by ${firstName} ${lastName}`}
                </div>
                <div className='description'>
                    {description}
                </div>
            </>
        )

        reserveBox = (
            <ReserveButton
                price={price}
                rating={parsedAvgStarRating}
                numReviews={numReviews}
            />
        )

        reviews = (
            <Reviews
                rating={parsedAvgStarRating}
                numReviews={numReviews}
                spotId={spotId}
            />
        )
    }

    return (
        <div className="spotDetailsPage">
            {spotDetails}
            <div className='detail-images'>
                <div className='section1'>
                    {section1 && section1}
                </div>
                <div className='section2'>
                    {section2[0] && <img src={section2[0].url} className='img one' alt='' />}
                    {section2[1] && <img src={section2[1].url} className='img two' alt='' />}
                    {section2[2] && <img src={section2[2].url} className='img three' alt='' />}
                    {section2[3] && <img src={section2[3].url} className='img four' alt='' />}
                </div>
            </div>
            <div className='section3'>
                <div className="host-details">
                    {hostDetails}
                </div>
                <div></div>
                <div className='reservation-box'>
                    {reserveBox}
                </div>
            </div>
            <hr className='solid'></hr>
            {reviews}
        </div >
    )
}

export default SpotsDetails