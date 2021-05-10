import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, Typography, Grid } from '@material-ui/core'
import useFetch from '../../../hooks/useFetch';
import { colors, commonOptions } from './settings'
import { GetReducedFields } from '../FacultyAnalysis';

const options = {
    ...commonOptions,
    aspectRatio: 4,
};

export default function StudentsStatusChart({ faculty, cycle, year, allowedFields }) {

    //converts the result of fetched json to format accepted by chart component
    const convertResult = (json) => {
        const result = { labels: [], datasets: [] }
        
        Object.keys(json).filter(key => key !== "all").forEach(key => {
            result.labels.push('Cykl ' + key)
        })
        
        Object.keys(json[Object.keys(json)[0]]).forEach(key => {
            if(key !== "all") {
                result.datasets.push({
                    label: key,
                    data: [],
                    backgroundColor: colors[Object.keys(json[Object.keys(json)[0]]).indexOf(key)],
                })
            }
        })

        Object.keys(json).forEach( key => {
            if(key !== "all"){
                var stats = json[key]
                Object.keys(stats).forEach (statusKey => {
                    var points = stats[statusKey];
                    result.datasets[
                        Object.keys(stats).indexOf(statusKey)
                    ].data.push(
                        points
                    )
                })
            }
        })

        return result
    }


    //const [fieldsOfStudyData, loading, error ] = useFetch(`/api/backend/status-distribution/${year}/${faculty}/${cycle}/`, {}, e=>e)
    //TODO usnąć po tym jak będzie możliwosć pobierania
    const fieldsOfStudyData = {
        "all": {
            status1: 1000,
            status2: 2000,
        },
        Informatyka: {
            "all": {
                status1: 1000,
                status2: 2100,
            },
            "1": {
                status1: 120,
                status2: 220,
            },
            "2": {
                status1: 130,
                status2: 230,
            },
            "3": {
                status1: 140,
                status2: 240,
            },
            "4": {
                status1: 150,
                status2: 250,
            }
        },
        Elektornika: {
            "all": {
                status1: 1010,
                status2: 20010,
            },
            "1": {
                status1: 10,
                status2: 20,
            },
            "2": {
                status1: 130,
                status2: 20,
            },
            "3": {
                status1: 140,
                status2: 40,
            },
            "4": {
                status1: 10,
                status2: 90,
            }
        }
    }

    return (
        <Card>
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h5'>Status studentów dla danego kierunku w cyklach</Typography>}
            />
            <CardContent>
                <Grid container spacing={1}>

            {Object.keys(GetReducedFields(fieldsOfStudyData, allowedFields)).map((name) => {
                let amount = 1;
                let keys = Object.keys(GetReducedFields(fieldsOfStudyData, allowedFields))
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
            </CardContent>
        </Card>
    )
}
