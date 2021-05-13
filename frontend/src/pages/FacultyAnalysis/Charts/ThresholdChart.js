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



export default function ThresholdChart({ faculty, cycle, allowedFields }) {

    //converts the result of fetched json to format accepted by chart component
    const convertResult = (json) => {
        // json = GetReducedFields(json, allowedFields) // komentuję jak wszędzie

        const result = { labels: Object.keys(json), datasets: [] }

        if (typeof json[result.labels[0]] !== "undefined") { // czemu tak jest?
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

    const [fieldsOfStudyData, loading, error] = useFetch(`/api/backend/actual_recruitment_faculty_threshold/faculty=${faculty}&cycle=${cycle}/`, {}, convertResult)


    return (
        <Card  >
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h5'>Progi na kierunki</Typography>}
            />
            <CardContent>
                {
                    loading ?
                        <p>ładowanko</p>
                        :
                        <div >
                            {console.log(fieldsOfStudyData)}
                            <Bar data={fieldsOfStudyData} options={options} />
                        </div>
                }

            </CardContent>

        </Card>
    )
}
