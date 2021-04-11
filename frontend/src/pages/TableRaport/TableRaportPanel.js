import React from 'react';
import MUIDataTable from 'mui-datatables'
import { useAuthState } from '../../context/AuthContext'

import PageTitle from '../../components/PageTitle/PageTitle';

import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { Button, Card, CardContent, CardHeader, Grid, MenuItem, Select, Typography } from '@material-ui/core';

import { options, columns, fakeData } from './tableConfig'

const initialFormState = {
    cycle: 1,
    year: 2020,
    recruitment_round: 1,
    faculty: null,
    field_of_study: null,
    status: null,
    first_cycle_faculty: null,
    first_cycle_field_of_study: null
}

const actionType = {
    CYCLE: "CYCLE",
    YEAR: "YEAR",
    RECRUITMENT_ROUND: "RECRUITMENT_ROUND",
    FACULTY: "FACULTY",
    FIELD_OF_STUDY: "FIELD_OF_STUDY",
    STATUS: "STATUS",
    FIRST_CYCLE_FACULTY: "FIRST_CYCLE_FACULTY",
    FIRST_CYCLE_FIELD_OF_STUDY: "FIRST_CYCLE_FIELD_OF_STUDY"
}

const reducer = (state, action) => {
    switch (action.type) {
        case actionType.CYCLE:
            return { ...state, cycle: action.value }
        case actionType.YEAR:
            return { ...state, year: action.value }
        case actionType.RECRUITMENT_ROUND:
            return { ...state, recruitment_round: action.value }
        case actionType.FACULTY:
            return { ...state, faculty: action.value }
        case actionType.FIELD_OF_STUDY:
            return { ...state, field_of_study: action.value }
        case actionType.STATUS:
            return { ...state, status: action.value }
        case actionType.FIRST_CYCLE_FACULTY:
            return { ...state, first_cycle_faculty: action.value }
        case actionType.FIRST_CYCLE_FIELD_OF_STUDY:
            return { ...state, first_cycle_field_of_study: action.value }
    }

}


