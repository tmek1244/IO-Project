import React, { useEffect } from 'react'
import PageTitle from '../../components/PageTitle/PageTitle';
import useFetch from '../../hooks/useFetch';
import { useState } from 'react';
import { MenuItem, Select, FormControl, InputLabel, Grid, Typography, } from '@material-ui/core';
import ThresholdChart from './Charts/ThresholdChart';
import useStyles from "./styles";
import LaureateChart from './Charts/LaureateChart';
import FacultyAggregation from './Tables/FacultyAggregation';
import CandidatesNumChart from './Charts/CandidatesNumChart';

import SelectFieldsComponent from './../../components/SelectFields/SelectFieldsComponent';
import AveragesMediansChart from './Charts/AveragesMediandsChart';
import StudentsStatusChart from './Charts/StudentsStatusChart';
import Cycle2ndChart from './Charts/Cycle2ndChart';
import Spinner from '../../components/Spinner/Spinner';
import Error from '../../components/Error/Error';


export function GetReducedFields(fieldsLiteral, allowedFields) {
    return Object.keys(fieldsLiteral)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
            obj[key] = fieldsLiteral[key];
            return obj;
        }, {});
}

const FacultyAnalysis = () => {
    var classes = useStyles();

    const [facultyIdx, setFacultyIdx] = useState(0);
    const [cycle, setCycle] = useState(1);
    const [allowedFields, setAllowedFields] = useState([]);
    const [yearIdx, setYearIdx] = useState(0);
    const [type, setType] = useState("stacjonarne")

    const [facultiesStudyFields, loading, error] = useFetch(`api/backend/fields_of_studies/${cycle}/${type}/`, {});
    const [availableYears, loadingYears, errorYears] = useFetch('/api/backend/available-years/', [], e => e.sort().reverse());
    

    // trochę tricky, bo zamiast przetrzymywać tu nazwę wydziału przetrzymuję tu numer indeksu w tablicy wydziałów,
    // żeby można było łatwiej przekazywać do potomych komponentów oraz ustawić to jako domyślną wartość w formie
    // w momencie ustalania tego parametru nie mamy jeszcze pobranej listy wydziałów, ale wiemy, że będzie miała co najmniej
    // jeden element oraz będziemy się do niej odwoływać dopiero jak będzie pobrana, czyli loading będzie na false

    const faculties = Object.keys(facultiesStudyFields);
    const allFields = facultiesStudyFields[faculties[facultyIdx]];

    const shortenFaculty = (name) => {
        return name.split(' ').map(part => part[0])
    }

    return (
        <>
            {
                loading || loadingYears ?
                    <Spinner />
                    :
                    (
                        error || errorYears ?
                            <Error />
                            :
                            <>
                                <div className={classes.pageTitleContainer}>
                                    <Typography className={classes.text} variant="h3" size="sm">
                                        Podsumowanie: {shortenFaculty(faculties[facultyIdx])} stopień {cycle}
                                    </Typography>
                                    <div className={classes.formContainer}>
                                        <div className={classes.facultySelector}>
                                            <FormControl variant="outlined" fullWidth  >
                                                <InputLabel id="faculty-input-label">Wydział</InputLabel>
                                                <Select
                                                    labelId="faculty-input-label"
                                                    label="Wydział"
                                                    id="faculty-input"
                                                    name='faculty'
                                                    defaultValue={facultyIdx}
                                                    onChange={e => setFacultyIdx(e.target.value)}
                                                >
                                                    {
                                                        faculties.map((element, idx) => {
                                                            return <MenuItem key={idx} value={idx}>{element}</MenuItem>
                                                        })
                                                    }
                                                </Select>
                                            </FormControl>
                                        </div>
                                        <div className={classes.cycleSelector}>
                                            <FormControl variant="outlined" fullWidth  >
                                                <InputLabel id="cycle-input-label">Stopień</InputLabel>
                                                <Select
                                                    labelId="cycle-input-label"
                                                    label="Stopień"
                                                    id="cycle-input"
                                                    name='cycle'
                                                    defaultValue={1}
                                                    onChange={e => { setCycle(e.target.value) }}
                                                >
                                                    <MenuItem key={1} value={1}>I</MenuItem>
                                                    <MenuItem key={2} value={2}>II</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div>
                                        <div className={classes.facultySelector}>
                                            <FormControl variant="outlined" fullWidth  >
                                                <InputLabel id="year-input-label">Rok</InputLabel>
                                                <Select
                                                    labelId="year-input-label"
                                                    label="Rok"
                                                    id="year-input"
                                                    name='year'
                                                    defaultValue={yearIdx}
                                                    onChange={e => setYearIdx(e.target.value)}
                                                >
                                                    {
                                                        availableYears.map((element, idx) => {
                                                            return <MenuItem key={idx} value={idx}>{element}</MenuItem>
                                                        })
                                                    }
                                                </Select>
                                            </FormControl>
                                        </div>
                                        <div className={classes.typeSelector} >
                                            <FormControl variant="outlined" fullWidth  >
                                                <InputLabel id="type-input-label">Typ</InputLabel>
                                                <Select
                                                    labelId="type-input-label"
                                                    label="Typ"
                                                    id="type-input"
                                                    name='type'
                                                    defaultValue={type}
                                                    onChange={e => { setType(e.target.value) }}
                                                >
                                                    <MenuItem key={1} value="stacjonarne">Stacjonarne</MenuItem>
                                                    <MenuItem key={2} value="niestacjonarne">Niestacjonarne</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <SelectFieldsComponent fields={allFields} setFields={setAllowedFields} />
                                </div>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <CandidatesNumChart faculty={faculties[facultyIdx]} cycle={cycle} year={availableYears[yearIdx]} allowedFields={allowedFields} type={type} />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        {cycle == 1 ?
                                            <LaureateChart faculty={faculties[facultyIdx]} allowedFields={allowedFields} type={type} year={availableYears[yearIdx]} /> :
                                            <Cycle2ndChart faculty={faculties[facultyIdx]} year={availableYears[yearIdx]} allowedFields={allowedFields} type={type} />
                                        }
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ThresholdChart faculty={faculties[facultyIdx]} cycle={cycle} allowedFields={allowedFields} type={type} year={availableYears[yearIdx]}/>
                                    </Grid>
                                    <Grid item xs={12} >
                                        <AveragesMediansChart faculty={faculties[facultyIdx]} cycle={cycle} year={availableYears[yearIdx]} allowedFields={allowedFields} type={type} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <StudentsStatusChart faculty={faculties[facultyIdx]} cycle={cycle} year={availableYears[yearIdx]} allowedFields={allowedFields} type={type} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FacultyAggregation faculty={faculties[facultyIdx]} cycle={cycle} type={type} year={availableYears[yearIdx]}/>
                                    </Grid>
                                </Grid>

                            </>
                    )

            }
        </>
    )
}

export default FacultyAnalysis;