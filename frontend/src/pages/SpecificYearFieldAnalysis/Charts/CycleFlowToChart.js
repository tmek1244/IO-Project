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

export default function CycleFlowToChart({ faculty, cycle, field, year, type}) {
    const shortenFaculty = (name) => {
        return name.split(' ').map(part => part[0])
    }

    const convertResult = (json) => {
        var sortable = [];
        Object.values(json).forEach(data => {
            sortable.push([data["field_of_study"]+" "+shortenFaculty(data["faculty"]).join(""), data["count"]]);
        })

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

    const [fieldsOfStudyData, loading, error ] = useFetch(`/api/backend/field-of-study-changes-cycle-list/${faculty}/${field}/${cycle}/${year}/${type}/`, {})

    return (
        <Card variant="outlined" style={{backgroundColor: "#fefefe"}}>
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h6'>Na jakie kierunki studenci aplikują rezygnując z {field}</Typography>}
            />
            <CardContent>
            {
                (loading || error) ?
                    <Spinner />
                    :
                    <Grid container spacing={1}>
                    {Object.keys(fieldsOfStudyData).map((name) => {
                        if(name === "1") return null;
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
