//import './App.css';
import React, { useEffect, useState } from 'react'
import { AuthProvider, useAuthState } from './Context'
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';


const App = () => {
//   const [state, setState] = useState('')
  
//   useEffect(() => {
//     fetch('/api').then(res => res.json())
//     .then(data => setState(data['status']))
//   })
  

  return (
    <AuthProvider>
      <Home />
    </AuthProvider>
  );
}

function Home() {
  const {user} = useAuthState()
  return user ? <Dashboard /> : <Login />
}

export default App;
