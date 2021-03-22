import './App.css';
import React, { useEffect, useState } from 'react'
const App = () => {
  const [state, setState] = useState('')
  
  useEffect(() => {
    fetch('/api').then(res => res.json())
    .then(data => setState(data['status']))
  })
  
  
  return (
    <p>{state}</p>
  );
}

export default App;
