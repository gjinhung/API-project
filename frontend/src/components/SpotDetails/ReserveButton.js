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
                <span className="material-symbols-outlined">
                    star
                </span>
                <span>{`New`}</span>
            </>
        )

    } else {
        show = (
            <>
                <span className="material-symbols-outlined">
                    star
                </span>
                <span>{`${rating} · `}</span>
                <span className='reserveReviewRating'>{`${numReviews} reviews`}</span>
            </>
        )
    }

    return (
        <div className='reserveBox'>
            <span style={{ width: 300 }} className='reservePrice'>{`$${price} night`}</span>
            <span className='reserveReviews'>
                {show}
            </span>
            <div className='reserveButton'>
                <button className='reserve' style={{ width: 300 }} onClick={handleClick}>RESERVE</button>
            </div>
        </div >
    )
}
