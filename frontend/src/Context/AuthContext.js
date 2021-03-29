import React, { useReducer } from "react";
import { initialState, AuthReducer } from './reducer';
 
const AuthStateContext = React.createContext();
const AuthDispatchContext = React.createContext();

export function useAuthState() {
  const context = React.useContext(AuthStateContext);
  if (context === undefined) {
		throw new Error('useAuthState must be used within a AuthProvider');
  }
 
  return context;
}
 
export function useAuthDispatch() {
  const context = React.useContext(AuthDispatchContext);
  if (context === undefined) {
		throw new Error('useAuthDispatch must be used within a AuthProvider');
  }
 
  return context;
}

export const AuthProvider = ({ children }) => {
  const [user, dispatch] = useReducer(AuthReducer, initialState);
  return (
    <AuthStateContext.Provider value={user}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};

// const sleep = time => new Promise(resolve => setTimeout(resolve, time))
// const getUser = () => sleep(1000)//.then(() => ({email: "c@h.com", name: "henio", surname: "shss", isAdmin: "false"}))

// export function useAuthState() {
//   const state = React.useContext(AuthStateContext)
//   const isPending = state.status === 'pending'
//   const isError = state.status === 'error'
//   const isSuccess = state.status === 'success'
//   const isAuthenticated = state.user && isSuccess
//   return {
//     ...state,
//     isPending,
//     isError,
//     isSuccess,
//     isAuthenticated,
//   }
// }

// export function AuthProvider({children}) {
//   const [state, setState] = React.useState({
//     status: 'pending',
//     error: null,
//     user: null,
//   })
//   React.useEffect(() => {
//     getUser().then(
//       user => setState({status: 'success', error: null, user}),
//       error => setState({status: 'error', error, user: null}),
//     )
//   }, [])

//   return (
//     <AuthStateContext.Provider value={state}>
//       {state.status === 'pending' ? (
//         'Loading...'
//       ) : state.status === 'error' ? (
//         <div>
//           Oh no
//           <div>
//             <pre>{state.error.message}</pre>
//           </div>
//         </div>
//       ) : (
//         children
//       )}
//     </AuthStateContext.Provider>
//   )
// }


