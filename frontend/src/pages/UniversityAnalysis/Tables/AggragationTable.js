import React from 'react'
import MUIDataTable from 'mui-datatables'
import { options, firstCycleColumns, secondCycleColumns } from './AggregationConfig'
import Spinner from '../../../components/Spinner/Spinner'
import Error from '../../../components/Error/Error'
import useFetchPost from '../../../hooks/useFetchPost'

const AggragationTable = ({ year, cycle, type }) => {

    var columns = []
    if (cycle === 1) {
        columns = firstCycleColumns
    }
    else {
        columns = secondCycleColumns
    }

    const payload = {
        year: year,
        study_cycle: cycle,
        type: type,
    }

    const [data, loading, error] = useFetchPost(`/api/backend/recruitment-result-overview/`, payload, [])


    return (
        <>

            {
                loading ?
                    <Spinner />
                    :
                    (
                        error ?
                            <Error />
                            :
                            <MUIDataTable
                                title="Wyniki rekrutacji"
                                data={data}
                                columns={columns}
                                options={options}
                            />
                    )
            }

        </>

    )
}

export default AggragationTable
