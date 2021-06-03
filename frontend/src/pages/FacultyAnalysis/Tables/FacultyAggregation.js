import React from 'react'
import { Card, CardContent } from '@material-ui/core'
import { options, firstCycleColumns, secondCycleColumns } from './FacultyAggregationConfig'
import MUIDataTable from 'mui-datatables'
import useFetch from '../../../hooks/useFetch'


const FacultyAggregation = ({ faculty, cycle, type }) => {

    //TODO odkomentować i sprawdzić, gdy już będzie gotowy endpoint
    const [data, loading, error] = useFetch(`/api/backend/actual_recruitment_faculty_aggregation/faculty=${faculty}&cycle=${cycle}&type=${type}`, [])

    var columns = []
    if(cycle == 1){
        columns = firstCycleColumns
    }
    else {
        columns = secondCycleColumns
    }

    return (
        <MUIDataTable title='Zagreagowane dane' data={data} columns={columns} options={options} />
    )
}

export default FacultyAggregation
