import React from 'react';

import { Grid } from '@material-ui/core';
import PageTitle from '../PageTitle/PageTitle'
import AddNewUserPanel from './AddNewUserPanel'
import AddParameters from './AddParameters';

export default function AdminPanel() {

    return (
        <>
            <PageTitle title="Administracja" />
            <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                    <AddNewUserPanel />
                </Grid>
                <Grid item xs={12} md={4}>
                    <AddParameters />
                </Grid>
            </Grid>
        </>
    )
}
