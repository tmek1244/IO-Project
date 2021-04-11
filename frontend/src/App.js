import React from 'react'
import { Suspense } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'

import { useAuthState} from './context/AuthContext'

const AuthenticatedApp = React.lazy(() => import("./AuthenticatedApp"))
const UnauthenticatedApp = React.lazy(() => import("./UnauthenticatedApp"))

const App = () => {
  const { access } = useAuthState();
  return (
    <Suspense fallback={<CircularProgress />}>
        {access ? <AuthenticatedApp /> : <UnauthenticatedApp /> }
    </Suspense>
  )
}

export default App;