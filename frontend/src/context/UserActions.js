const ROOT_URL = '/api/user';

export async function loginUser(dispatch, payload) {
    try {
        dispatch({type: 'REQUEST_LOGIN'});
        let response = await fetch(`${ROOT_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
		    body: JSON.stringify(payload),
        });
        let data = await response.json();

        if(data.user) {
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

export async function logout(dispatch) {
    dispatch({type: 'LOGOUT'});
    //localStorage.removeItem('currentUser');
    //localStorage.removeItem('token');
}