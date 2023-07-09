import { csrfFetch } from "./csrf";

const GET_REVIEWS = 'reviews/getReviews'

const getReviews = (reviews) => {
    return {
        type: GET_REVIEWS,
        reviews
    }
}

export const reviews = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/spots/${spotId}`)
    const data = await response.json()
    dispatch(getReviews(data))
    return data
}

const initialState = { reviews: null };

const reviewsReducer = (state = initialState, action) => {
    let newState = {};
    switch (action.type) {
        case GET_REVIEWS:
            newState = action.reviews
            return newState;
        default:
            return state
    }
}

export default reviewsReducer;