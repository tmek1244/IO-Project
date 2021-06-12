import React, { useState } from 'react'
import { Grid, Divider, Typography, Button } from '@material-ui/core';
import PageTitle from '../../components/PageTitle/PageTitle';
import PopularityChart from './Charts/PopularityChart';
import LaureateChart from './Charts/LaureateChart'
import ThresholdChart from './Charts/ThresholdChart'
import Spinner from '../../components/Spinner/Spinner'
import Error from '../../components/Error/Error'
import useFetch from '../../hooks/useFetch'

import Pdf from "react-to-pdf";
import { mergeClasses, makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    pageTitleContainer: {
      display: "flex",
      justifyContent: "center",
    },
    formContainer: {
      marginTop: theme.spacing(10),
      display: "flex",
    },
    facultySelector: {
      minWidth: "100px",
      marginRight: "5px"
    },
    text: {
      color: theme.palette.text.hint,
    },
    margin: {
      marginTop: theme.spacing(10),
    },
}));


const Dashboard = () => {
    var classes = useStyles();

    const [years, loading, error] = useFetch('/api/backend/available-years/', [], json => json.sort((a, b) => b - a)) //sortowaine tablicy w porządku malejącym

    const number = 5
    const modeMost = "most"
    const modeLeast = "least"
    const regularType = "stacjonarne"
    const weekendType = "niestacjonarne"

    //pdf
    const [format, setFormat] = useState([0,0]);
    const getWidthHeight = () => {
        const container = ref.current;
        if(container !== null) {
            setFormat([container.clientHeight * 0.75625, container.clientWidth * 0.75625]); //dont know why this magic number
        }
    }
    const ref = React.createRef();
    const pdfOptions = {
        orientation: (format[0] > format[1]) ? "p" : "l", //if height > width then portrait, otherwise landscape
        format: format,
        unit: 'pt',
    };

    return (
        <>
            {
                loading ?
                    <Spinner />
                    :
                    (
                        error ?
                            <Error />
                            :
                            <>
                                <Pdf targetRef={ref} filename={`dashboard-${years[0]}.pdf`} options={pdfOptions}>
                                    {({ toPdf }) => (
                                        <Button 
                                            className={classes.margin}
                                            onClick={toPdf} 
                                            onMouseOver={e => getWidthHeight()}
                                            variant="contained"
                                            color="primary"
                                        >
                                            Wygeneruj plik Pdf
                                        </Button>
                                    )}
                                </Pdf>

                                <div id="container" ref={ref}>
                                    <Grid item container spacing={2}>
                                        <Grid item xs={12} className={classes.pageTitleContainer}>
                                            <Typography className={classes.text} variant="h3" size="sm">
                                            Dashboard {years[0]}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Divider />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant='h5'>Studia stacjonarne</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6} >
                                            <PopularityChart degree={1} year={years[0]} number={number} mode={modeMost} type={regularType} />
                                        </Grid>
                                        <Grid item xs={12} sm={6} >
                                            <PopularityChart degree={1} year={years[0]} number={number} mode={modeLeast} type={regularType} />
                                        </Grid>
                                        <Grid item xs={12} sm={6} >
                                            <ThresholdChart degree={1} year={years[0]} number={number} mode={modeMost} type={regularType} />
                                        </Grid>
                                        <Grid item xs={12} sm={6} >
                                            <ThresholdChart degree={1} year={years[0]} number={number} mode={modeLeast} type={regularType} />
                                        </Grid>
                                        <Grid item xs={12}  >
                                            <LaureateChart year={years[0]} number={number} type={regularType} />
                                        </Grid>
                                        <Grid item xs={12} sm={6} >
                                            <PopularityChart degree={2} year={years[0]} number={number} mode={modeMost} type={regularType} />
                                        </Grid>
                                        <Grid item xs={12} sm={6} >
                                            <PopularityChart degree={2} year={years[0]} number={number} mode={modeLeast} type={regularType} />
                                        </Grid>
                                        <Grid item xs={12} sm={6} >
                                            <ThresholdChart degree={2} year={years[0]} number={number} mode={modeMost} type={regularType} />
                                        </Grid>
                                        <Grid item xs={12} sm={6} >
                                            <ThresholdChart degree={2} year={years[0]} number={number} mode={modeLeast} type={regularType} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Divider />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant='h5'>Studia niestacjonarne</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6} >
                                            <PopularityChart degree={1} year={years[0]} number={number} mode={modeMost} type={weekendType} />
                                        </Grid>
                                        <Grid item xs={12} sm={6} >
                                            <PopularityChart degree={1} year={years[0]} number={number} mode={modeLeast} type={weekendType} />
                                        </Grid>
                                        <Grid item xs={12} sm={6} >
                                            <ThresholdChart degree={1} year={years[0]} number={number} mode={modeMost} type={weekendType} />
                                        </Grid>
                                        <Grid item xs={12} sm={6} >
                                            <ThresholdChart degree={1} year={years[0]} number={number} mode={modeLeast} type={weekendType} />
                                        </Grid>
                                        <Grid item xs={12}  >
                                            <LaureateChart year={years[0]} number={number} type={weekendType} />
                                        </Grid>
                                        <Grid item xs={12} sm={6} >
                                            <PopularityChart degree={2} year={years[0]} number={number} mode={modeMost} type={weekendType} />
                                        </Grid>
                                        <Grid item xs={12} sm={6} >
                                            <PopularityChart degree={2} year={years[0]} number={number} mode={modeLeast} type={weekendType} />
                                        </Grid>
                                        <Grid item xs={12} sm={6} >
                                            <ThresholdChart degree={2} year={years[0]} number={number} mode={modeMost} type={weekendType} />
                                        </Grid>
                                        <Grid item xs={12} sm={6} >
                                            <ThresholdChart degree={2} year={years[0]} number={number} mode={modeLeast} type={weekendType} />
                                        </Grid>
                                    </Grid>
                                </div>
                            </>
                    )
            }
        </>
    )
}

export default Dashboard