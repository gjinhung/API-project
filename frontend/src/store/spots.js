import { csrfFetch } from "./csrf";

const GET_SPOTS = 'spots/getSpots'
const CREATE_SPOT = 'spots/createSpot'
const ADD_IMAGE = 'spots/addImage'
const GET_CURRENT_SPOTS = 'spots/getCurrentSpots'
const DELETE_SPOTS = 'spots/delete'

const deleteSpots = (spotId) => {
    return {
        type: DELETE_SPOTS,
        spotId
    }
}

const getSpots = (spots) => {
    return {
        type: GET_SPOTS,
        spots
    }
}

const getCurrent = (spots) => {
    return {
        type: GET_CURRENT_SPOTS,
        spots
    }
}

const createSpot = (data) => {
    return {
        type: CREATE_SPOT,
        data
    }
}

const spotImage = ({ data, spotId }) => {
    return {
        type: ADD_IMAGE,
        data,
        spotId
    }
}

export const newImage = ({ spotId, image }) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(image)
    })

    if (response.ok) {
        const data = await response.json()
        dispatch(spotImage({ data, spotId }))
        return data
    }
}

export const newSpot = (spot) => async (dispatch) => {
    const response = await csrfFetch('/api/spots', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spot)
    })

    if (response.ok) {
        const data = await response.json()
        dispatch(createSpot(data))
        return data
    }
}

export const spots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots')
    const data = await response.json()
    dispatch(getSpots(data.Spots))
    return data
}

export const getCurrentSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots/current')
    const data = await response.json()
    dispatch(getCurrent(data.Spots))
    return data
}

export const spotDetails = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`)
    const data = await response.json()
    dispatch(getSpots(data))
    return data
}

export const deleteSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "DELETE"
    })
    const data = await response.json()
    dispatch(deleteSpots(spotId))
    return data
}

const initialState = { spots: null };

const spotsReducer = (state = initialState, action) => {
    let newState = {};
    switch (action.type) {
        case GET_SPOTS:
            newState = action.spots
            return newState;
        case CREATE_SPOT:
            newState = {
                ...state,
                [action.data.id]: action.data
            };
            return newState;
        case ADD_IMAGE:
            return state;
        case GET_CURRENT_SPOTS:
            newState = action.spots
            return newState;
        case DELETE_SPOTS:
            newState = { ...state }
            // const stateArr = Object.values(state.spots)
            // stateArr.map(x => {
            //     if (x.id === action.spotId) {
            //         delete x
            //     }
            // })
            return newState
        default:
            return state
    }
}

export default spotsReducer;