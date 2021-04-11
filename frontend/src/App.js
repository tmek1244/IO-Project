import React from 'react'
import { Suspense } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'

import useStyles from './styles/styles'
const AuthenticatedApp = React.lazy(() => import("./AuthenticatedApp"))
import { useAuthState } from './context/AuthContext'

const AuthenticatedApp = React.lazy(() => import("./AuthenticatedApp"))
const UnauthenticatedApp = React.lazy(() => import("./UnauthenticatedApp"))

const App = () => {
  const classes = useStyles()
  const { access } = useAuthState();


  return (
    <Suspense fallback={<CircularProgress className={classes.circularProgress} />}>
      {access ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </Suspense>
  )
}

export default App;