import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core'
import useFetch from '../../../hooks/useFetch';
import { colors, commonOptions } from './settings'
import { GetReducedFields } from '../FacultyAnalysis';
import Spinner from '../../../components/Spinner/Spinner';

const options = {
    ...commonOptions,
    aspectRatio: 3,
};


export default function Cycle2ndChart({ faculty, year, allowedFields, type}) {

    const convertResult = (reduced) => {
        const result = {
            labels: Object.keys(reduced),
            datasets: [{
                label: "Kontynuuje",
                data: [],
                backgroundColor: colors[0],
            },
            {
                label: "Z zewnątrz",
                data: [],
                backgroundColor: colors[1],
            }]
        }

        Object.keys(reduced).forEach( key => {
            var stats = reduced[key]
            Object.keys(stats).forEach (statusKey => {
                var points = stats[statusKey];
                result.datasets[Object.keys(stats).indexOf(statusKey)].data.push(points)
            })
        })
        return result
    }

    const [fieldsOfStudyData, loading, error ] = useFetch(`api/backend/field-conversion/${faculty}/${type}/${year}`, {}) 
    let reducedFields = GetReducedFields(fieldsOfStudyData, allowedFields);

    return (
        <Card variant="outlined" style={{backgroundColor: "#fcfcfc"}}>
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h5'>Liczba studentów kontynuująca kierunek oraz z zewnątrz</Typography>}
            />
            <CardContent>
            {
                loading ?
                    <Spinner />
                    :
                    reducedFields && Object.keys(reducedFields).length === 0 ?
                        <CardHeader  style={{ textAlign: 'center' }} title={<Typography variant='h6' color='error'> Brak danych do wyświetlenia. </Typography>} />
                        :
                        <div >
                            <Bar data={convertResult(reducedFields)} options={options} />
                        </div>
            }
            </CardContent>
        </Card>
    )
}