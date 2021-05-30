//CHA-97

import React from 'react'
import { Line } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core'
import useFetch from '../../../hooks/useFetch';
import { colors, borderColors, commonOptions } from './settings'

const options = {
    ...commonOptions,
    aspectRatio: 3,
};


export default function IncomersChart({ faculty, cycle, field, year}) {

    //this cycle is no degree
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
        //TODO lepszy opis labeli
        if(typeof json[field] !== 'undefined') {
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

            Object.keys(json[field]).forEach( key => {
                var stats = json[field][key]
                Object.keys(stats).forEach (statusKey => {
                    var points = stats[statusKey];
                    result.datasets[Object.keys(stats).indexOf(statusKey)].data.push(points)
                })
            })
            return result;
        }
        return null;
    }

    
    // const [fieldsOfStudyData, loading, error ] = useFetch(`/api/backend/field-conversion-over-the-years/${faculty}/${field}`, {})
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
    console.log(fieldsOfStudyData)

    return (
        <Card  >
            <CardHeader
                style={{ textAlign: 'center' }}
                title={<Typography variant='h5'>Liczba studentów kontynuująca kierunek oraz z zewnątrz</Typography>}
            />
            <CardContent>
            {
                loading ?
                    <p>ładowanko</p>
                    :
                    <div >
                        <Line data={convertResult(fieldsOfStudyData)} options={options} />
                    </div>
            }
            </CardContent>
        </Card>
    )
}
