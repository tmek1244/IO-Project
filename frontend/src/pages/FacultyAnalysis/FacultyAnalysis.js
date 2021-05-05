import React from 'react'
import PageTitle from '../../components/PageTitle/PageTitle';
import useFetch from '../../hooks/useFetch';
import { useState } from 'react';
import { MenuItem, Select, FormControl, InputLabel, Grid, } from '@material-ui/core';
import ThresholdChart from './Charts/ThresholdChart';


const FacultyAnalysis = () => {

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

                        <PageTitle title="Podsumowanie wydziału" />
                        <div>
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
                                    <MenuItem key={1} value={1}>Studia pierwszego stopnia</MenuItem>
                                    <MenuItem key={2} value={2}>Studia drugiego stopnia</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        <Grid container spacing={2} >
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