const TableRaportPanel = () => {

    const [state, dispatch] = React.useReducer(reducer, initialFormState)
    const [data, setData] = React.useState([])
    const authState = useAuthState()

    const [faculties, setFaculties] = React.useState([])

    React.useEffect(() => {
        fetch('api/backend/faculties', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authState.access}`,
            },
        })
        .then(response => response.json())
        .then(json => setFaculties(json))
        .catch(e => console.log(e))
    })


    const handleInputChange = (e, type) => {
        e.preventDefault()
        dispatch({ type: type, value: e.target.value })
        console.log(state)
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        fetch("/api/backend/recruitment-result-overview/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authState.access}`,
            },
            body: JSON.stringify(state)
        })
            .then(response => response.json())
            .then(json => setData(json))
            .catch(e => console.log(e))
    }

    return (
        <>
            <PageTitle title="Podsumowanie rekrutacji" />
            <Card >
                <CardContent>
                    <Grid container >
                        <Grid item xs={false} md={3} />
                        <Grid container item xs={12} md={6} spacing={2}>
                            <Grid item xs={12} md={6}>
                                <FormControl variant="outlined" fullWidth  >
                                    <InputLabel id="cycle-input-label">Stopień</InputLabel>
                                    <Select
                                        labelId="cycle-input-label"
                                        label="Stopień"
                                        id="cycle-input"
                                        name='cycle'
                                        defaultValue={1}
                                        onChange={e => { handleInputChange(e, actionType.CYCLE) }}
                                    >
                                        <MenuItem key={1} value={1}>Studia pierwszego stopnia</MenuItem>
                                        <MenuItem key={2} value={2}>Studia drugiego stopnia</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl variant="outlined" fullWidth >
                                    <InputLabel id="year-input-label">Rok rekrutacji</InputLabel>
                                    <Select
                                        labelId="year-input-label"
                                        label="Rok rekrutacji"
                                        id="year-input"
                                        name='year'
                                        defaultValue={2020}
                                        onChange={e => { handleInputChange(e, actionType.YEAR) }}
                                    >
                                        <MenuItem key={1} value={2020}>{2020}</MenuItem>
                                        <MenuItem key={2} value={2019}>{2019}</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel id="round-input-label">Cykl rekrutacji</InputLabel>
                                    <Select
                                        labelId="round-input-label"
                                        label="Cykl rekrutacji"
                                        id="round-input"
                                        name='round'
                                        onChange={e => { handleInputChange(e, actionType.RECRUITMENT_ROUND) }}
                                    >
                                        <MenuItem key={1} value={1}>{1}</MenuItem>
                                        <MenuItem key={2} value={2}>{2}</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel id="faculty-input-label">Wydział</InputLabel>
                                    <Select
                                        labelId="faculty-input-label"
                                        label="Wydział"
                                        id="faculty-input"
                                        name='faculty'
                                        onChange={e => { handleInputChange(e, actionType.FACULTY) }}
                                    >
                                        {faculties.map((name) => (
                                                <MenuItem key={name} value={name}>{name}</MenuItem>
                                            ))}

                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl variant="outlined" fullWidth >
                                    <InputLabel id="field-of-study-input-label">Kierunek</InputLabel>
                                    <Select
                                        labelId="field-of-study-input-label"
                                        label="Kierunek"
                                        id="field-of-study-input"
                                        name='field-of-study'
                                        onChange={e => { handleInputChange(e, actionType.FIELD_OF_STUDY) }}
                                    >
                                        <MenuItem key={1} value="Informatyka">Informatyka</MenuItem>
                                        <MenuItem key={2} value="Automatyka i Robotyka">Automatyka i Robotyka</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel id="status-input-label">Status</InputLabel>
                                    <Select
                                        labelId="status-input-label"
                                        label="Status"
                                        id="status-input"
                                        name='status'
                                        onChange={e => { handleInputChange(e, actionType.STATUS) }}
                                    >
                                        <MenuItem key={1} value="accepted">Zaakceptowany</MenuItem>
                                        <MenuItem key={2} value="rejected">Odrzucony</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {
                                state.cycle === 2 &&
                                <>
                                    <Grid item xs={12} md={6}>
                                        <FormControl variant="outlined" fullWidth>
                                            <InputLabel id="faculty-input-label">Wydział (1. stopień)</InputLabel>
                                            <Select
                                                labelId="faculty-input-label"
                                                label="Wydział (1. stopień)"
                                                id="faculty-input"
                                                name='faculty'
                                                onChange={e => { handleInputChange(e, actionType.FACULTY) }}
                                            >
                                                <MenuItem key={1} value="WIET">WIET</MenuItem>
                                                <MenuItem key={2} value="WIEAIB">WIEAIB</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl variant="outlined" fullWidth>
                                            <InputLabel id="field-of-study-input-label">Kierunek (1. stopień)</InputLabel>
                                            <Select
                                                labelId="field-of-study-input-label"
                                                label="Kierunek (1. stopień)"
                                                id="field-of-study-input"
                                                name='field-of-study'
                                                onChange={e => { handleInputChange(e, actionType.FIELD_OF_STUDY) }}
                                            >
                                                <MenuItem key={1} value="Informatyka">Informatyka</MenuItem>
                                                <MenuItem key={2} value="Automatyka i Robotyka">Automatyka i Robotyka</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </>
                            }
                            <Grid item container xs={12} direction="column" justify="center">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit}
                                >
                                    Pokaż dane
                         </Button>
                            </Grid>
                        </Grid>
                        <Grid item xs={false} md={3} />
                    </Grid>
                </CardContent>
            </Card>

            {
                data.length !== 0 && <div style={{ "marginTop": "1vw" }}>
                    <MUIDataTable
                        title="Wyniki rekrutacji"
                        data={fakeData}
                        columns={columns}
                        options={options}
                    />

                </div>

            }

        </>
    )

}

export default TableRaportPanel
