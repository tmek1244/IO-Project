import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core'
import useFetch from '../../../hooks/useFetch';
import { colors, commonOptions } from './settings'
import Spinner from '../../../components/Spinner/Spinner';
import Error from '../../../components/Error/Error';

const options = {
    ...commonOptions,
    aspectRatio: 6,
};


const LaureateChart = ({ year, number, type }) => {
    const convertResult = (json) => {


        const result = {
            labels: [], datasets: [{
                label: 'Liczba laureatów na miejsce',
                data: [],
                backgroundColor: colors[2]
            }]
        }

        for (let key of Object.keys(json)) {
            result.labels.push(key)
            result.datasets[0].data.push(json[key])
        }


        return result
    }


    const [data, loading, error] = useFetch(`api/backend/laureate_stats/${number}/${year}/${type}`, {}, convertResult)


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
                                title={<Typography variant='h5'>Top {number} kierunków o największej liczbie laureatów</Typography>}
                            />
                            <CardContent>
                                <div >
                                    <Bar data={data} options={options} />
                                </div>
                            </CardContent>

                        </Card>
                    )
            }
        </>

    )
}

export default LaureateChart
