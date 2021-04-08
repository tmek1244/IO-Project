//import React, {useState, useReducer} from 'react';

// let user = localStorage.getItem('currentUser')
// 	? JSON.parse(localStorage.getItem('currentUser')).user
// 	: '';
// let token = localStorage.getItem('currentUser')
// 	? JSON.parse(localStorage.getItem('currentUser')).auth_token
// 	: '';

// export const initialState = {
//     user: '', // || user
//     token: '', // || token
//     loading: false,
//     errorMessage: null,
// };
export const initialState = {
    access: '',
    username: '', // || user
    password: '',
    is_staff:false,

    loading: false,
    errorMessage: null,
};

export const AuthReducer = (initialState, action) => {
    switch(action.type) {
    case 'REQUEST_LOGIN':
        return {
            ...initialState,
            loading: true,
        };
    case 'LOGIN_SUCCESS':
        return {
            ...initialState,
            access: action.payload.access,
            username: action.payload.username,
            password: action.payload.password,
            is_staff: action.payload.is_staff,

            loading: false,
        }
    case 'LOGOUT':
        return {
            ...initialState,
            access: '',
            username: '',
            password: '',
            is_staff:false,
        }
    case 'LOGIN_ERROR':
        return {
            ...initialState,
            loading: false,
            errorMessage: action.error,
        }
    default:
        throw new Error('Unexpected action type.');
    }
};