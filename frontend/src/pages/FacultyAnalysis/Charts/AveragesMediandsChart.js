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


export default function AveragesMediansChart({ faculty , cycle, allowedFields}) {

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
            result.datasets[0].data.push(json[k]["AVG"]);
            result.datasets[1].data.push(json[k]["MED"]);
        })

        return result
    }

    //TODO zmienic jak będzie endpoint
    //const [fetchedData, loading, error ] = useFetch(`/api/backend/aam/${faculty}+2020/`, {}, convertResult)
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
    const fieldsOfStudyData = fetchedData["WIET 2020"];
    
    return (
        <Card  >
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h5'>Średnia i mediana kandydatów na kierunek</Typography>}
            />
            <CardContent>
                <div >
                    <Bar data={convertResult(GetReducedFields(fieldsOfStudyData, allowedFields))} options={options}/>
                </div>
            </CardContent>
        </Card>
    )
}
