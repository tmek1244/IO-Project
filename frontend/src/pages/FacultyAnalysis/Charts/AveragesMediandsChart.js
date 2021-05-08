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


export default function AveragesMediansChart({ faculty , allowedFields}) {

    const convertResult = (json) => {
        const result = { 
            labels: Object.keys(json),
            datasets: [{
                label: "Średnia",
                data: [],
                backgroundColor: colors[0],
            },
            {
                label: "Mediana",
                data: [],
                backgroundColor: colors[1],
            }
        ]}

        Object.keys(json).forEach(k => {
            result.datasets[0].data.push(json[k]["average"]);
            result.datasets[1].data.push(json[k]["median"]);
        })

        return result
    }


    //TODO odkomentować jak będzie endpoint
    //const [fieldsOfStudyData, loading, error ] = useFetch(`/api/backend/candidates_number_per_place?faculty=${faculty}`, {}, convertResult)


    //TODO usnąć jak będą pobierane dane
    const fieldsOfStudyData = {
        informatyka: {
            average: 900,
            median: 800,
        },
        elektrotechnika: {
            average: 300,
            median: 100,
        },
        telekomunikacja: {
            average: 900,
            median: 400,
        },
        cyberbezpieczeństwo: {
            average: 400,
            median: 800,
        },
        random: {
            average: 550,
            median: 600,
        },
        org: {
            average:900,
            median:800,
        },
        kolejnykierunek: {
            average:900,
            median:800,
        },
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
