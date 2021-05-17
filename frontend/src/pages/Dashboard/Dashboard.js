import React from 'react'
import { Grid } from '@material-ui/core';
import PageTitle from '../../components/PageTitle/PageTitle';
import PopularityChart from './Charts/PopularityChart';
import LaureateChart from './Charts/LaureateChart'
import ThresholdChart from './Charts/ThresholdChart'
import Spinner from '../../components/Spinner/Spinner'
import Error from '../../components/Error/Error'
import useFetch from '../../hooks/useFetch'


const Dashboard = () => {

    const [years, loading, error] = useFetch('/api/backend/available-years/', [], json => json.sort((a, b) => b - a)) //sortowaine tablicy w porządku malejącym

    const number = 5
    const modeMost = "most"
    const modeLeast = "least"

    return (
        <>
            <PageTitle title={`Dashboard ${years[0]}`} />
            {
                loading ?
                    <Spinner />
                    :
                    (
                        error ?
                            <Error />
                            :
                            <Grid item container spacing={2}>
                                <Grid item xs={12} sm={6} >
                                    <PopularityChart degree={1} year={years[0]} number={number} mode={modeMost} />
                                </Grid>
                                <Grid item xs={12} sm={6} >
                                    <PopularityChart degree={1} year={years[0]} number={number} mode={modeLeast} />
                                </Grid>
                                <Grid item xs={12} sm={6} >
                                    <ThresholdChart degree={1} year={years[0]} number={number} mode={modeMost} />
                                </Grid>
                                <Grid item xs={12} sm={6} >
                                    <ThresholdChart degree={1} year={years[0]} number={number} mode={modeLeast} />
                                </Grid>
                                <Grid item xs={12}  >
                                    <LaureateChart year={years[0]} number={number} />
                                </Grid>
                                <Grid item xs={12} sm={6} >
                                    <PopularityChart degree={2} year={years[0]} number={number} mode={modeMost} />
                                </Grid>
                                <Grid item xs={12} sm={6} >
                                    <PopularityChart degree={2} year={years[0]} number={number} mode={modeLeast} />
                                </Grid>
                                <Grid item xs={12} sm={6} >
                                    <ThresholdChart degree={2} year={years[0]} number={number} mode={modeMost} />
                                </Grid>
                                <Grid item xs={12} sm={6} >
                                    <ThresholdChart degree={2} year={years[0]} number={number} mode={modeLeast} />
                                </Grid>
                            </Grid>
                    )
            }
        </>
    )
}

export default Dashboard