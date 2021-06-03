import React from 'react'
import { Line } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core'
import { colors, borderColors, commonOptions } from './settings'
import useFetch from '../../../hooks/useFetch';
import Spinner from '../../../components/Spinner/Spinner';
import Error from '../../../components/Error/Error';

const options = {
    ...commonOptions,
    aspectRatio: 3,
};

const CurrentStatusChanges = ({ faculty, degree, field_of_study, year, type }) => {

    const convertResult = (json) => {
        const result = {
            labels: Object.keys(json),
            datasets: []
        }
        
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

    const [data, loading, error] = useFetch(`/api/backend/changes_after_cycle/${faculty}/${field_of_study}/${degree}/${year}/${type}`, {}, convertResult);

    return (
        <Card  >
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h5'>Zmiana rozkładu statusu pomiędzy cyklami w {year} roku</Typography>}
            />
            <CardContent>
                {
                    loading ?
                        <Spinner />
                        :
                        (
                            error ?
                                <Error />
                                :
                                <div >
                                    <Line data={data} options={options} />
                                </div>
                        )
                }
            </CardContent>
        </Card>
    )
}

export default CurrentStatusChanges
