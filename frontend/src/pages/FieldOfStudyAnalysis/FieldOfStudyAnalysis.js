import React from 'react'
import useFetch from '../../hooks/useFetch';
import { useState } from 'react';
import { MenuItem, Select, FormControl, InputLabel, Grid, Typography, Button, } from '@material-ui/core';

import useStyles from "./styles";

import CandidatesPerPlaceDistriChart from './Charts/CandidatesPerPlaceDistriChart';
import StudentStatusDistriChart from './Charts/StudentStatusDistriChart';
import Students2ndCycleDistriChart from './Charts/Students2ndCycleDistriChart';
import PointsDistriChart from './Charts/PointsDistriChart';
import LaureatesDistriChart from './Charts/LaureatesDistriChart';
import ThresholdDistriChart from './Charts/ThresholdDistriChart';
import SelectSingleFieldComponent from '../../components/SelectSingleField/SelectSingleFieldComponent';
import Spinner from '../../components/Spinner/Spinner';
import CyclesNumDistriChart from './Charts/CyclesNumDistriChart';

import Pdf from "react-to-pdf";

const FieldOfStudyAnalysis = () => {
    var classes = useStyles();

    const [facultyIdx, setFacultyIdx] = useState(0);
    const [cycle, setCycle] = useState(1);
    const [field, setField] = useState();
    const [type, setType] = useState('stacjonarne')

    const onFetch = (response) => {
        setField(response[Object.keys(response)[facultyIdx]][0])
        return response
    }

    const [facultiesStudyFields, loading, error] = useFetch(`api/backend/fields_of_studies/${cycle}/${type}`, [], onFetch)

    const faculties = Object.keys(facultiesStudyFields);
    const allFields = facultiesStudyFields[faculties[facultyIdx]];

    const shortenFaculty = (name) => {
        return name.split(' ').map(part => part[0])
    }
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

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
                            <div className={classes.facultySelector}>
                                <FormControl variant="outlined" fullWidth  >
                                    <InputLabel id="faculty-input-label">Wydział</InputLabel>
                                    <Select
                                        labelId="faculty-input-label"
                                        label="Wydział"
                                        id="faculty-input"
                                        name='faculty'
                                        defaultValue={facultyIdx}
                                        onChange={e => {
                                            setField(0)
                                            setFacultyIdx(e.target.value)
                                        }}
                                    >
                                        {
                                            faculties.map((element, idx) => {
                                                return <MenuItem key={idx} value={idx}>{element}</MenuItem>
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
                            <SelectSingleFieldComponent fields={allFields} setField={setField} />
                        </div>

                        <Pdf targetRef={ref} filename={`historia-rekrutacji-${field}.pdf`} options={pdfOptions}>
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
                                        Historia rekrutacji: {field} {shortenFaculty(faculties[facultyIdx])}, st. {cycle} {capitalizeFirstLetter(type)}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <CandidatesPerPlaceDistriChart faculty={faculties[facultyIdx]} cycle={cycle} field={field} type={type}/>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <ThresholdDistriChart faculty={faculties[facultyIdx]} cycle={cycle} field={field} type={type} />
                                </Grid>
                                <Grid item xs={12}>
                                    <PointsDistriChart faculty={faculties[facultyIdx]} cycle={cycle} field={field} type={type} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <CyclesNumDistriChart faculty={faculties[facultyIdx]} cycle={cycle} field={field} type={type} />
                                </Grid>
                                <Grid item xs={12} md={6} >
                                    {cycle == 1 ?
                                        <LaureatesDistriChart faculty={faculties[facultyIdx]} field={field} type={type} /> :
                                        <Students2ndCycleDistriChart faculty={faculties[facultyIdx]} field={field} type={type} />
                                    }
                                </Grid>
                                <Grid item xs={12}>
                                    <StudentStatusDistriChart faculty={faculties[facultyIdx]} cycle={cycle} field={field} type={type} />
                                </Grid>
                            </Grid>
                        </div>
                    </>
            }
        </>
    )
}

export default FieldOfStudyAnalysis;