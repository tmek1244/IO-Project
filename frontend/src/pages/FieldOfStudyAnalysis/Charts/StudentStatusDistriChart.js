//CHA-92,94 
//92 - is this what was meant?

import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, Typography, Grid } from '@material-ui/core'
import useFetch from '../../../hooks/useFetch';
import { colors, borderColors, commonOptions } from './settings'

const options = {
    ...commonOptions,
    aspectRatio: 5,
};

export default function StudentStatusDistriChart({ faculty, cycle, field }) {

    //converts the result of fetched json to format accepted by chart component
    const convertResult = (json) => {
        if(typeof json[field] !== 'undefined') {
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
            return result;
        }
        return null;
    }

    const [fieldsOfStudyData, loading, error ] = useFetch(`api/backend/status-distribution-over-the-years/${faculty}/${field}/${cycle}/`, {})
    // const loading = undefined;
    // const fakeData = {
    //     Informatyka: {
    //         2019: {
    //           status1: 100,
    //           status2: 50,
    //         },
    //         2020: {
    //             status1: 70,
    //             status2: 120,
    //         },
    //     },
    // }

    return (
        <Card  >
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h5'>Rozkład studentów według statusu</Typography>} //TODO change name
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
