import React from 'react';
import { logout, useAuthState, useAuthDispatch } from '../Context'

export default function Dashboard() {
  const dispatch = useAuthDispatch();
	const userDetails = useAuthState();

	const handleLogout = () => {
		logout(dispatch);
	};


  return(
    <div>
        <h2>This will be our main windows after logging in</h2>
        <button onClick={handleLogout}>Logout</button>
    </div>
  );
}