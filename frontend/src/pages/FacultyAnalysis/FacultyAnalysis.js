import React from 'react'
import PageTitle from '../../components/PageTitle/PageTitle';
import useFetch from '../../hooks/useFetch';
import { useState } from 'react';
import { MenuItem, Select, FormControl, InputLabel, Grid, Typography, } from '@material-ui/core';
import ThresholdChart from './Charts/ThresholdChart';
import useStyles from "./styles";


const FacultyAnalysis = () => {
    var classes = useStyles();

    const [faculties, loading, error] = useFetch('api/backend/basic-data/faculty', [], json => json.all)

    // trochę tricky, bo zamiast przetrzymywać tu nazwę wydziału przetrzymuję tu numer indeksu w tablicy wydziałów,
    // żeby można było łatwiej przekazywać do potomych komponentów oraz ustawić to jako domyślną wartość w formie
    // w momencie ustalania tego parametru nie mamy jeszcze pobranej listy wydziałów, ale wiemy, że będzie miała co najmniej
    // jeden element oraz będziemy się do niej odwoływać dopiero jak będzie pobrana, czyli loading będzie na false
    const [facultyIdx, setFacultyIdx] = useState(0);
    const [cycle, setCycle] = useState(1);


    //TODO ułożyć ładniej formy do wybierania kierunku i cyklu oraz ogarniczyć rozmiar carda z wykresem 
    return (
        <>
            {
                loading ?
                    <p>loading</p> // TODO zmienić na spinner
                    :
                    <>

                        <div className={classes.pageTitleContainer}>
                            <Typography className={classes.text} variant="h3" size="sm">
                                Podsumowanie wydziału {/* TODO jakoś lepiej by to wypadało nazwać  */}
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
                                            onChange={e => { setFacultyIdx(e.target.value) }}
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

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <ThresholdChart faculty={faculties[facultyIdx]} cycle={cycle} />
                            </Grid>
                          
                        </Grid>
                    </>
            }
        </>
    )
}

export default FacultyAnalysis;