import {useAuthState, useAuthDispatch} from './AuthContext';

const ROOT_URL = '/api/user';

export async function loginUser(dispatch, payload) {
    try {

        dispatch({type: 'REQUEST_LOGIN'});
        let response = await fetch(`${ROOT_URL}/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
		    body: JSON.stringify(payload),
        });
        let result = await response.json();

        const password = payload.password
        const data = {...result, password};

        if(data.access) {
            dispatch({type: 'LOGIN_SUCCESS', payload: data});
            //localStorage.setItem('currentUser', JSON.stringify(data));
			return data;
        }

        dispatch({ type: 'LOGIN_ERROR', error: data.errors[0] });
        console.log(data.errors[0]);
        return;
    } catch (error) {
        dispatch({ type: 'LOGIN_ERROR', error: error });
        console.log(error);
    }
}

export async function logoutUser(dispatch) {
    dispatch({type: 'LOGOUT'});
    //localStorage.removeItem('currentUser');
    //localStorage.removeItem('token');
}

export async function getAccessToken(dispatch, authState) { //TODO: is dispatch required?
    const username = authState.username;
    const password = authState.password;

    try {
        let response = await fetch(`${ROOT_URL}/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
		    body: JSON.stringify({username, password}),
        });
        let data = await response.json();

        if(data.access) {
			return data.access;
        }

        dispatch({ type: 'LOGIN_ERROR', error: data.errors[0] });
        console.log(data.errors[0]);
        return;
    } catch (error) {
        dispatch({ type: 'LOGIN_ERROR', error: error });
        console.log(error);
    }
}