import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core'
import { colors, commonOptions } from './settings'
import { GetReducedArray } from '../FacultyAnalysis';

const options = {
    ...commonOptions,
    aspectRatio: 3,
};


export default function CandidatesNumChart({ faculty, cycle, allowedFields}) {

    const convertResult = (json) => {
        const result = { 
            labels: [],
            datasets: [{
                label: "Liczba kandydatów na jedno miejsce",
                data: [],
                backgroundColor: colors,
            }],
        }

        json.forEach( lit => {
            result.labels.push(lit["name"]);
            result.datasets[0].data.push(lit["candidates_per_place"]);
        })

        return result
    }

    // const payload = {
    //     "year":2020, //TODO think about it, maybe add everywhere year?
    //     "degree":cycle,
    //     "faculty":faculty
    // }
    // const [fieldsOfStudyData, loading, error] = useFetchPost('/api/backend/fields-of-study-candidates-per-place/', payload, [], convertResult);
    //TODO usnąć jak będą pobierane dane
    const fieldsOfStudyData = [
        {
            "name":"Informatyka",
            "faculty": "WIET",
            "degree": "7",
            "year": 2020,
            "candidates_per_place": 0.005
        },
        {
            "name":"Elektornika",
            "faculty": "WIET",
            "degree": "7",
            "year": 2020,
            "candidates_per_place": 0.015
        }
    ]
            
    return (
        <Card  >
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h5'>Liczba kandydatów na jedno miejsce</Typography>}
            />
            <CardContent>
                <div >
                    <Bar data={convertResult(GetReducedArray(fieldsOfStudyData, allowedFields))} options={options}/>
                </div>
            </CardContent>
        </Card>
    )
}
