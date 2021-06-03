import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core'
import useFetch from '../../../hooks/useFetch';
import { colors, commonOptions } from './settings'
import { GetReducedFields } from '../FacultyAnalysis';


const options = {
    ...commonOptions,
    aspectRatio: 5,
};


export default function AveragesMediansChart({ faculty, cycle, year, allowedFields, type}) {

    const convertResult = (json) => {
        if(typeof json[`${faculty} ${year}`] !== 'undefined') {
            let reduced = GetReducedFields(json[`${faculty} ${year}`], allowedFields)
        
            const result = {
                labels: Object.keys(reduced),
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
                ]
            }

            Object.keys(reduced).forEach(k => {
                Object.keys(reduced[k]).forEach(type => {
                    result.datasets[
                        Object.keys(reduced[k]).indexOf(type)
                    ].data.push(reduced[k][type]);
                })
            })

            return result;
        }
        return null;
    }

    const [fetchedData, loading, error] = useFetch(`/api/backend/aam/${cycle}/${faculty}+${year}/${type}/`, {})

    return (
        <Card  >
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h5'>Średnia i mediana kandydatów na kierunek</Typography>}
            />
            <CardContent>
                {
                    loading ?
                        <p>ładowanko</p>
                        :
                        <div >
                            <Bar data={convertResult(fetchedData)} options={options} />
                        </div>
                }

            </CardContent>
        </Card>
    )
}
