import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core'
import useFetch from '../../../hooks/useFetch';
import { colors, commonOptions } from './settings'
import { GetReducedFields } from '../FacultyAnalysis';
import Spinner from '../../../components/Spinner/Spinner';
import Error from '../../../components/Error/Error';

const options = {
    ...commonOptions,
    aspectRatio: 5,
};



export default function ThresholdChart({ faculty, cycle, allowedFields, type, year }) {

    const isEmpty = (json) => {
        var empty = true;
        Object.values(json).forEach(val => {
            if(val.length !== 0) {empty = false;}
        })
        return empty;
    }

    //converts the result of fetched json to format accepted by chart component
    const convertResult = (reduced) => {
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

    const [fieldsOfStudyData, loading, error] = useFetch(`/api/backend/actual_recruitment_faculty_threshold/faculty=${faculty}&cycle=${cycle}&type=${type}/${year}`, {})
    let reducedFields = GetReducedFields(fieldsOfStudyData, allowedFields);

    return (
        <Card variant="outlined" style={{backgroundColor: "#fcfcfc"}}>
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h5'>Progi na kierunki</Typography>}
            />
            <CardContent>
                {
                    loading ?
                        <Spinner />
                        :
                        error ?
                            <Error />
                            :
                            isEmpty(reducedFields) ?
                                <CardHeader  style={{ textAlign: 'center' }} title={<Typography variant='h6' color='error'> Brak danych do wyświetlenia. </Typography>} />
                                :
                                <div >
                                    <Bar data={convertResult(reducedFields)} options={options} />
                                </div>
                }

            </CardContent>

        </Card>
    )
}
