import React from 'react'
import {initialState, AuthReducer} from './UserReducer';

const UserContext = React.createContext()
const DispatchContext = React.createContext()

export function AuthProvider({children}) {
    const [userData, dispatch] = React.useReducer(AuthReducer, initialState);

    return (
        <UserContext.Provider value={userData}>
            <DispatchContext.Provider value={dispatch}>
                {children}
            </DispatchContext.Provider>
        </UserContext.Provider>
    )
}

export function useAuthState() {
    const context = React.useContext(UserContext)
    if(context === undefined) {
        throw new Error('useAuthState must be used inside UserContext');
    }
    return context
}

export function useAuthDispatch() {
    const context = React.useContext(DispatchContext)
    if(context === undefined) {
        throw new Error('useAuthDispatch must be used inside DispatchContext');
    }
    return context
}