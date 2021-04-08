import React from 'react'
import { Suspense } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'

import {AuthProvider, useAuthState} from './context/AuthContext'

const AuthenticatedApp = React.lazy(() => import("./AuthenticatedApp"))
const UnauthenticatedApp = React.lazy(() => import("./UnauthenticatedApp"))

const App = () => {
  return (
    <Suspense fallback={<CircularProgress />}>
      <AuthProvider>
        <Home />
      </AuthProvider>
    </Suspense>
  )
}

const Home = () => {
  const user = useAuthState();

  let debugMode = false;
  const debugPage = <AuthenticatedApp />;
  if(debugMode) return debugPage;

  return user.access ? <AuthenticatedApp /> : <UnauthenticatedApp /> 
}

export default App;