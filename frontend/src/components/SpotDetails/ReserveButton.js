import React from 'react'
import './SpotDetails.css'

export const ReserveButton = ({ price, rating, numReviews }) => {
    rating = parseFloat(rating).toFixed(1);
    const handleClick = () => {
        window.alert('Feature Coming Soon...');
    };
    let show
    if (numReviews === 0) {
        show = (
            <>

                <span> <i className="fa-solid fa-star"></i>{`New`}</span>
            </>
        )

    } else {
        show = (
            <>
                <i className="fa-solid fa-star"></i>
                <span>{`${rating} · `}</span>
                <span className='reserveReviewRating'>{`${numReviews} reviews`}</span>
            </>
        )
    }

    return (
        <div className='reserveBox'>
            <div className='reserveBox-top'>
                <span className='reservePrice'>{`$${price} night`}</span>
                <span className='reserveReviews'>
                    {show}
                </span>
            </div>

            <button className='reserve' onClick={handleClick}>RESERVE</button>

        </div >
    )
}
