import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core'
import { colors, commonOptions } from './settings'
import { GetReducedFields } from '../FacultyAnalysis';


const options = {
    ...commonOptions,
    aspectRatio: 3,
};


export default function CandidatesNumChart({ faculty, allowedFields}) {

    const convertResult = (json) => {
        const result = { 
            labels: Object.keys(json),
            datasets: [{
                label: "Liczba kandydatów na jedno miejsce",
                data: Object.values(json),
                backgroundColor: colors,
            }],
        }

        return result
    }


    //TODO odkomentować jak będzie endpoint
    //const [fieldsOfStudyData, loading, error ] = useFetch(`/api/backend/candidates_number_per_place?faculty=${faculty}`, {}, convertResult)


    //TODO usnąć jak będą pobierane dane
    const fieldsOfStudyData = {
        informatyka: 10,
        elektrotechnika: 1,
        telekomunikacja: 2,
        cyberbezpieczeństwo: 2,
        random: 5,
        org: 1,
        kolejnykierunek: 6,
    }
            
    return (
        <Card  >
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h5'>Liczba kandydatów na jedno miejsce</Typography>}
            />
            <CardContent>
                <div >
                    <Bar data={convertResult(GetReducedFields(fieldsOfStudyData, allowedFields))} options={options}/>
                </div>
            </CardContent>
        </Card>
    )
}
