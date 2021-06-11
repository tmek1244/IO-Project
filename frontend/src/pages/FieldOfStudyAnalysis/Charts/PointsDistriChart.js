//CHA-95

import React, { useState } from 'react'
import { Bar } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core'
import useFetch from '../../../hooks/useFetch';
import { colors, borderColors, commonOptions } from './settings'
import Spinner from '../../../components/Spinner/Spinner';
import Error from '../../../components/Error/Error';

const options = {
    ...commonOptions,
    aspectRatio: 6,
};

export default function PointsDistriChart({ faculty, cycle, field, type }) {
    //converts the result of fetched json to format accepted by chart component
    const convertResult = (json) => {
        if (typeof json[field] !== 'undefined') {
            const result = {
                labels: Object.keys(json[field]),
                datasets: []
            }

            for (let key = 0; key <= 1000; key += step) {
                let index = key / step
                let keyStep = Math.min(parseInt(key) + step - 1, 1000)
                result.datasets.push({
                    label: key < 1000 ? (key + '-' + keyStep) : 1000,
                    data: [],
                    backgroundColor: colors[index],
                    borderColor: borderColors[index],
                })
            }

            Object.keys(json[field]).forEach(key => {
                var stats = json[field][key]
                Object.keys(stats).forEach(statusKey => {
                    let points = stats[statusKey];
                    let index = statusKey / step
                    result.datasets[index].data.push(points)
                })
            })

            return result;
        }
        return null;
    }

    const step = 200;
    const [fieldsOfStudyData, loading, error] = useFetch(`api/backend/points-distribution-over-the-years/${step}/${faculty}/${field}/${cycle}/${type}`, {})

    return (
        <Card  >
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h5'>Rozkład punktów wśród kandydatów</Typography>}
            />
            <CardContent>
                {
                    loading ?
                        <Spinner />
                        :
                        error ?
                            <Error />
                            :
                            fieldsOfStudyData && Object.keys(fieldsOfStudyData).length === 0 ?
                                <CardHeader  style={{ textAlign: 'center' }} title={<Typography variant='h6' color='error'> Brak danych do wyświetlenia. </Typography>} />
                                :
                                <div>
                                    <Bar data={convertResult(fieldsOfStudyData)} options={options} />
                                </div>
                }
            </CardContent>
        </Card>
    )
}
