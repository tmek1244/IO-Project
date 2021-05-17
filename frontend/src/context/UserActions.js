const ROOT_URL = '/api/user';

export async function loginUser(dispatch, payload) {
    try {

        dispatch({type: 'REQUEST_LOGIN'});
        let response = await fetch(`${ROOT_URL}/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
		    body: JSON.stringify(payload),
        });
        let data = await response.json();


        if(data.access) {
            dispatch({type: 'LOGIN_SUCCESS', payload: data});
            localStorage.setItem('currentUser', JSON.stringify(data));
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
    localStorage.removeItem('currentUser');
    //TODO: add send info to server about logging out
}

export async function refreshAccess(dispatch, authState) {
    const refresh = authState.refresh;
    try {
        let response = await fetch(`${ROOT_URL}/login/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
		    body: JSON.stringify({refresh}),
        });
        let data = await response.json();

        if(data.access) {
			dispatch({type: 'REFRESH_SUCCESS', payload: data});
            localStorage.setItem('currentUser', JSON.stringify(data));
			return data.access;
        }
        //For now if we don't refresh access token user gets immediately logged out to be able to refresh it by relogging in.

        dispatch({type: 'LOGOUT'});
        localStorage.removeItem('currentUser');
        return;
    } catch (error) {
        dispatch({type: 'LOGOUT'});
        localStorage.removeItem('currentUser');
        console.log(error);
    }
}