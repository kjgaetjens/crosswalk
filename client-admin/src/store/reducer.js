const initialState = {
    isAuthenticated: false
}

const reducer = (state = initialState, action) => {

    switch(action.type) {
        case 'ON_AUTHENTICATE':
            return {
                ...state,
                isAuthenticated: action.token ? true : false
            }
        case 'SIGN_OUT':
            return {
                ...state,
                isAuthenticated: false
            }
    }

    return state
}

export default reducer