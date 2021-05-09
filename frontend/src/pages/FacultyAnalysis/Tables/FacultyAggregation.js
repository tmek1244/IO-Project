import React from 'react'
import { Card, CardContent } from '@material-ui/core'
import { options, columns } from './FacultyAggregationConfig'
import MUIDataTable from 'mui-datatables'
import useFetch from '../../../hooks/useFetch'


const FacultyAggregation = ({ faculty, cycle }) => {

    const fakeData = [
        { year: 2021, field_of_study: "Informatyka", recruitment_round: 1, treshold: 960, mean: 920, median: 900, candidates_no: 10.0, laureate_no: 100, signed_in: 310, not_signed_in: 10, resigned: 0, under_treshold: 623 },
        { year: 2021, field_of_study: "Informatyka", recruitment_round: 2, treshold: 960, mean: 920, median: 900, candidates_no: 10.0, laureate_no: 100, signed_in: 310, not_signed_in: 10, resigned: 0, under_treshold: 623 },
        { year: 2021, field_of_study: "Elektronika", recruitment_round: 1, treshold: 960, mean: 920, median: 900, candidates_no: 10.0, laureate_no: 100, signed_in: 310, not_signed_in: 10, resigned: 0, under_treshold: 623 },

    ]

    //TODO odkomentować i sprawdzić, gdy już będzie gotowy endpoint
    const [data, loading, error] = useFetch(`/api/backend/actual_recruitment_faculty_aggregation?faculty=${faculty}&cycle=${cycle}`, [])


    return (
        <MUIDataTable title='Zagreagowane dane' data={fakeData} columns={columns} options={options} />
    )
}

export default FacultyAggregation
