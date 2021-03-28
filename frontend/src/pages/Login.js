import React, { useState } from 'react';
import { loginUser, useAuthState, useAuthDispatch } from '../Context'
 
 
function Login(props) {
 
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
 
    const dispatch = useAuthDispatch()
    const { loading, errorMessage } = useAuthState() //read the values of loading and errorMessage from context

    const handleLogin = async (e) => {
        e.preventDefault()
 
        try {
            let response = await loginUser(dispatch, { email, password })
            if (!response.user) return
            props.history.push('/dashboard')
        } catch (error) {
            console.log(error)
        }
    }
 
    return (
        <div>
            <div className={{ width: 200 }}>
                <h1>Login Page</h1>
                {
                    errorMessage ? <p>{errorMessage}</p> : null
                }
                <form >
                    <div>
                        <div>
                            <label htmlFor="email">Username</label>
                            <input type="text" id='email' value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <input type="password" id='password' value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
                        </div>
                    </div>
                    <button onClick={handleLogin} disabled={loading}>login</button>
                </form>
            </div>
        </div>
    )
}
 
export default Login