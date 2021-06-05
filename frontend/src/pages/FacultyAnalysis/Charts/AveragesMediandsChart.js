import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core'
import useFetch from '../../../hooks/useFetch';
import { colors, commonOptions } from './settings'
import { GetReducedFields } from '../FacultyAnalysis';
import Spinner from '../../../components/Spinner/Spinner';
import Error from '../../../components/Error/Error';

const options = {
    ...commonOptions,
    aspectRatio: 5,
};


export default function AveragesMediansChart({ faculty, cycle, year, allowedFields, type}) {

    const convertResult = (reduced) => {
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

    const [fieldsOfStudyData, loading, error] = useFetch(`/api/backend/aam/${cycle}/${faculty}+${year}/${type}/`, {})
    let reducedFields = (typeof fieldsOfStudyData[`${faculty} ${year}`] === 'undefined') ? {} : GetReducedFields(fieldsOfStudyData[`${faculty} ${year}`], allowedFields)

    return (
        <Card  >
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h5'>Średnia i mediana kandydatów na kierunek</Typography>}
            />
            <CardContent>
                {
                    loading ?
                        <Spinner />
                        :
                        error ?
                            <Error />
                            :
                            reducedFields && Object.keys(reducedFields).length === 0 ?
                                <CardHeader  style={{ textAlign: 'center' }} title={<Typography variant='h6' color='error'> Brak danych do wyświetlenia. </Typography>} />
                                :
                                <div >
                                    <Bar data={convertResult(reducedFields)} options={options} />
                                </div>
                }
            </CardContent>
        </Card>
    )
}
