let access = localStorage.getItem('currentUser')
	? JSON.parse(localStorage.getItem('currentUser')).access
	: '';
let refresh = localStorage.getItem('currentUser')
    ? JSON.parse(localStorage.getItem('currentUser')).refresh
    : '';
let username = localStorage.getItem('currentUser')
	? JSON.parse(localStorage.getItem('currentUser')).username
	: '';
let is_staff = localStorage.getItem('currentUser')
	? JSON.parse(localStorage.getItem('currentUser')).is_staff
	: '';

export const initialState = {
    access: '' || access,
    refresh: '' || refresh,
    username: '' || username,
    is_staff:false || is_staff,

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
            refresh: action.payload.refresh,
            username: action.payload.username,
            is_staff: action.payload.is_staff,

            loading: false,
        }
    case 'LOGOUT':
        return {
            ...initialState,
            access: '',
            refresh: '',
            username: '',
            is_staff:false,
        }
    case 'LOGIN_ERROR':
        return {
            ...initialState,
            loading: false,
            errorMessage: action.error,
        }
    case 'REFRESH_SUCCESS':
        return {
            ...initialState,
            access: action.payload.acccess,
        }
    default:
        throw new Error('Unexpected action type.');
    }
};