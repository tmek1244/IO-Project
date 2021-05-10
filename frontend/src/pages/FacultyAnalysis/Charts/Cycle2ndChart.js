import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core'
import useFetch from '../../../hooks/useFetch';
import { colors, commonOptions } from './settings'
import { GetReducedFields } from '../FacultyAnalysis';

const options = {
    ...commonOptions,
    aspectRatio: 3,
};


export default function Cycle2ndChart({ faculty, allowedFields}) {

    const convertResult = (json) => {
        const result = { 
            labels: Object.keys(json),
            datasets: [{
                label: "CHA 66 TODOO",
                data: Object.values(json),
                backgroundColor: colors,
            }]
        }

        return result
    }

    //TODO odkomentować jak będzie endpoint
    //const [fieldsOfStudyData, loading, error ] = useFetch(`/api/backend/actual_recruitment_faculty_laureate?faculty=${faculty}`, {}, convertResult)


    //TODO usnąć jak będą pobierane dane
    const fakeData = {
        informatyka: 100,
        elektrotechnika: 30,
        telekomunikacja: 47,
        cyberbezpieczeństwo: 90,
        random: 5,
        org: 13,
        kolejnykierunek: 17,
    }

    return (
        <Card  >
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h5'>CHA-66 TODO</Typography>}
            />
            <CardContent>
                <div >
                    {/* TODO change data to real data */}
                    <Bar data={convertResult(GetReducedFields(fakeData, allowedFields))} options={options} />
                </div>
            </CardContent>
        </Card>
    )
}
