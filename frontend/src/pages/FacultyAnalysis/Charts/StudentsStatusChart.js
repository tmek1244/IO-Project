import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core'
import useFetch from '../../../hooks/useFetch';
import { colors, commonOptions } from './settings'
import { GetReducedFields } from '../FacultyAnalysis';

const options = {
    ...commonOptions,
    aspectRatio: 5,
};



export default function StudentsStatusChart({ faculty, cycle, allowedFields }) {

    //converts the result of fetched json to format accepted by chart component
    const convertResult = (json) => {
        const result = { labels: Object.keys(json), datasets: [] }

        if(typeof json[result.labels[0]] !== "undefined") {
            for (let index = 1; index <= json[result.labels[0]].length; index++) {
                result.datasets.push({
                    label: `Próg w cyklu ${index}`,
                    data: [],
                    backgroundColor: colors[index - 1]
                })
            }
        }

        Object.keys(json).forEach(key => {
            json[key].forEach((val, idx) => {
                result.datasets[idx].data.push(val)
            })
        })

        return result
    }

    //TODO usnąć po tym jak będzie możliwosć pobierania
    const fakeData = {
        informatyka: [960, 960, 960, 960],
        elektrotechnika: [890, 870, 840, 840],
        telekomunikacja: [920, 900, 890, 880],
        cyberbezpieczeństwo: [950, 940, 940, 938],
        random: [960, 960, 960, 960],
        org: [890, 870, 840, 840],
        kolejnykierunek: [920, 900, 890, 880],
    }

    //TODO odkomentować i sprawdzić, gdy już będzie gotowy endpoint
    //const [fieldsOfStudyData, loading, error ] = useFetch(`/api/backend/actual_recruitment_faculty_threshold?faculty=${faculty}&cycle=${cycle}`, {}, convertResult)


    return (
        <Card  >
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h5'>CHA-60 WIP</Typography>}
            />
            <CardContent>
                <div >
                    {/* TODO change data to real data */}
                    <Bar data={convertResult(GetReducedFields(fakeData, allowedFields))} options={options} />
                </div>
            </CardContent>

        </Card>
    )
}
