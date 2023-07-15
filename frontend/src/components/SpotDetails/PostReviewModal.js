import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import * as reviewActions from "../../store/reviews"
import * as spotActions from "../../store/spots"

export const PostReviewModal = ({ user, spotId, name }) => {
    const [reviewDes, setReviewDes] = useState('')
    const dispatch = useDispatch()
    const [star1, setStar1] = useState(false)
    const [star2, setStar2] = useState(false)
    const [star3, setStar3] = useState(false)
    const [star4, setStar4] = useState(false)
    const [star5, setStar5] = useState(false)
    const [reviewButton, setReviewButton] = useState(true)

    const handleSubmit = async (e) => {
        e.preventDefault();

        let stars
        if (star5 === true) { stars = 5 }
        else if (star4 === true) { stars = 4 }
        else if (star3 === true) { stars = 3 }
        else if (star2 === true) { stars = 2 }
        else if (star1 === true) { stars = 1 }

        const reviewData = {
            review: reviewDes,
            stars
        }

        let userData = user
        await dispatch(reviewActions.createReview({ spotId, reviewData, userData }))
        await dispatch(spotActions.spots())
        await dispatch(spotActions.spotDetails(spotId))
    }

    useEffect(() => {
        if (reviewDes.length >= 10 && star1 === true) {
            setReviewButton(false)
        } else {
            setReviewButton(true)
        }
    }, [reviewDes, star1])
    return (

        <form onSubmit={handleSubmit}>
            <div className='modal-title-container'>
                <p className='modal-title'>How was your stay?</p>
            </div>
            <div className='text-container'>
                <textarea
                    name="text"
                    rows={5}
                    cols={40}
                    placeholder="Leave your review here..."
                    value={reviewDes}
                    onChange={(e) => setReviewDes(e.target.value)}
                >
                </textarea>
            </div>
            <div className='star-container'>
                <div
                    className={star1 ? 'fa-solid fa-star' : "fa-regular fa-star"}
                    onMouseEnter={() => {
                        setStar1(true)
                        setStar2(false)
                        setStar3(false)
                        setStar4(false)
                        setStar5(false)
                    }}
                    onClick={(e) => {
                        setStar1(star1)
                        setStar2(star2)
                        setStar3(star3)
                        setStar4(star4)
                        setStar5(star5)
                    }
                    }
                ></div>
                <div
                    className={star2 ? 'fa-solid fa-star' : "fa-regular fa-star"}
                    onMouseEnter={() => {
                        setStar1(true)
                        setStar2(true)
                        setStar3(false)
                        setStar4(false)
                        setStar5(false)
                    }}
                    onClick={(e) => {
                        setStar1(star1)
                        setStar2(star2)
                        setStar3(star3)
                        setStar4(star4)
                        setStar5(star5)
                    }}
                ></div>
                <div
                    className={star3 ? 'fa-solid fa-star' : "fa-regular fa-star"}
                    onMouseEnter={() => {
                        setStar1(true)
                        setStar2(true)
                        setStar3(true)
                        setStar4(false)
                        setStar5(false)
                    }}
                    onClick={(e) => {
                        setStar1(star1)
                        setStar2(star2)
                        setStar3(star3)
                        setStar4(star4)
                        setStar5(star5)
                    }}
                ></div>
                <div
                    className={star4 ? 'fa-solid fa-star' : "fa-regular fa-star"}
                    onMouseEnter={() => {
                        setStar1(true)
                        setStar2(true)
                        setStar3(true)
                        setStar4(true)
                        setStar5(false)
                    }}
                    onClick={(e) => {
                        setStar1(star1)
                        setStar2(star2)
                        setStar3(star3)
                        setStar4(star4)
                        setStar5(star5)
                    }}
                ></div>
                <div
                    className={star5 ? 'fa-solid fa-star' : "fa-regular fa-star"}
                    onMouseEnter={() => {
                        setStar1(true)
                        setStar2(true)
                        setStar3(true)
                        setStar4(true)
                        setStar5(true)
                    }}
                    onClick={(e) => {
                        setStar1(star1)
                        setStar2(star2)
                        setStar3(star3)
                        setStar4(star4)
                        setStar5(star5)
                    }}
                ></div>
                <span style={{ paddingTop: 5 }}> Stars</span>
            </div>
            <div className='review-button-container'>
                <button
                    className="review-button"
                    type="submit" disabled={reviewButton}>Submit Your Review</button>
            </div>
        </form >
    )

}
