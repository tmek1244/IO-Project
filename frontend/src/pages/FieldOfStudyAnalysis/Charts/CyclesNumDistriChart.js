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


export default function CyclesNumDistriChart({ faculty, cycle, field, type }) {

    const convertResult = (json) => {
        if (typeof json[field] !== 'undefined') {
            const result = {
                labels: Object.keys(json[field]),
                datasets: [{
                    label: field,
                    data: Object.values(json[field]),
                    backgroundColor: colors[0],
                    borderColor: borderColors[0],
                }],
            }

            return result
        }
        return null
    }

    const [fieldsOfStudyData, loading, error] = useFetch(`/api/backend/last-rounds/${faculty}/${field}/${cycle}/${type}`, {});
    let isEmpty = fieldsOfStudyData && Object.keys(fieldsOfStudyData).length === 0

    return (
        <Card  >
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h5'>Liczba cykli</Typography>}
            />
            <CardContent>
                {
                    loading ?
                        <Spinner />
                        :
                        error ?
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
