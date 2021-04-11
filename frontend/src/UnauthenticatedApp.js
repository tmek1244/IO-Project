import React from 'react';
import { Grid } from '@material-ui/core'

import LoginPanel from './components/login/LoginPanel'
import Header from './components/Header'

import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";


const UnauthenticatedApp = () => {
    return (
        <Router>
            <Grid container direction='column'>
                <Grid item>
                    <Header />
                </Grid>
                <Switch>
                    <Route path='/'>
                        <LoginPanel />
                    </Route>

                </Switch>
            </Grid>

            
        </Router>
    )
}

export default UnauthenticatedApp;