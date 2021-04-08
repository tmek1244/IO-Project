import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Grid, Card, CardContent, CardHeader, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import VerticalBar from '../demos/VerticalBar'

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
}));

const MainPanel = () => {
    const classes = useStyles()

    return (
        <Grid item container>
            <Grid item xs={false} sm={2} />
            <Grid item xs={12} sm={4} className={classes.margin}>
                <Link to='/rejestracja' style={{ 'textDecoration': 'none' }}>
                    <Card >
                        <CardHeader
                            title={<Typography variant='h5'> Wprowadź dane użytkownika </Typography>}
                        />
                        <CardContent>
                            Kliknij aby przejść do panelu dodawania użytkownika
                        </CardContent>
                    </Card>
                </Link>

            </Grid>
            <Grid item xs={12} sm={4} className={classes.margin}>
                <Link to='/' style={{ 'textDecoration': 'none' }}>
                    <Card >
                        <CardHeader
                            title={<Typography variant='h5'> Tu kiedyś będzie skrót danych z jednej statyski  </Typography>}
                        />
                        <CardContent>
                            <VerticalBar />
                        </CardContent>
                    </Card>
                </Link>

            </Grid>
            <Grid item xs={false} sm={2} />
        </Grid>

    )
}

export default MainPanel