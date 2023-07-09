import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import * as reviewActions from '../../store/reviews'

import "./SpotDetails.css"

export const Reviews = ({ spotId, rating, numReviews }) => {
    const dispatch = useDispatch()
    const reviews = useSelector(state => state.reviews)

    useEffect(() => {
        dispatch(reviewActions.reviews(spotId))
    }, [dispatch]);

    const normalizedReviews = Object.values(reviews)
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    let showReviews
    let showNew
    if (numReviews === 0) {
        showNew = (<>New</>)
    } else {
        showNew = (
            <>
                <span>{`${rating} · `}</span>
                <span className='reserveReviewRating'>{`${numReviews} reviews`}</span>
            </>
        )
    }

    if (normalizedReviews[0]) {
        showReviews = normalizedReviews.map((rev) => {
            const { firstName } = rev.User
            const { id, review, updatedAt } = rev

            const date = new Date(updatedAt)
            const month = monthNames[date.getMonth()]
            const year = date.getFullYear()
            return (
                <div className='reviewBox' key={id} >
                    <div>
                        {firstName}
                    </div>
                    <div>
                        {`${month} ${year}`}
                    </div>
                    <div >
                        {review}
                    </div>
                </div>
            )
        })
    }



    return (
        <>
            <div className="reviewTop">
                <span className='reserveReviews'>
                    <span className="material-symbols-outlined">
                        star
                    </span>
                    {showNew}
                </span>
            </div>
            {showReviews}
        </>
    )
}
