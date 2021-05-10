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


export default function LaureateChart({ faculty, allowedFields}) {

    const convertResult = (json) => {
        json = GetReducedFields(json, allowedFields)
        const result = { 
            labels: Object.keys(json),
            datasets: [{
                label: "Liczba laureatów kandydujących na kierunek",
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
        Informatyka: 100,
        Elektornika: 30,
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
                title={<Typography variant='h5'>Liczba laureatów na kierunek</Typography>}
            />
            <CardContent>
                <div >
                    {/* TODO change data to real data */}
                    <Bar data={convertResult(fakeData)} options={options} />
                </div>
            </CardContent>
        </Card>
    )
}
