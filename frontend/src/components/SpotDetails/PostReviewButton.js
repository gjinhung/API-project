import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './PostReviewModal.css'
import { useParams } from 'react-router-dom'
import * as reviewActions from "../../store/reviews"
import * as spotActions from "../../store/spots"

export const PostReviewButton = ({ reviews }) => {
    let { spotId } = useParams()
    const dispatch = useDispatch()
    const [modal, setModal] = useState(false);
    const [reviewDes, setReviewDes] = useState('')
    const [star1, setStar1] = useState(false)
    const [star2, setStar2] = useState(false)
    const [star3, setStar3] = useState(false)
    const [star4, setStar4] = useState(false)
    const [star5, setStar5] = useState(false)
    const [reviewButton, setReviewButton] = useState(true)
    const ownerId = useSelector(state => state.spots.ownerId)
    const user = useSelector(state => state.session.user)
    let userId
    if (user) {
        userId = user.id
    }
    const normalizedReviews = Object.values(reviews)

    const toggleModal = () => {
        setModal(!modal)
    }

    if (modal) {
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }

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

    let alreadyReviewed = false
    let show
    if (normalizedReviews[0]) {
        if (normalizedReviews[0].id) {
            normalizedReviews.forEach(review => {

                if (review.User.id === userId) {
                    alreadyReviewed = true
                }
            })
        }
    }

    useEffect(() => {
        if (reviewDes.length >= 10 && star1 === true) {
            setReviewButton(false)
        } else {
            setReviewButton(true)
        }
    }, [reviewDes, star1])

    let reviewModal = (
        <form onSubmit={handleSubmit}>
            <h1>How was your stay?</h1>
            <input
                type="text"
                placeholder="Leave your review here..."
                value={reviewDes}
                onChange={(e) => setReviewDes(e.target.value)}
            />
            <div
                className={star1 ? 'fa-solid fa-star' : "fa-regular fa-star"}
                onClick={(e) => {
                    setStar1(!star1)
                    setStar2(false)
                    setStar3(false)
                    setStar4(false)
                    setStar5(false)
                }
                }
            ></div>
            <div
                className={star2 ? 'fa-solid fa-star' : "fa-regular fa-star"}
                onClick={(e) => {
                    setStar1(!star2)
                    setStar2(!star2)
                    setStar3(false)
                    setStar4(false)
                    setStar5(false)
                }}
            ></div>
            <div
                className={star3 ? 'fa-solid fa-star' : "fa-regular fa-star"}
                onClick={(e) => {
                    setStar1(!star3)
                    setStar2(!star3)
                    setStar3(!star3)
                    setStar4(false)
                    setStar5(false)
                }}
            ></div>
            <div
                className={star4 ? 'fa-solid fa-star' : "fa-regular fa-star"}
                onClick={(e) => {
                    setStar1(!star4)
                    setStar2(!star4)
                    setStar3(!star4)
                    setStar4(!star4)
                    setStar5(false)
                }}
            ></div>
            <div
                className={star5 ? 'fa-solid fa-star' : "fa-regular fa-star"}
                onClick={(e) => {
                    setStar1(!star5)
                    setStar2(!star5)
                    setStar3(!star5)
                    setStar4(!star5)
                    setStar5(!star5)
                }}
            ></div>
            <span> Stars</span>
            <div>
                <button
                    className="review-button"
                    type="submit" disabled={reviewButton}>Submit Your Review</button>
            </div>
        </form>
    )
    if (user) {
        if (!alreadyReviewed && (ownerId !== user.id)) {
            show = (
                <>
                    <button onClick={toggleModal} className="linkText">Post Your Review</button>

                    <div>Be the first to post a review!</div>
                    {modal && (
                        <div className="modal">
                            <div onClick={toggleModal} className="overlay"></div>
                            <div className="modal-content">
                                {reviewModal}
                            </div>
                        </div>
                    )}
                </>
            )
        }
    }


    return (
        <>
            {show}</>

    )
}
