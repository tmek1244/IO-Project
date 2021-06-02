import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, Typography, Grid } from '@material-ui/core'
import useFetch from '../../../hooks/useFetch';
import { colors, commonOptions } from './settings'

const options = {
    ...commonOptions,
    aspectRatio: 5,
};


export default function Incomers2DegreeChart({ faculty, cycle, field, year}) {

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
            sortable.push([fof, json[fof]["all"]]);
        }
        sortable.sort(function(a,b) {return b[1]-a[1]});



        const result = {
            labels: sortable.map(function (value,index) { return value[0]; }),
            datasets: [{
                label: "Liczba studentów",
                data: sortable.map(function (value,index) { return value[1]; }),
                backgroundColor: colors,
            }]
        }
        return result;
    }

    
    // const [fieldsOfStudyData, loading, error ] = useFetch(`/api/backend/field-conversion-over-the-years/${faculty}/${field}`, {})
    const loading = undefined
    const fieldsOfStudyData = {
        Informatyka: {
            "all": 120,
            1: 20,
            2: 30,
            3: 50,
            4: 1,
            5: 2
        },
        Elektronika: {
            "all": 90,
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
    }

    return (
        <Card variant="outlined" style={{backgroundColor: "#fcfcfc"}}>
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h5'>Kierunki pierwszego stopnia z których studenci przeszli na {field}</Typography>}
            />
            <CardContent>
                {
                    loading ?
                        <p>ładowanko</p>
                        :
                        <div >
                            <Bar data={convertResult(fieldsOfStudyData)} options={options} />
                        </div>
                }
            </CardContent>
        </Card>
    )
}
