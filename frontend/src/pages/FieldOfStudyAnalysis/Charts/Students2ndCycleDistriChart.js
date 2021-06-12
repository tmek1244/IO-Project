//CHA-97

import React from 'react'
import { Line } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core'
import useFetch from '../../../hooks/useFetch';
import { colors, borderColors, commonOptions } from './settings'
import Spinner from '../../../components/Spinner/Spinner';
import Error from '../../../components/Error/Error';

const options = {
    ...commonOptions,
    aspectRatio: 4,
};


export default function Students2ndCycleDistriChart({ faculty, field, type }) {

    const convertResult = (json) => {
        //TODO lepszy opis labeli
        if (typeof json[field] !== 'undefined') {
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

            Object.keys(json[field]).forEach(key => {
                var stats = json[field][key]
                Object.keys(stats).forEach(statusKey => {
                    var points = stats[statusKey];
                    result.datasets[Object.keys(stats).indexOf(statusKey)].data.push(points)
                })
            })
            return result;
        }
        return null;
    }


    const [fieldsOfStudyData, loading, error] = useFetch(`/api/backend/field-conversion-over-the-years/${faculty}/${field}/${type}`, {})


    return (
        <Card variant="outlined" style={{backgroundColor: "#fcfcfc"}} >
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h5'>Liczba studentów kontynuująca kierunek oraz z zewnątrz</Typography>}
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
                                <div>
                                    <Line data={convertResult(fieldsOfStudyData)} options={options} />
                                </div>
                }
            </CardContent>
        </Card>
    )
}
