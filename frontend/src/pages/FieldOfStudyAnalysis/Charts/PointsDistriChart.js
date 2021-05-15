//CHA-95

import React from 'react'
import { Line } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, Typography, Grid } from '@material-ui/core'
import useFetch from '../../../hooks/useFetch';
import { colors, borderColors, commonOptions } from './settings'

const options = {
    ...commonOptions,
    aspectRatio: 4,
};

export default function PointsDistriChart({ faculty, cycle, field }) {

    //converts the result of fetched json to format accepted by chart component
    const convertResult = (json) => {
        const result = {
            labels: Object.keys(json[field]),
            datasets: []
        }
        
        Object.keys(json[field][Object.keys(json[field])[0]]).forEach(key => {
            result.datasets.push({
                label: key,
                data: [],
                backgroundColor: colors[Object.keys(json[field][Object.keys(json[field])[0]]).indexOf(key)],
                borderColor: borderColors[Object.keys(json[field][Object.keys(json[field])[0]]).indexOf(key)],
            })
        })

        Object.keys(json[field]).forEach( key => {
            var stats = json[field][key]
            Object.keys(stats).forEach (statusKey => {
                var points = stats[statusKey];
                result.datasets[Object.keys(stats).indexOf(statusKey)].data.push(points)
            })
        })

        return result
    }

    // const [fieldsOfStudyData, loading, error ] = useFetch(`api/backend/points-distribution-over-the-years/step/${faculty}/${field}/${cycle}/`, {}, convertResults)
    const loading = undefined;
    const fakeData = {
        Informatyka: {
            2019: {
              Average: 500,
              Median: 400,
            },
            2020: {
                Average: 300,
                Median: 400,
            },
        },
    }

    return (
        <Card  >
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h5'>Rozkład punktów</Typography>}
            />
            <CardContent>
                {
                    loading ?
                        <p>ładowanko</p>
                        :
                        <div >
                            {/* <Bar data={fieldsOfStudyData} options={options} /> */}
                            <Line data={convertResult(fakeData)} options={options} />
                        </div>
                }
            </CardContent>
        </Card>
    )
}
