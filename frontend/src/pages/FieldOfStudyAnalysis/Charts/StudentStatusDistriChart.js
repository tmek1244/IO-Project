import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, Typography, Grid } from '@material-ui/core'
import useFetch from '../../../hooks/useFetch';
import { colors, borderColors, commonOptions } from './settings'
import Spinner from '../../../components/Spinner/Spinner';
import Error from '../../../components/Error/Error';

const options = {
    ...commonOptions,
    aspectRatio: 6,
};

export default function StudentStatusDistriChart({ faculty, cycle, field, type }) {

    const convertResult = (json) => {
        if(typeof json[field] !== 'undefined') {
            json = json[field];
            const result = { labels: Object.keys(json), datasets: [] }
            
            const acceptedDataset = {
                label: "Zaakceptowani",
                data: [],
                backgroundColor: colors[0],
                borderColor: borderColors[0],
            }

            const rejectedDataset = {
                label: "Odrzuceni",
                data: [],
                backgroundColor: colors[1],
                borderColor: borderColors[1],
            }

            const signedDataset = {
                label: "Zapisani",
                data: [],
                backgroundColor: colors[2],
                borderColor: borderColors[2],
            }
            
            const unregisteredDataset = {
                label: "Wypisali się",
                data: [],
                backgroundColor: colors[3],
                borderColor: borderColors[3],
            }


            Object.values(json).forEach(cycleResult => {
                acceptedDataset.data.push(cycleResult.accepted)
                rejectedDataset.data.push(cycleResult.rejected)
                signedDataset.data.push(cycleResult.signed)
                unregisteredDataset.data.push(cycleResult.unregistered)

            })

            result.datasets.push(acceptedDataset, rejectedDataset, signedDataset, unregisteredDataset)

            return result;
        }
        return null;
    }

    const [fieldsOfStudyData, loading, error] = useFetch(`api/backend/status-distribution-over-the-years/${faculty}/${field}/${cycle}/${type}`, {})

    return (
        <Card  >
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h5'>Rozkład studentów według statusu</Typography>}
            />
            <CardContent>
                {
                    loading ?
                        <Spinner />
                        :
                        error ?
                            <Error />
                            :
                            fieldsOfStudyData && Object.keys(fieldsOfStudyData).length === 0 ?
                                <CardHeader  style={{ textAlign: 'center' }} title={<Typography variant='h6' color='error'> Brak danych do wyświetlenia. </Typography>} />
                                :
                                <div >
                                    <Bar data={convertResult(fieldsOfStudyData)} options={options} />
                                </div>
                }
            </CardContent>
        </Card>
    )
}
