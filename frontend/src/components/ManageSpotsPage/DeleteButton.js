import React, { useState } from 'react';
import "./DeleteModal.css"
import { useDispatch } from 'react-redux';
import * as spotActions from '../../store/spots'

export const DeleteButton = ({ spotId }) => {
    const dispatch = useDispatch()
    const [deleteModal, setDeleteModal] = useState(false);

    const toggleModal = () => {
        setDeleteModal(!deleteModal)
    }

    const deleteSpot = async () => {
        await dispatch(spotActions.deleteSpot(spotId))
        await toggleModal()
        await window.location.reload(false);
    }

    let showConfirmDelete = (
        <>
            <h1>Confirm Delete</h1>
            <h3>Are you sure you want to remove this spot from the listings?</h3>
            <button onClick={deleteSpot} className='deleteButtonYes'>{`Yes (Delete Spot)`}</button>
            <button onClick={toggleModal} className='deleteButtonNo'>{`No (Keep Spot)`}</button>

        </>
    )

    if (deleteModal) {
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }

    return (
        <>
            <button onClick={toggleModal} className="deleteButton">Delete</button>
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
