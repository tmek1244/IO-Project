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


export default function AveragesMediansChart({ faculty, cycle, year, allowedFields }) {

    const convertResult = (json) => {
        // TODO Czemu tylko robisz tę konwersję tylko jak jest klucz a jak nie ma to olewasz to i procesujesz normalnie?
        if (Object.keys(json).includes(`${faculty} ${year}`)) {
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
            ]
        }

        Object.keys(json).forEach(k => {
            Object.keys(json[k]).forEach(type => {
                result.datasets[
                    Object.keys(json[k]).indexOf(type)
                ].data.push(json[k][type]);
            })
        })

        return result
    }

    const [fetchedData, loading, error] = useFetch(`/api/backend/aam/${cycle}/${faculty}+${year}/`, {}, convertResult)

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
                            <Bar data={fetchedData} options={options} />
                        </div>
                }

            </CardContent>
        </Card>
    )
}
