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
    aspectRatio: 3,
};


export default function LaureateChart({ faculty, allowedFields, type, year }) {

    const convertResult = (json) => {
        let reduced = GetReducedFields(json, allowedFields) //already deletes json.all
        const result = {
            labels: Object.keys(reduced),
            datasets: [{
                label: "Liczba laureatów kandydujących na kierunek",
                data: Object.values(reduced),
                backgroundColor: colors,
            }]
        }

        return result
    }

    const [fieldsOfStudyData, loading, error] = useFetch(`/api/backend/laureates-on-fofs/${faculty}/${year}/${type}`, {})

    return (
        <Card  >
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h5'>Liczba laureatów na kierunek</Typography>}
            />
            <CardContent>
                {
                    loading ?
                        <Spinner />
                        :
                        error ?
                            <Error />
                            :
                            <div >
                                <Bar data={convertResult(fieldsOfStudyData)} options={options} />
                            </div>
                }
            </CardContent>
        </Card>
    )
}
