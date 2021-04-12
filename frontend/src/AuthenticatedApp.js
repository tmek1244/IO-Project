import React from 'react'
import AddDataPanel from './pages/AddData/AddDataPanel'
import AddNewUserPanel from './components/Admin/AddNewUserPanel'
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
import Dashboard from './pages/Dashboard/Dashboard'
import TableRaportPanel from './pages/TableRaport/TableRaportPanel'
import { useAuthState } from './context/AuthContext'


const AuthenticatedApp = () => {
    const classes = useStyles()
    const isSidebarOpened = useLayoutState()
    const authState = useAuthState()

    return (
        <Router>
            <div className={classes.root}>

                <Header />
                <Sidebar />
                <div className={classNames(classes.content, {
                    [classes.contentShift]: isSidebarOpened
                })}>


                    <Switch>
                        <Route exact path='/podsumowanie'>
                            <TableRaportPanel />
                        </Route>
                        <Route exact path='/dodajdane'>
                            <AddDataPanel />
                        </Route>
                        {
                            authState.is_staff &&
                            <Route exact path='/rejestracja'>
                                <AddNewUserPanel />
                            </Route>
                        }
                        <Route path='/'>
                            <Dashboard />
                        </Route>

                    </Switch>
                </div>

            </div>

        </Router>

    );
}

export default AuthenticatedApp;
