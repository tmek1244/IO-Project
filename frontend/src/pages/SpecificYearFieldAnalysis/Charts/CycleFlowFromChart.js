import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, Typography, Grid } from '@material-ui/core'
import useFetch from '../../../hooks/useFetch';
import { colors, commonOptions } from './settings'

const options = {
    ...commonOptions,
    aspectRatio: 5,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false,
      },
    },
};


export default function CycleFlowFromChart({ faculty, cycle, field, year, type}) {

    const modifyJsonStructure = (json) => {
        //find max cycle num
        let maxKey = Object.keys(json)[0];
        let maxCycle = 0;
        Object.keys(json).forEach(k => {
            delete json[k].all
            let tmp = Math.max.apply(null, Object.keys(json[k]))
            if (tmp > maxCycle) {
                maxCycle = tmp;
                maxKey= k;
            }
        })

        //change json structure so highest hierarchy is cycle then faculties
        let newJson = {};
        for(let i = 1; i<=maxCycle; i++) {
            newJson[i] = {}
            Object.keys(json).forEach(k => {
                if(typeof json[k][i] !== 'undefined') {
                    newJson[i][k] = json[k][i] 
                }
            })
        }
        return newJson
    }

    const convertResult = (json) => {
        //sort
        var sortable = [];
        for(var fof in json) {
            sortable.push([fof, json[fof]]);
        }
        sortable.sort(function(a,b) {return b[1]-a[1]});

        const result = {
            labels: sortable.map(function (value,index) { return value[0]; }),
            datasets: [{
                data: sortable.map(function (value,index) { return value[1]; }),
                backgroundColor: colors,
            }]
        }
        return result;
    }

    
    const [fieldsOfStudyData2, loading2, error ] = useFetch(`api/backend/same-year-field-conversion/${year}/${faculty}/${field}/${type}/${cycle}/`, {})
    console.log(fieldsOfStudyData2)
    const loading = undefined
    const fieldsOfStudyData = modifyJsonStructure({
        Informatyka: {
            "all": 100,
            1: 20,
            2: 30,
            3: 50,
            4: 1,
            5: 2
        },
        Elektronika: {
            "all": 100,
            1: 2,
            2: 3,
            3: 5,
            4 : 1
        },
        Gornictwo: {
            "all": 100,
            1: 20,
            2: 30,
            3: 50,
            5: 2
        },
    })

    return (
        <Card variant="outlined" style={{backgroundColor: "#fefefe"}}>
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h6'>Z jakich kierunków studenci zrezygnowali aplikując na {field}</Typography>}
            />
            <CardContent>
            {
                loading ?
                    <p>ładowanko</p>:
                    <Grid container spacing={1}>
                    {Object.keys(fieldsOfStudyData).map((name) => {
                        return(
                        <Grid item xs={12}>
                            <Card variant="outlined">
                            <CardHeader
                                style={{ textAlign: 'center', backgroundColor: "#fcfcfc", paddingBottom:0, paddingTop:5}}
                                title={<Typography variant='subtitle1'>Cykl {name}</Typography>}
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
