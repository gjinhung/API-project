import { csrfFetch } from "./csrf";

const GET_REVIEWS = 'reviews/getReviews'
const NEW_REVIEW = 'reviews/newReview'
const DELETE_REVIEW = 'reviews/deleteReview'

const getReviews = (reviews) => {
    return {
        type: GET_REVIEWS,
        reviews
    }
}

const createReviews = ({ data, userData }) => {
    return {
        type: NEW_REVIEW,
        data,
        userData
    }
}

const deleteReview = (reviewId) => {
    return {
        type: DELETE_REVIEW,
        reviewId
    }
}

export const reviews = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/spots/${spotId}`)
    const data = await response.json()
    dispatch(getReviews(data))
    return data
}

export const createReview = ({ spotId, reviewData, userData }) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/spots/${spotId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData)
    })

    if (response.ok) {
        const data = await response.json()
        dispatch(createReviews({ data, userData }))
        return data
    }
}

export const deleteReviews = (reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "DELETE"
    })
    if (response.ok) {
        const data = await response.json()
        dispatch(deleteReview(reviewId))
        return data
    }
}

const initialState = { reviews: null };

const reviewsReducer = (state = initialState, action) => {
    let newState = {};
    switch (action.type) {
        case GET_REVIEWS:
            newState = action.reviews
            return newState;
        case NEW_REVIEW:
            action.data.User = action.userData
            newState = {
                ...state,
                [action.data.id]: action.data
            }
            return newState;
        case DELETE_REVIEW:
            newState = { ...state }
            return newState
        default:
            return state
    }
}

export default reviewsReducer;