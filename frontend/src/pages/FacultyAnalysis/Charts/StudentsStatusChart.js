import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, Typography, Grid } from '@material-ui/core'
import useFetch from '../../../hooks/useFetch';
import { colors, commonOptions } from './settings'
import { GetReducedFields } from '../FacultyAnalysis';
import Spinner from '../../../components/Spinner/Spinner';
import Error from '../../../components/Error/Error';

const options = {
    ...commonOptions,
    aspectRatio: 4,
};

export default function StudentsStatusChart({ faculty, cycle, year, allowedFields, type }) {

    const convertResult = (json) => {
        const result = { labels: [], datasets: [] }

        Object.keys(json).filter(key => key !== "all").forEach(key => {
            result.labels.push('Cykl ' + key)
        })

        const acceptedDataset = {
            label: "Zaakceptowani",
            data: [],
            backgroundColor: colors[0],
        }

        const rejectedDataset = {
            label: "Odrzuceni",
            data: [],
            backgroundColor: colors[1],
        }

        const signedDataset = {
            label: "Zapisani",
            data: [],
            backgroundColor: colors[2],
        }
        
        const unregisteredDataset = {
            label: "Wypisali się",
            data: [],
            backgroundColor: colors[3],
        }

        Object.values(json).forEach(cycleResult => {
            acceptedDataset.data.push(cycleResult.accepted)
            rejectedDataset.data.push(cycleResult.rejected)
            signedDataset.data.push(cycleResult.signed)
            unregisteredDataset.data.push(cycleResult.unregistered)
        })

        result.datasets.push(acceptedDataset, rejectedDataset, signedDataset, unregisteredDataset)
        return result
    }

    const [fieldsOfStudyData, loading, error ] = useFetch(`/api/backend/status-distribution/${year}/${faculty}/${cycle}/${type}`, {})
    let reducedFields = GetReducedFields(fieldsOfStudyData, allowedFields);

    return (
        <Card>
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h5'>Status studentów dla danego kierunku w cyklach</Typography>}
            />
            <CardContent>
                {
                    loading ? <Spinner /> : error ? <Error /> :
                        reducedFields && Object.keys(reducedFields).length === 0 ?
                            <CardHeader  style={{ textAlign: 'center' }} title={<Typography variant='h6' color='error'> Brak danych do wyświetlenia. </Typography>} />
                            :
                            <Grid container spacing={1}>    
                                {Object.keys(reducedFields).map((name) => {
                                    let amount = 1;
                                    let keys = Object.keys(reducedFields)
                                    if(keys.indexOf(name) == keys.length - 1 && keys.length % 2 == 1) {
                                            amount = 2;
                                        }
                                    return(
                                    <Grid item xs={12} md={6*amount}>
                                        <Card variant="outlined">
                                        <CardHeader
                                            style={{ textAlign: 'center', backgroundColor: "#fcfcfc", paddingBottom:0, paddingTop:5}}
                                            title={<Typography variant='subtitle1'>{name}</Typography>}
                                        />
                                        <CardContent style={{backgroundColor: "#fcfcfc",padding:0}}>
                                            <Bar data={convertResult(fieldsOfStudyData[name])} options={options} />
                                        </CardContent>
                                        </Card>
                                    </Grid>)
                                })}
                            </Grid>
                }
            </CardContent>
        </Card>
    )
}
