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


export function GetReducedFields(fieldsLiteral, allowedFields) {
    return Object.keys(fieldsLiteral)
        .filter(key => allowedFields.includes(key))
        .reduce((obj,key) => {
            obj[key] = fieldsLiteral[key];
            return obj;
        }, {});
}

export function GetReducedArray(fieldsArray, allowedFields) {
    return fieldsArray.filter(arr => allowedFields.includes(arr["name"]));
}

const FacultyAnalysis = () => {
    var classes = useStyles();

    const [facultiesStudyFields, loading, error] = useFetch('api/backend/fields_of_studies/', [], json => {
        return json
    });
    
    // trochę tricky, bo zamiast przetrzymywać tu nazwę wydziału przetrzymuję tu numer indeksu w tablicy wydziałów,
    // żeby można było łatwiej przekazywać do potomych komponentów oraz ustawić to jako domyślną wartość w formie
    // w momencie ustalania tego parametru nie mamy jeszcze pobranej listy wydziałów, ale wiemy, że będzie miała co najmniej
    // jeden element oraz będziemy się do niej odwoływać dopiero jak będzie pobrana, czyli loading będzie na false
    const [facultyIdx, setFacultyIdx] = useState(0);
    const [cycle, setCycle] = useState(1);
    const [allowedFields, setAllowedFields] = useState([]);

    const faculties = Object.keys(facultiesStudyFields);
    const allFields = facultiesStudyFields[faculties[facultyIdx]];

    return (
        <>
            {
                loading ?
                    <p>loading</p> // TODO zmienić na spinner
                    :
                    <>
                        <div className={classes.pageTitleContainer}>
                            <Typography className={classes.text} variant="h3" size="sm">
                                Podsumowanie: {faculties[facultyIdx]} stopień {cycle}
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
                        </div>

                        <div>
                            <SelectFieldsComponent fields={allFields} setFields={setAllowedFields}/>
                        </div>

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <CandidatesNumChart faculty={faculties[facultyIdx]} cycle={cycle} allowedFields={allowedFields}/>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                {cycle == 1 ? 
                                    <LaureateChart faculty={faculties[facultyIdx]} allowedFields={allowedFields}/> :
                                    <Cycle2ndChart faculty={faculties[facultyIdx]} allowedFields={allowedFields}/>
                                }
                            </Grid>
                            <Grid item xs={12}>
                                <ThresholdChart faculty={faculties[facultyIdx]} cycle={cycle} allowedFields={allowedFields}/>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <AveragesMediansChart faculty={faculties[facultyIdx]} cycle={cycle} allowedFields={allowedFields}/>
                            </Grid>
                            <Grid item xs={12}>
                                <StudentsStatusChart faculty={faculties[facultyIdx]} cycle={cycle} year={"2020"} allowedFields={allowedFields}/>
                            </Grid>
                            <Grid item xs={12}>
                                <FacultyAggregation />
                            </Grid>
                        </Grid>
                    </>
            }
        </>
    )
}

export default FacultyAnalysis;