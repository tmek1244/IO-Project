//import './App.css';
import React, { useEffect, useState } from 'react'
import { AuthProvider, useAuthState } from './Context'
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';


import { loginUser, useAuthDispatch } from './Context'


const App = () => {
  const [state, setState] = useState('')
  
  useEffect(() => {
    fetch('/api').then(res => res.json())
    .then(data => setState(data['status']))
  })

  

  return (
    <AuthProvider>
      <h1>{state}</h1>
      <Login />
      {/* <Home /> */}
    </AuthProvider>
  );
}

// function Home() {
//   const {user} = useAuthState()
//   return user.token ? <Dashboard /> : <Login />
// }

export default App;
