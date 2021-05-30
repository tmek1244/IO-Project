import React, { useEffect } from 'react'
import PageTitle from '../../components/PageTitle/PageTitle';
import useFetch from '../../hooks/useFetch';
import { useState } from 'react';
import { MenuItem, Select, FormControl, InputLabel, Grid, Typography, } from '@material-ui/core';

import useStyles from "./styles";

import SelectSingleFieldComponent from '../../components/SelectSingleField/SelectSingleFieldComponent';
import IncomersChart from './Charts/IncomersChart';


// export function GetReducedFields(fieldsLiteral, allowedFields) {
//     return Object.keys(fieldsLiteral)
//         .filter(key => allowedFields.includes(key))
//         .reduce((obj,key) => {
//             obj[key] = fieldsLiteral[key];
//             return obj;
//         }, {});
// }

// export function GetReducedArray(fieldsArray, allowedFields) {
//     return fieldsArray.filter(arr => allowedFields.includes(arr["name"]));
// }

const SpecificYearFieldAnalysis = () => {
    var classes = useStyles();
    
    // trochę tricky, bo zamiast przetrzymywać tu nazwę wydziału przetrzymuję tu numer indeksu w tablicy wydziałów,
    // żeby można było łatwiej przekazywać do potomych komponentów oraz ustawić to jako domyślną wartość w formie
    // w momencie ustalania tego parametru nie mamy jeszcze pobranej listy wydziałów, ale wiemy, że będzie miała co najmniej
    // jeden element oraz będziemy się do niej odwoływać dopiero jak będzie pobrana, czyli loading będzie na false
    const [facultyIdx, setFacultyIdx] = useState(0);
    const [yearIdx, setYearIdx] = useState(0);
    const [cycle, setCycle] = useState(1);
    const [field, setField] = useState();

    const onFacultyFetch = (response) => {
        setField(response[Object.keys(response)[facultyIdx]][0])
        return response
    }
    const onYearsFetch = (response) => {
        return response.sort()
    }
    const [facultiesStudyFields, loading, error] = useFetch(`api/backend/fields_of_studies/${cycle}`, [], onFacultyFetch)
    const [availableYears, loading2, error2] =  useFetch(`api/backend/available-years/`, [], onYearsFetch)

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
                               ZMIEN MNIEEEE
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
                                <div className={classes.facultySelector}>
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

                            </div>
                        </div>

                        <div>
                            <SelectSingleFieldComponent fields={allFields} setField={setField}/> 
                        </div>

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <IncomersChart faculty={faculties[facultyIdx]} cycle={cycle} field={field} year={availableYears[yearIdx]}/>
                            </Grid>
                            {/* <Grid item xs={12} md={6}>
                                {cycle == 1 ? 
                                    <LaureatesDistriChart faculty={faculties[facultyIdx]} field={field}/> :
                                    <Students2ndCycleDistriChart faculty={faculties[facultyIdx]} field={field}/>
                                }
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <PointsDistriChart faculty={faculties[facultyIdx]} cycle={cycle} field={field}/>
                            </Grid>
                            <Grid item xs={12} md={6} >
                                <ThresholdDistriChart faculty={faculties[facultyIdx]} cycle={cycle} field={field}/>
                            </Grid>
                            <Grid item xs={12}>
                                <StudentStatusDistriChart faculty={faculties[facultyIdx]} cycle={cycle} field={field}/>
                            </Grid>
                            <Grid item xs={12}>
                                <FacultyAggregation faculty={faculties[facultyIdx]} cycle={cycle} />
                            </Grid> */}
                        </Grid>
                    </>
            }
        </>
    )
}

export default SpecificYearFieldAnalysis;