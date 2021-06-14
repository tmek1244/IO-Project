import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, Typography, Grid } from '@material-ui/core'
import useFetch from '../../../hooks/useFetch';
import { colors, commonOptions } from './settings'
import Spinner from '../../../components/Spinner/Spinner';

const options = {
    ...commonOptions,
    aspectRatio: 5,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false,
      },
    },
};


export default function CycleFlowFromChart({ faculty, cycle, field, year, type}) {
    const shortenFaculty = (name) => {
        return name.split(' ').map(part => part[0])
    }

    const convertResult = (json) => {
        //sort
        var sortable = [];
        for(var fof in json) {
            let [fac,fi] = fof.split(";");
            sortable.push([fi+" "+shortenFaculty(fac).join(""), json[fof]]);
        }
        sortable.sort(function(a,b) {return b[1]-a[1]});

        const result = {
            labels: sortable.map(function (value,index) { return value[0]; }),
            datasets: [{
                data: sortable.map(function (value,index) { return value[1]; }),
                backgroundColor: colors,
            }]
        }
        return result;
    }

    
    const [fieldsOfStudyData, loading, error ] = useFetch(`api/backend/same-year-field-conversion/${year}/${faculty}/${field}/${type}/${cycle}/`, {})

    return (
        <Card variant="outlined" style={{backgroundColor: "#fefefe"}}>
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h6'>Z jakich kierunków studenci zrezygnowali aplikując na {field}</Typography>}
            />
            <CardContent>
            {
                (loading || error) ?
                    <Spinner />
                    :
                    <Grid container spacing={1}>
                    {Object.keys(fieldsOfStudyData).map((name) => {
                        return(
                        <Grid item xs={12}>
                            <Card variant="outlined">
                            <CardHeader
                                style={{ textAlign: 'center', backgroundColor: "#fcfcfc", paddingBottom:0, paddingTop:5}}
                                title={<Typography variant='subtitle1'>Cykl {name}</Typography>}
                            />
                            <CardContent style={{backgroundColor: "#fcfcfc",padding:0}}>
                                <Bar data={convertResult(fieldsOfStudyData[name])} options={options} />
                            </CardContent>
                            </Card>
                        </Grid>)
                    })}
                    </Grid>
            }
            </CardContent>
        </Card>
    )
}
