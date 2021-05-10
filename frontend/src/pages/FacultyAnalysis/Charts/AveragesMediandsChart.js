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


export default function AveragesMediansChart({ faculty , cycle, year, allowedFields}) {

    const convertResult = (json) => {
        if(Object.keys(json).includes(`${faculty} ${year}`)) {
            json = GetReducedFields(json[`${faculty} ${year}`], allowedFields)
        }

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
            Object.keys(json[k]).forEach(type => {
                result.datasets[
                    Object.keys(json[k]).indexOf(type)
                ].data.push(json[k][type]);
            })
        })

        return result
    }

    //const [fetchedData, loading, error ] = useFetch(`/api/backend/aam/${faculty}+${year}/`, {}, convertResult)
    const fetchedData = {
        "WIET 2020": {
            "Informatyka": {
                "AVG": 900,
                "MED": 800,
            },
            "Elektornika": {
                "AVG": 300,
                "MED": 100,
            },
        },
    }
    
    return (
        <Card  >
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h5'>Średnia i mediana kandydatów na kierunek</Typography>}
            />
            <CardContent>
                <div >
                    <Bar data={convertResult(fetchedData)} options={options}/>
                </div>
            </CardContent>
        </Card>
    )
}
