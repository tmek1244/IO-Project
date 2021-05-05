import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Card , CardHeader, CardContent, Typography} from '@material-ui/core'
import useFetch from '../../../hooks/useFetch';


const options = {
    scales: {
        yAxes: [
            {
                ticks: {
                    beginAtZero: true,
                },
            },
        ],
    },
};

//TODO dodać sensowne kolory w ilości wystarczjącej na wszystkie cykle
const colors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(75, 192, 192)', 'rgb(35, 92, 92)']


export default function ThresholdChart({faculty, cycle}) {

    //converts the result of fetched json to format accepted by chart component
    const convertResult = (json) => {
        const result = { labels: Object.keys(json), datasets: []}

        for (let index = 1; index <= json[result.labels[0]].length; index++) {
            result.datasets.push({
                label: `Próg w cyklu ${index}`,
                data: [],
                backgroundColor: colors[index - 1]
            })
        }
    
        Object.keys(json).forEach(key => {
            json[key].forEach((val, idx) => {
                result.datasets[idx].data.push(val)
            })
        })

        return result
    }
    
    const fakeData = {
        informatyka: [960, 960, 960, 960],
        elektrotechnika: [890, 870, 840, 840],
        telekomunikacja: [920, 900, 890, 880]
    }

    //TODO odkomentować i sprawdzić, gdy już będzie gotowy endpoint
    //const [fieldsOfStudyData, loading, error ] = useFetch(`/api/backend/actual_recruitment_faculty_threshold?faculty=${faculty}&cycle=${cycle}`, {}, convertResult)


    //TODO dodać obsługę ładowania oraz błędu
    return (
        <Card >
            <CardHeader
                title={<Typography variant='h5'>Progi na kierunki</Typography>}
            />
            <CardContent>
                <Bar data={convertResult(fakeData)} options={options}/>
            </CardContent>

        </Card>
    )
}
