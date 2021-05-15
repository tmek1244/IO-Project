//CHA-89 DONETMP

import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core'
import { colors, commonOptions } from './settings'
import useFetch from '../../../hooks/useFetch';

const options = {
    ...commonOptions,
    aspectRatio: 3,
};


export default function CandidatesPerPlaceDistriChart({ faculty, cycle, field }) {

    const convertResult = (json) => {
        
        // const reduced = GetReducedArray(json, allowedFields) //komentuję to na razie
        const result = {
            labels: [],
            datasets: [{
                label: "Liczba kandydatów na jedno miejsce",
                data: [],
                backgroundColor: colors,
            }],
        }

        json.forEach(lit => {
            result.labels.push(lit["year"]);
            result.datasets[0].data.push(lit["candidates_per_place"]);
        })

        return result
    }

    const [fieldsOfStudyData, loading, error] = useFetch(`/api/backend/candidates-per-place/${faculty}+${field}+${cycle}/`, [], convertResult);
    const fakeData = [
        {
            "year":2019,
            "candidates_per_place":0.02
        },
        {
            "year":2020,
            "candidates_per_place":0.10
        },
    ]

    return (
        <Card  >
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h5'>Liczba kandydatów na jedno miejsce</Typography>}
            />
            <CardContent>
                {
                    loading ?
                        <p>ładowanko</p> // TODO zrobić spinner
                        :
                        <div >
                            <Bar data={convertResult(fakeData)} options={options} />
                            {/* <Bar data={fieldsOfStudyData} options={options} /> */}
                        </div>
                }
            </CardContent>
        </Card>
    )
}
