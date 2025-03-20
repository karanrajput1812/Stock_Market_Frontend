export const login_User = (userDetails) => {
    console.log("User Login Action Called");
    return {
        type: "LOGIN_USER",
        payload: userDetails
    }
}

export const logout_User = () => {
    console.log("User Logout Action Called");
    return {
        type: "LOGOUT_USER"
    }
}

export const login_Admin = (adminDetails) => {
    console.log("Admin Login Action Called");
    return {
        type: "LOGIN_ADMIN",
        payload: adminDetails
    }
}