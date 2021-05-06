import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core'
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
    aspectRatio: 5
};

//TODO dodać sensowne kolory w ilości wystarczjącej na wszystkie cykle
const colors = [
    'rgb(27,89,196)', 'rgb(108, 182, 115)', 'rgb(183, 78, 80)',
    'rgb(99, 76, 76)', 'rgb(45, 47, 153)', 'rgb(104, 106, 201)',
]


export default function ThresholdChart({ faculty, cycle }) {

    //converts the result of fetched json to format accepted by chart component
    const convertResult = (json) => {
        const result = { labels: Object.keys(json), datasets: [] }

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
                title={<Typography variant='h5'>Progi na kierunki</Typography>}
            />
            <CardContent>
                <div >
                    {/* TODO change data to real data */}
                    <Bar data={convertResult(fakeData)} options={options} />
                </div>
            </CardContent>

        </Card>
    )
}
