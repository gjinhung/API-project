import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import * as reviewActions from '../../store/reviews'
import { PostReviewButton } from './PostReviewButton';
import { DeleteReviewButton } from './DeleteReviewButton';

import "./SpotDetails.css"

export const Reviews = ({ spotId, rating, numReviews }) => {
    const dispatch = useDispatch()
    const reviews = useSelector(state => state.reviews)
    const user = useSelector(state => state.session)
    const spot = useSelector(state => state.spots)
    console.log(spot.name)

    useEffect(() => {
        dispatch(reviewActions.reviews(spotId))
    }, [dispatch, spotId]);

    const normalizedReviews = Object.values(reviews)
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];


    let showReviews
    let showNew


    if (numReviews === 0) {
        showNew = (<>
            New
            <div>
                <PostReviewButton
                    reviews={reviews}
                    name={spot.name}
                />
            </div>
        </>)
    } else {
        let reviewWord = "Reviews"
        if (numReviews < 2) {
            reviewWord = "Review"
        }


        showNew = (
            <span>
                <span>{`${rating}· `}</span>
                <span className='reserveReviewRating'>{`${numReviews} ${reviewWord}`}</span>
                <div>
                    <PostReviewButton
                        reviews={reviews} />
                </div>
            </span>
        )
    }

    if (normalizedReviews[0]) {

        normalizedReviews.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1)
        showReviews = normalizedReviews.map((rev) => {
            let showDeleteButton
            const { firstName } = rev.User
            const { id, review, updatedAt, userId } = rev
            if (user.user) {
                if (userId === user.user.id) {
                    showDeleteButton = (
                        <DeleteReviewButton id={id} />
                    )
                }
            }

            const date = new Date(updatedAt)
            const month = monthNames[date.getMonth()]
            const year = date.getFullYear()
            return (
                <div className='reviewBox' key={id} >
                    <div>{firstName}</div>
                    <div style={{ color: "lightgray" }}>{`${month} ${year}`}</div>
                    <div>{review}</div>
                    <div>{showDeleteButton}</div>
                </div>
            )
        })
    }



    return (
        <>
            <div className="reviewTop">
                <i className="fa-solid fa-star"></i>{showNew}
            </div>
            {showReviews}
        </>
    )
}
