import React, { useState } from 'react';
import AuthContext from './AuthContext';

const AuthState = (props) => {
    // localStorage.clear()
    let initialState = localStorage.getItem('user') ? {isAuth : true, user : JSON.parse(localStorage.getItem('user'))} : {isAuth : true, user : null};

    const [user, setUser] = useState(initialState)

    return <AuthContext.Provider value={{user, setUser}}>{props.children}</AuthContext.Provider>
}

export default AuthState;