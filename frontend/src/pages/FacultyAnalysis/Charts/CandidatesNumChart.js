import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core'
import { colors, commonOptions } from './settings'
import { GetReducedArray } from '../FacultyAnalysis';
import useFetchPost from '../../../hooks/useFetchPost'

const options = {
    ...commonOptions,
    aspectRatio: 3,
};


export default function CandidatesNumChart({ faculty, cycle, year, allowedFields }) {

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
            result.labels.push(lit["name"]);
            result.datasets[0].data.push(lit["candidates_per_place"]);
        })

        return result
    }

    const payload = {
        "year": year,
        "degree": cycle,
        "faculty": faculty
    }
    const [fieldsOfStudyData, loading, error] = useFetchPost('/api/backend/fields-of-study-candidates-per-place/', payload, [], convertResult);


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
                            <Bar data={fieldsOfStudyData} options={options} />
                        </div>
                }
            </CardContent>
        </Card>
    )
}
