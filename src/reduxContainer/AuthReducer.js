const initialState = {
    isAuth : false,
    user: [],
    isAdmin: false
}

export const AuthReducer = (state=initialState, action) => {
  console.log("Action: "  + action.type)

  switch(action.type) {
    case 'LOGIN_USER': return {
        ...state,
        isAuth: true,
        user: [...state.user, action.payload]
    }
    case 'LOGIN_ADMIN': return {
        ...state,
        isAdmin: true,
        user: [...state.user, action.payload]
    }
    default: return state
  }
}