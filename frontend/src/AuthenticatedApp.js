import React from 'react'
import { Grid } from '@material-ui/core'
import AddNewUserPanel from './components/admin/AddNewUserPanel'
import Header from './components/Header'




const AuthenticatedApp = () => {

    return (
        <Grid container direction='column'>
            <Grid item>
                <Header />
            </Grid>
            <Grid item container>
                <Grid item xs={false} sm={2} />
                <Grid item xs={12} sm={8}>
                    <AddNewUserPanel />
                </Grid>
                <Grid item xs={false} sm={2} />
            </Grid>
        </Grid>
    );
}

export default AuthenticatedApp;
