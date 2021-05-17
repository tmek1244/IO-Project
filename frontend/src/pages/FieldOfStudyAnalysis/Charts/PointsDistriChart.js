//CHA-95

import React, { useState } from 'react'
import { Bar } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core'
import useFetch from '../../../hooks/useFetch';
import { colors, borderColors, commonOptions } from './settings'

const options = {
    ...commonOptions,
    aspectRatio: 3,
};

export default function PointsDistriChart({ faculty, cycle, field }) {
    //converts the result of fetched json to format accepted by chart component
    const convertResult = (json) => {
        if(typeof json[field] !== 'undefined') {
            const result = {
                labels: Object.keys(json[field]),
                datasets: []
            }

            for(let key=0; key<=1000; key+=step) {
                let index = key/step
                let keyStep = Math.min(parseInt(key)+step-1, 1000)
                result.datasets.push({
                    label: key<1000 ? (key + '-' + keyStep) : 1000,
                    data: [],
                    backgroundColor: colors[index],
                    borderColor: borderColors[index],
                })
            }

            Object.keys(json[field]).forEach( key => {
                var stats = json[field][key]
                Object.keys(stats).forEach (statusKey => {
                    let points = stats[statusKey];
                    let index = statusKey/step
                    result.datasets[index].data.push(points)
                })
            })

            return result;
        }
        return null;
    }

    //TODO maybe add setStep somewhere?
    const [step, setStep] = useState(200)

    const [fieldsOfStudyData, loading, error ] = useFetch(`api/backend/points-distribution-over-the-years/${step}/${faculty}/${field}/${cycle}/`, {})
    console.log(fieldsOfStudyData)

    return (
        <Card  >
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h5'>Rozkład punktów wśród kandydatów</Typography>}
            />
            <CardContent>
                {
                    loading ?
                        <p>ładowanko</p>
                        :
                        <div >
                            <Bar data={convertResult(fieldsOfStudyData)} options={options} />
                        </div>
                }
            </CardContent>
        </Card>
    )
}
