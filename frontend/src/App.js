import React from 'react'
import { Suspense } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'

const AuthenticatedApp = React.lazy(() => import("./AuthenticatedApp"))


const App = () => {
  
  return (
    
    <Suspense fallback={<CircularProgress />}>
      <AuthenticatedApp />
    </Suspense>

  )
  
}

export default App;
