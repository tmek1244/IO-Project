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


export default function CandidatesNumChart({ faculty, cycle, year, allowedFields, type }) {

    const convertResult = (json) => {
        
        const reduced = GetReducedArray(json, allowedFields)
        const result = {
            labels: [],
            datasets: [{
                label: "Liczba kandydatów na jedno miejsce",
                data: [],
                backgroundColor: colors,
            }],
        }

        reduced.forEach(lit => {
            result.labels.push(lit["name"]);
            result.datasets[0].data.push(lit["candidates_per_place"]);
        })

        return result
    }

    const payload = {
        "year": year,
        "degree": cycle,
        "faculty": faculty,
        "type": type
    }
    const [fieldsOfStudyData, loading, error] = useFetchPost('/api/backend/fields-of-study-candidates-per-place/', payload, []);

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
                            <Bar data={convertResult(fieldsOfStudyData)} options={options} />
                        </div>
                }
            </CardContent>
        </Card>
    )
}
