import React, { useState } from 'react';
import useStyles from "./styles";
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { Typography, MenuItem, Select, Grid } from '@material-ui/core';

import AggragationTable from './Tables/AggragationTable';
import useFetch from '../../hooks/useFetch';
import Spinner from '../../components/Spinner/Spinner';
import NotFilledChart from './Charts/NotFilledChart';


const UniversityAnalysis = () => {
    const classes = useStyles();

    const [cycle, setCycle] = useState(1);
    const [selectedYearIdx, setSelectedYearIdx] = useState(0);
    const [type, setType] = useState("stacjonarne")
    const [years, loading, _error] = useFetch('/api/backend/available-years/', [], json => json.sort((a, b) => b - a)) //sortowaine tablicy w porządku malejącym

    return (
        <>
            {
                loading ?
                    <Spinner />
                    :
                    <>
                        <div className={classes.pageTitleContainer}>
                            <Typography className={classes.text} variant="h3" size="sm">
                                Podsumowanie uczelni {/* TODO jakoś lepiej by to wypadało nazwać  */}
                            </Typography>
                            <div className={classes.formContainer}>
                                <div className={classes.dateSelector}>

                                    <FormControl variant="outlined" fullWidth  >
                                        <InputLabel id="year-input-label">Rok</InputLabel>
                                        <Select
                                            labelId="year-input-label"
                                            label="Rok"
                                            id="year-input"
                                            name='year'
                                            defaultValue={selectedYearIdx}
                                            onChange={e => { setSelectedYearIdx(e.target.value) }}
                                        >
                                            {years.map((year, idx) => {
                                                return <MenuItem key={idx} value={idx}>{year}</MenuItem>
                                            })
                                            }
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className={classes.cycleSelector} >
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
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <NotFilledChart year={years[selectedYearIdx]} cycle={cycle} type={type} />
                            </Grid>
                            <Grid item xs={12}>
                                <AggragationTable year={years[selectedYearIdx]} cycle={cycle} type={type}/>
                            </Grid>
                        </Grid>

                    </>
            }

        </>
    )

}

export default UniversityAnalysis
