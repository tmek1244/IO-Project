//CHA-90 DONE

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


export default function LaureatesDistriChart({ faculty, field, type }) {

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
            result.datasets[0].data.push(lit["contest_laureates"]);
        })

        return result
    }

    const [fieldsOfStudyData, loading, error] = useFetch(`/api/backend/contest-laureates/${faculty}+${field}+${type}`, []);

    return (
        <Card  >
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h5'>Liczba laureatów</Typography>}
            />
            <CardContent>
                {
                    loading ?
                        <Spinner />
                        :
                        (
                            error && !fieldsOfStudyData.length === 0 ? // tu tak samo potrzeba tego dziwnego obejścia
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
        </Card >
    )
}
