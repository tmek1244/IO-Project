import React, { useState } from 'react';
import useStyles from "./styles";
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { Typography, MenuItem, Select, Grid, Button } from '@material-ui/core';

import AggragationTable from './Tables/AggragationTable';
import useFetch from '../../hooks/useFetch';
import Spinner from '../../components/Spinner/Spinner';
import FieldsWithTooLittleCandidatesChart from './Charts/FieldsWithTooLittleCandidatesChart';
import NotFullyFilledFieldsChart from './Charts/NotFullyFilledFieldsChart';

import Pdf from "react-to-pdf";

const UniversityAnalysis = () => {
    const classes = useStyles();

    const [cycle, setCycle] = useState(1);
    const [selectedYearIdx, setSelectedYearIdx] = useState(0);
    const [type, setType] = useState("stacjonarne")
    const [years, loading, _error] = useFetch('/api/backend/available-years/', [], json => json.sort((a, b) => b - a)) //sortowaine tablicy w porządku malejącym

    //pdf
    const [format, setFormat] = useState([0,0]);
    const getWidthHeight = () => {
        const container = ref.current;
        if(container !== null) {
            setFormat([container.clientHeight * 0.75625, container.clientWidth * 0.75625]); //dont know why this magic number
        }
    }
    const ref = React.createRef();
    const pdfOptions = {
        orientation: (format[0] > format[1]) ? "p" : "l", //if height > width then portrait, otherwise landscape
        format: format,
        unit: 'pt',
    };

    return (
        <>
            {
                loading ?
                    <Spinner />
                    :
                    <>
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

                        <Pdf targetRef={ref} filename={`podsumowanie-uczelni.pdf`} options={pdfOptions}>
                            {({ toPdf }) => (
                                <Button 
                                    className={classes.margin}
                                    onClick={toPdf} 
                                    onMouseOver={e => getWidthHeight()}
                                    variant="contained"
                                    color="primary"
                                >
                                    Wygeneruj plik Pdf
                                </Button>
                            )}
                        </Pdf>

                        <div id="container" ref={ref}>
                            <Grid container spacing={2}>                          
                                <Grid item xs={12} className={classes.pageTitleContainer}>
                                    <Typography className={classes.text} variant="h3" size="sm">
                                        Podsumowanie uczelni {/* TODO jakoś lepiej by to wypadało nazwać  */}
                                    </Typography>    
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <FieldsWithTooLittleCandidatesChart year={years[selectedYearIdx]} cycle={cycle} type={type} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <NotFullyFilledFieldsChart year={years[selectedYearIdx]} cycle={cycle} type={type} />
                                </Grid>
                                <Grid item xs={12}>
                                    <AggragationTable year={years[selectedYearIdx]} cycle={cycle} type={type}/>
                                </Grid> 
                            </Grid>
                        </div>
                    </>
            }
        </>
    )
}

export default UniversityAnalysis
