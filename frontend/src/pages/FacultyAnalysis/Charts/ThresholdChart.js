import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core'
import useFetch from '../../../hooks/useFetch';
import { colors, commonOptions } from './settings'
import { GetReducedFields } from '../FacultyAnalysis';
import Spinner from '../../../components/Spinner/Spinner';

const options = {
    ...commonOptions,
    aspectRatio: 5,
};



export default function ThresholdChart({ faculty, cycle, allowedFields, type }) {

    //converts the result of fetched json to format accepted by chart component
    const convertResult = (json) => {
        let reduced = GetReducedFields(json, allowedFields)

        //usuwanie kierunków które nie mają żadnych cykli
        reduced = Object.keys(reduced)
        .filter(key => (reduced[key].length > 0))
        .reduce((obj,key) => {
            obj[key] = reduced[key];
            return obj;
        }, {});

        const result = { labels: Object.keys(reduced), datasets: [] }

        //musimy znaleźć największą liczbę cykli
        let maxCycles = Math.max.apply(null,Object.values(reduced).map(value => { return value.length }))
        for (let index = 1; index <= maxCycles; index++) {
            result.datasets.push({
                label: `Próg w cyklu ${index}`,
                data: [],
                backgroundColor: colors[index - 1]
            })
        }

        Object.keys(reduced).forEach(key => {
            reduced[key].forEach((val, idx) => {
                result.datasets[idx].data.push(val)
            })
        })

        return result
    }

    const [fieldsOfStudyData, loading, error] = useFetch(`/api/backend/actual_recruitment_faculty_threshold/faculty=${faculty}&cycle=${cycle}&type=${type}/`, {})

    return (
        <Card  >
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h5'>Progi na kierunki</Typography>}
            />
            <CardContent>
                {
                    loading ?
                        <Spinner />
                        :
                        <div >
                            <Bar data={convertResult(fieldsOfStudyData)} options={options} />
                        </div>
                }

            </CardContent>

        </Card>
    )
}
