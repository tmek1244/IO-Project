import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core'
import useFetch from '../../../hooks/useFetch';
import { colors, commonOptions } from './settings'

const options = {
    ...commonOptions,
    aspectRatio: 6,
};


const LaureateChart = ({ year, number}) => {
    const convertResult = (json) => {


        const result = {
            labels: [], datasets: [{
                label: 'Liczba laureatów na miejsce',
                data: [],
                backgroundColor: colors[0]
            }]
        }

        for (let key of Object.keys(json)) {
            result.labels.push(key)
            result.datasets[0].data.push(json[key])
        }


        return result
    }


    const [data, loading, error] = useFetch(`api/backend/laureate_stats/${number}/${year}`, {}, convertResult)

   
    return (
        <>
            {
                loading ?
                    <p>czekanko</p>
                    :
                    (error ?
                        <p>bład</p>
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
