import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import './PostReviewModal.css'
import { useParams } from 'react-router-dom'
import { PostReviewModal } from './PostReviewModal'

export const PostReviewButton = ({ reviews, name }) => {
    let { spotId } = useParams()

    const [modal, setModal] = useState(false);

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



    if (user) {
        if (!alreadyReviewed && (ownerId !== user.id)) {
            show = (
                <>
                    <button onClick={toggleModal} className="postButton">Post Your Review</button>

                    <div>Be the first to post a review!</div>
                    {modal && (
                        <div className="modal">
                            <div onClick={toggleModal} className="overlay"></div>
                            <div className='modal-container'>
                                <div className="modal-content">
                                    <PostReviewModal
                                        user={user}
                                        spotId={spotId}
                                        name={name} />
                                </div>
                            </div>
                        // </div >
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
