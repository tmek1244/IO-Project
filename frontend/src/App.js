import React from 'react'
import { Suspense } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'

import useStyles from './styles/styles'
const AuthenticatedApp = React.lazy(() => import("./AuthenticatedApp"))


const App = () => {
  const classes = useStyles()


  return (

    <Suspense fallback={<CircularProgress className={classes.circularProgress} />}>
      <AuthenticatedApp />
    </Suspense>

  )

}

export default App;
