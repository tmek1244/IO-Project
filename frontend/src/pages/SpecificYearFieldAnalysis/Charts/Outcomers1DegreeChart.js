import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, Typography, Grid } from '@material-ui/core'
import useFetch from '../../../hooks/useFetch';
import { colors, commonOptions } from './settings'
import Spinner from '../../../components/Spinner/Spinner';
import Error from '../../../components/Error/Error';

const options = {
    ...commonOptions,
    aspectRatio: 3,
};


export default function Outcomers1DegreeChart({ faculty, field, year, type}) {

    
    const convertResult = (json) => {
        //sort
        var sortable = [];
        json.forEach(element => {
            sortable.push([element["field_of_study"], element["count"]]);
        })
        sortable.sort(function(a,b) {return b[1]-a[1]});

        const result = {
            labels: sortable.map(function (value,index) { return value[0]; }),
            datasets: [{
                label: "Liczba studentów",
                data: sortable.map(function (value,index) { return value[1]; }),
                backgroundColor: colors,
            }]
        }
        return result;
    }

    
    const [fieldsOfStudyData, loading, error ] = useFetch(`/api/backend/field-of-study-changes-list/${faculty}/${field}/${year}/${type}/`, [])

    return (
        <Card variant="outlined" style={{backgroundColor: "#fcfcfc"}}>
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h5'>Kierunki drugiego stopnia na które idą studenci po ukończeniu {field} </Typography>}
            />
            <CardContent>
                {
                    loading ?
                        <Spinner />
                        :
                        error  ?
                            <Error />
                            :
                            fieldsOfStudyData.length === 0 ?
                                <CardHeader  style={{ textAlign: 'center' }} title={<Typography variant='h6' color='error'> Brak danych do wyświetlenia. </Typography>} />
                                :
                                <div >
                                    <Bar data={convertResult(fieldsOfStudyData)} options={options} />
                                </div>
                }
            </CardContent>
        </Card>
    )
}
