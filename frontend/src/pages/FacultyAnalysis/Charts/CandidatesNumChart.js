import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core'
import { colors, commonOptions } from './settings'
import useFetchPost from '../../../hooks/useFetchPost'
import Spinner from '../../../components/Spinner/Spinner';

const options = {
    ...commonOptions,
    aspectRatio: 3,
};

function GetReducedArray(fieldsArray, allowedFields) {
    return fieldsArray.filter(arr => allowedFields.includes(arr["name"]));
}

export default function CandidatesNumChart({ faculty, cycle, year, allowedFields, type }) {

    const isEmpty = (json) => {
        var empty = true;
        json.forEach(lit => {
            if(lit["candidates_per_place"] > 0) {empty = false;}
        })
        return empty;
    }

    const convertResult = (reduced) => {
        const result = {
            labels: [],
            datasets: [{
                label: "Liczba kandydatów na jedno miejsce",
                data: [],
                backgroundColor: colors,
            }],
        }

        reduced.forEach(lit => {
            if(lit["candidates_per_place"] > 0) {
                result.labels.push(lit["name"]);
                result.datasets[0].data.push(lit["candidates_per_place"]);
            }
        })

        return result
    }

    const payload = {
        "year": year,
        "degree": cycle,
        "faculty": faculty,
        "type": type
    }
    const [fieldsOfStudyData, loading, error] = useFetchPost('/api/backend/fields-of-study-candidates-per-place/', payload, []);
    let reducedFields = GetReducedArray(fieldsOfStudyData, allowedFields);

    return (
        <Card  >
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h5'>Liczba kandydatów na jedno miejsce</Typography>}
            />
            <CardContent>
                {
                    loading ?
                        <Spinner />
                        :
                        isEmpty(reducedFields) ?
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
