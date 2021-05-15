import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Grid, Card, CardContent, CardHeader, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import PageTitle from '../../components/PageTitle/PageTitle';
import PopularityChart from './Charts/PopularityChart';

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
}));

const Dashboard = () => {
    const classes = useStyles()

    //const [years, loading, _error] = useFetch('/api/backend/available-years/', [], json => json.sort((a, b) => b - a)) //sortowaine tablicy w porządku malejącym

    const years = [2020, 2019]
    const number = 5
    const modeMost = "most"
    const modeLeast = "least"

    return (
        <>
            <PageTitle title="Dashboard" />
            <Grid item container spacing={2}>
                <Grid item xs={12} sm={6} >
                    <PopularityChart degree={1} year={years[0]} number={number} mode={modeMost} />
                </Grid>
                <Grid item xs={12} sm={6} >
                    <PopularityChart degree={1} year={years[0]} number={number} mode={modeLeast} />
                </Grid>
                <Grid item xs={12} sm={6} >
                    <PopularityChart degree={2} year={years[0]} number={number} mode={modeMost} />
                </Grid>
                <Grid item xs={12} sm={6} >
                    <PopularityChart degree={2} year={years[0]} number={number} mode={modeLeast} />
                </Grid>
            </Grid>
        </>
    )
}

export default Dashboard