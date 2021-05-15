import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core'
import useFetch from '../../../hooks/useFetch';
import { colors, commonOptions } from './settings'

const options = {
    ...commonOptions,
    aspectRatio: 3,
};


const PopularityChart = ({ degree, year, number, mode }) => {
    //converts the result of fetched json to format accepted by chart component
    const convertResult = (json) => {


        const result = {
            labels: [], datasets: [{
                label: 'Liczba kandydatów na miejsce',
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


    const [data, loading, error] = useFetch(`api/backend/fields-of-study-popularity/${mode}/${degree}/${number}/${year}/`, {}, convertResult)

    const degreeString = degree === 1 ? "I" : "II"
    const label = mode === 'most' ?
        `Top ${number} najbardziej obleganych kierunków na studiach ${degreeString} stopnia`
        :
        `Top ${number} najmniej obleganych kierunków na studiach ${degreeString} stopnia`

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
                                title={<Typography variant='h5'>{label}</Typography>}
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

export default PopularityChart
