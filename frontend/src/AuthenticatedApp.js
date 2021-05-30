import React from 'react'
import AddDataPanel from './pages/AddData/AddDataPanel'
import AdminPanel from './components/Admin/AdminPanel'
import ChangePasswordPanel from './pages/ChangePassword/ChangePasswordPanel'
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
import UniversityAnalysis from './pages/UniversityAnalysis/UniversityAnalysis'
import { useAuthState } from './context/AuthContext'
import FacultyAnalysis from './pages/FacultyAnalysis/FacultyAnalysis'
import FieldOfStudyAnalysis from './pages/FieldOfStudyAnalysis/FieldOfStudyAnalysis'
import SpecificYearFieldAnalysis from './pages/SpecificYearFieldAnalysis/SpecificYearFieldAnalysis'


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
                            <UniversityAnalysis />
                        </Route>
                        <Route exact path='/dodajdane'>
                            <AddDataPanel />
                        </Route>
                        <Route exact path='/haslo'>
                            <ChangePasswordPanel />
                        </Route>
                        <Route exact path='/podsumowanie_wydzial'>
                            <FacultyAnalysis />
                        </Route>
                        <Route exact path='/podsumowanie_kierunek'>
                            <FieldOfStudyAnalysis />
                        </Route>
                        <Route exact path='/podsumowanie_roku'>
                            <SpecificYearFieldAnalysis />
                        </Route>
                        {
                            authState.is_staff &&
                            <Route exact path='/administracja'>
                                <AdminPanel />
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
