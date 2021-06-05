//CHA-89 DONETMP

import React from 'react'
import { Line } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core'
import { colors, borderColors, commonOptions } from './settings'
import useFetch from '../../../hooks/useFetch';
import Spinner from '../../../components/Spinner/Spinner';
import Error from '../../../components/Error/Error';

const options = {
    ...commonOptions,
    aspectRatio: 4,
};


export default function CandidatesPerPlaceDistriChart({ faculty, cycle, field, type }) {

    const convertResult = (json) => {
        const result = {
            labels: [],
            datasets: [{
                label: field,
                data: [],
                backgroundColor: colors[0],
                borderColor: borderColors[0],
            }],
        }

        json.forEach(lit => {
            result.labels.push(lit["year"]);
            result.datasets[0].data.push(lit["candidates_per_place"]);
        })

        return result
    }

    const [fieldsOfStudyData, loading, error] = useFetch(`/api/backend/candidates-per-place/${faculty}+${field}+${cycle}+${type}/`, []);
    let isEmpty = fieldsOfStudyData.length === 0;

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
                        error && !fieldsOfStudyData.length === 0 ? // nie wiem czemu, ale trzeba zrobić takie obejście na ten warunek 
                            <Error />
                            :
                            isEmpty ?
                                <CardHeader  style={{ textAlign: 'center' }} title={<Typography variant='h6' color='error'> Brak danych do wyświetlenia. </Typography>} />
                                :
                                <div>
                                    <Line data={convertResult(fieldsOfStudyData)} options={options} />
                                </div>
                }
            </CardContent>
        </Card>
    )
}
