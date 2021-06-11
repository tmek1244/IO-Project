//CHA-92,94 
//92 - is this what was meant?

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

    const statusTranslation = {
        rejected: "Odrzuceni",
        unregistered: "Wypisali się",
        accepted: "Zaakceptowani",
        signed: "Zapisani"
    }

    const colorMapping = {
        rejected: colors[2],
        unregistered: colors[3],
        accepted: colors[0],
        signed: colors[1],
    }

    //converts the result of fetched json to format accepted by chart component
    const convertResult = (json) => {
        if (typeof json[field] !== 'undefined') {
            const result = {
                labels: Object.keys(json[field]),
                datasets: []
            }

            Object.keys(json[field][Object.keys(json[field])[0]]).forEach(key => {
                result.datasets.push({
                    label: statusTranslation[key],
                    data: [],
                    backgroundColor: colorMapping[key],
                })
            })

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

    const [fieldsOfStudyData, loading, error] = useFetch(`api/backend/status-distribution-over-the-years/${faculty}/${field}/${cycle}/${type}`, {})

    return (
        <Card  >
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h5'>Rozkład studentów według statusu</Typography>} //TODO change name
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
