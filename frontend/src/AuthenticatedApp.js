import React from 'react'
import { Grid } from '@material-ui/core'
import AddNewUserPanel from './components/admin/AddNewUserPanel'
import AddDataPanel from './components/AddDataPanel'
import MainPanel from './components/MainPanel'
import Header from './components/Header'
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";



const AuthenticatedApp = () => {

    return (
        <Router>
            <Grid container direction='column'>
                <Grid item>
                    <Header />
                </Grid>
                <Switch>
                    <Route exact path='/rejestracja'>
                        <AddNewUserPanel />
                    </Route>
                    <Route exact path='/dodajdane'>
                        <AddDataPanel />
                    </Route>
                    <Route path='/'>
                        <MainPanel />
                    </Route>

                </Switch>
            </Grid>
        </Router>

    );
}

export default AuthenticatedApp;
