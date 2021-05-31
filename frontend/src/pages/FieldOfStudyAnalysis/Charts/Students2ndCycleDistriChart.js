//CHA-97

import React from 'react'
import { Line } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core'
import useFetch from '../../../hooks/useFetch';
import { colors, borderColors, commonOptions } from './settings'

const options = {
    ...commonOptions,
    aspectRatio: 4,
};


export default function Students2ndCycleDistriChart({ faculty, field}) {

    const convertResult = (json) => {
        //TODO lepszy opis labeli
        if(typeof json[field] !== 'undefined') {
            const result = {
                labels: Object.keys(json[field]),
                datasets: [{
                    label: "Kontynuuje",
                    data: [],
                    backgroundColor: colors[0],
                    borderColor: borderColors[0],
                },
                {
                    label: "Z zewnątrz",
                    data: [],
                    backgroundColor: colors[1],
                    borderColor: borderColors[1],
                }]
            }

            Object.keys(json[field]).forEach( key => {
                var stats = json[field][key]
                Object.keys(stats).forEach (statusKey => {
                    var points = stats[statusKey];
                    result.datasets[Object.keys(stats).indexOf(statusKey)].data.push(points)
                })
            })
            return result;
        }
        return null;
    }

    
    const [fieldsOfStudyData, loading, error ] = useFetch(`/api/backend/field-conversion-over-the-years/${faculty}/${field}`, {})
    // const loading = undefined
    // const fakeData = {
    //     "Informatyka": {
    //         2019: {
    //             "from-inside": 200,
    //             "from-outside": 100,
    //         },
    //         2020: {
    //             "from-inside": 20,
    //             "from-outside": 10,
    //         },
    //     },
    // }        

    return (
        <Card  >
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h5'>Liczba studentów kontynuująca kierunek oraz z zewnątrz</Typography>}
            />
            <CardContent>
            {
                loading ?
                    <p>ładowanko</p>
                    :
                    <div >
                        <Line data={convertResult(fieldsOfStudyData)} options={options} />
                    </div>
            }
            </CardContent>
        </Card>
    )
}
