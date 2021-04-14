import React from 'react';
import { Grid } from '@material-ui/core'

import LoginPanel from './components/login/LoginPanel'

import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";


const UnauthenticatedApp = () => {
    return (
        <LoginPanel />
    )
}

export default UnauthenticatedApp;