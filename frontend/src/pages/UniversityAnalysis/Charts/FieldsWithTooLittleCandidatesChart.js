import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core'
import useFetch from '../../../hooks/useFetch';
import { colors, commonOptions } from './settings'
import Spinner from '../../../components/Spinner/Spinner';
import Error from '../../../components/Error/Error';

const options = {
    ...commonOptions,
    aspectRatio: 3,
};

const FieldsWithTooLittleCandidatesChart = ({ year, cycle, type }) => {

    const [data, loading, error] = useFetch(`api/backend/fields-of-study-not-full/${year}/${type}`, [])

    const filterCycle = (data) => {
        return data.filter(fof => parseInt(fof.degree) === cycle)
    }

    const convertData = (data) => {
        const result = {
            labels: [], datasets: [{
                label: 'Kierunki o zbyt małej liczbie zgłoszeń',
                data: [],
                backgroundColor: colors[2]
            }]
        }

        data.forEach(fof => {
            result.labels.push(fof.field_of_study)
            result.datasets[0].data.push(fof.candidate_per_place)
        });

        return result
    }


    return (
        <>
            {
                loading ?
                    <Spinner />
                    :
                    (error ?
                        <Error />
                        :
                        <Card  >
                            <CardHeader
                                style={{ textAlign: 'center' }}
                                title={<Typography variant='h5'>Kierunki o zbyt małej liczbie zgłoszeń</Typography>}
                            />
                            <CardContent>
                                <div >
                                    <Bar data={convertData(filterCycle(data))} options={options} /> {/* TODO zrobić skalę 0-1 */}
                                </div>
                            </CardContent>

                        </Card>
                    )
            }
        </>
    )
}

export default FieldsWithTooLittleCandidatesChart
