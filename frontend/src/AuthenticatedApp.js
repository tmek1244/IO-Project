import React from 'react'
import { Grid } from '@material-ui/core'
<<<<<<< HEAD
import AddNewUserPanel from './components/admin/AddNewUserPanel'
import AddDataPanel from './components/AddDataPanel'
=======
import AddNewUserPanel from './components/Admin/AddNewUserPanel'
>>>>>>> CHA-15 poprawki w layoutcie
import MainPanel from './components/MainPanel'
import Header from './components/Header/Header'
import Sidebar from './components/Sidebar/Sidebar'

import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import useStyles from './styles/styles'
import classNames from 'classnames'

import { useLayoutState } from './context/LayoutContext'


const AuthenticatedApp = () => {
    const classes = useStyles()
    const isSidebarOpened = useLayoutState()

    return (
        <Router>
            <div className={classes.root}>

                <Header />
                <Sidebar />
                <div className={classNames(classes.content, {
                    [classes.contentShift]: isSidebarOpened
                })}>


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
                </div>

            </div>

        </Router>

    );
}

export default AuthenticatedApp;
