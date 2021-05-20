//CHA-91

import React from 'react'
import { Line } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core'
import { colors, borderColors, commonOptions } from './settings'
import useFetch from '../../../hooks/useFetch';

const options = {
    ...commonOptions,
    aspectRatio: 3,
};


export default function ThresholdDistriChart({ faculty, cycle, field }) {

    const convertResult = (json) => {
        const result = {
            labels: [],
            datasets: [{
                label: "Próg punktowy",
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

    //TODO add cycle here and delete mock
    const [fieldsOfStudyData, loading, error] = useFetch(`/api/backend/threshold/${cycle}/${faculty}+${field}`, {});

    return (
        <Card  >
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h5'>Próg punktowy</Typography>}
            />
            <CardContent>
                {
                    loading ?
                        <p>ładowanko</p> // TODO zrobić spinner
                        :
                        <div >
                            <Line data={convertResult(fieldsOfStudyData)} options={options} />
                        </div>
                }
            </CardContent>
        </Card>
    )
}
