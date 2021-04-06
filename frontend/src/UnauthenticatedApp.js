import React, {useState} from 'react';
import {useAuthDispatch} from './context/AuthContext'
import { loginUser } from './context/UserActions';

function UnauthenticatedApp(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useAuthDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            let response = await loginUser(dispatch, {email, password});
            if(!response.user) return;

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <div className={{ width: 200 }}>
                
                {/* {userDetails.errorMessage ? <p>{userDetails.errorMessage}</p> : null} */}

                <form >
                    <div>
                        <div>
                            <label htmlFor="email">Username</label>
                            <input type="text" id='email' value={email} onChange={(e) => setEmail(e.target.value)} disabled={false} />
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <input type="password" id='password' value={password} onChange={(e) => setPassword(e.target.value)} disabled={false} />
                        </div>
                    </div>
                    <button onClick={handleLogin} disabled={false}>login</button>
                </form>
            </div>
        </div>
    )
}

export default UnauthenticatedApp;