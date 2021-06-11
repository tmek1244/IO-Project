//CHA-91

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


export default function ThresholdDistriChart({ faculty, cycle, field, type }) {

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
            result.labels.push(lit["recruitment__year"]);
            result.datasets[0].data.push(lit["min_points"]);
        })

        return result
    }

    const [fieldsOfStudyData, loading, error] = useFetch(`/api/backend/threshold/${cycle}/${type}/${faculty}+${field}`, [], e => e.sort((a,b) => {return a["recruitment__year"] > b["recruitment__year"] ? 1 : -1;}));
    return (
        <Card  >
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h5'>Próg punktowy</Typography>}
            />
            <CardContent>
                {
                    loading ?
                        <Spinner />
                        :
                        (
                            error  && !fieldsOfStudyData.length === 0 ? // tu tez jest potrzebne
                                <Error />
                                :
                                fieldsOfStudyData.length === 0 ?
                                    <CardHeader  style={{ textAlign: 'center' }} title={<Typography variant='h6' color='error'> Brak danych do wyświetlenia. </Typography>} />
                                    :
                                    <div>
                                        <Line data={convertResult(fieldsOfStudyData)} options={options} />
                                    </div>
                        )

                }
            </CardContent>
        </Card>
    )
}
