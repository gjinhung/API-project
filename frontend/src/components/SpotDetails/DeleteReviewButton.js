import React, { useState } from 'react';
import "./DeleteReviewModal.css"
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import * as reviewActions from '../../store/reviews'
import * as spotActions from '../../store/spots'

export const DeleteReviewButton = ({ id }) => {
    let { spotId } = useParams()
    const dispatch = useDispatch()
    const [deleteModal, setDeleteModal] = useState(false);

    const toggleModal = () => {
        setDeleteModal(!deleteModal)
    }

    const deleteReview = async () => {
        await dispatch(reviewActions.deleteReviews(id))
        await dispatch(spotActions.spots())
        await dispatch(spotActions.spotDetails(spotId))
        await toggleModal()
    }

    let showConfirmDelete = (
        <>
            <h1>Confirm Delete</h1>
            <h3>Are you sure you want to delete this review?</h3>
            <button onClick={deleteReview} className='deleteButtonYes'>{`Yes (Delete Review)`}</button>
            <button onClick={toggleModal} className='deleteButtonNo'>{`No (Keep Review)`}</button>

        </>
    )

    if (deleteModal) {
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }

    return (
        <>
            <nav onClick={toggleModal} className="delete-review-button">Delete</nav>
            {deleteModal && (
                <div className="modal">
                    <div onClick={toggleModal} className="overlay"></div>
                    <div className="modal-content">
                        {showConfirmDelete}
                    </div>
                </div>
            )}
        </>
    )
}
