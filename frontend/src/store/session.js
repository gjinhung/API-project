import { csrfFetch } from "./csrf";

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

const setUser = (user) => {
    return {
        type: SET_USER,
        payload: user,
    };
};

const removeUser = () => {
    return {
        type: REMOVE_USER,
    };
};

export const login = (user) => async (dispatch) => {
    const response = await csrfFetch("/api/session", {
        method: "POST",
        body: JSON.stringify(user),
    });
    const data = await response.json();
    dispatch(setUser(data));
    return data;
};

export const logout = () => async (dispatch) => {
    const response = await csrfFetch('/api/session', {
        method: 'DELETE',
    });
    dispatch(removeUser());
    return response;
};

export const restoreUser = () => async (dispatch) => {
    const response = await csrfFetch("/api/session");
    const data = await response.json();
    dispatch(setUser(data));
    return response;
};

export const signup = (user) => async dispatch => {
    const response = await csrfFetch("/api/users", {
        method: "POST",
        body: JSON.stringify(user)
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(setUser(data));
        return data;
    } else {
        const errors = await response.json();
        return errors;
    }
}


const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case SET_USER:
            newState = Object.assign({}, state);
            if (!action.payload.user) {
                newState.user = null
            } else {
                newState.user = action.payload.user;
            }
            return newState;
        case REMOVE_USER:
            removeUser()
            newState = Object.assign({}, state);
            newState.user = null;
            return newState;
        default:
            return state;
    }
};

export default sessionReducer;