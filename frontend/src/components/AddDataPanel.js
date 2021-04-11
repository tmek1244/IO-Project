import React from 'react';
import { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import Grid from '@material-ui/core/Grid';
import { Button, Card, CardContent, CardHeader, Typography, FormControl, Select, MenuItem, InputLabel } from '@material-ui/core';
import MomentUtils from '@date-io/moment';


const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
}));

const cycles = [1, 2, 3, 4, 5, 6]


const AddDataPanel = () => {
    const classes = useStyles();


    const [year, setYear] = useState(new Date())
    const [cycle, setCycle] = useState(cycles[0])
    const [file, setFile] = useState(null)
    const [fileError, setFileError] = useState(false);
    const [responseOk, setResponseOk] = useState(false);

    const onFileChange = event => {
        setFile(event.target.files[0])
    }


    const validateInput = () => {
        const error = file === null
        setFileError(error)

        return !error
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log("submit")
        console.log(validateInput())
        if (validateInput()) {
            const formData = new FormData()
            formData.append('year', year)
            formData.append('cycle', cycle)
            formData.append('file', file)

            fetch('/api/newdata/', {
                method: "POST",
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                body: formData
            })
                .then(response => {
                    if (response.ok) {
                        setFile(null)
                        setCycle(cycles[0])
                        setResponseOk(true)
                    }
                    else {
                        throw new Error(`Server responsed with status ${response.status}`)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }



    return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <Grid item container>
                <Grid item xs={false} sm={1} md={4} />
                <Grid item xs={12} ms={10} md={4}>
                    <Card >
                        <CardHeader
                            title={<Typography variant='h5'> Wprowadź dane dotyczące rekrutacji </Typography>}
                            style={{ 'textAlign': 'center' }}
                        />
                        <CardContent>
                            <Grid container>

                                <Grid item className={classes.margin} style={{ 'marginLeft': '22%' }}>

                                    <DatePicker
                                        views={["year"]}
                                        disableFuture
                                        inputVariant="outlined"
                                        label="Rok rekrutacji"
                                        value={year}
                                        onChange={setYear}
                                    />
                                </Grid>
                                <Grid item className={classes.margin}>

                                    <FormControl variant="outlined" >
                                        <InputLabel id="cycle-input-label" >Cykl</InputLabel>
                                        <Select
                                            labelId="cycle-input-label"
                                            label='Cykl'
                                            id="cycle-input"
                                            name='cycle'
                                            onChange={e => { setCycle(e.target.value) }}
                                            value={cycle}
                                        >
                                            {cycles.map((cycle) => (
                                                <MenuItem key={cycle} value={cycle}>{cycle}</MenuItem>
                                            ))}

                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item className={classes.margin} style={{ "marginLeft": '35%' }}>

                                    <input
                                        color="primary"
                                        accept=".csv, application/vnd.ms-excel"
                                        type="file"
                                        id="icon-button-file"
                                        style={{ display: 'none', }}
                                        onChange={onFileChange}
                                    />
                                    <label htmlFor="icon-button-file">
                                        <Button
                                            variant="contained"
                                            component="span"
                                            color="white"
                                        >
                                            Wybierz plik
                                </Button>
                                    </label>
                                    {
                                        fileError ? <p>Należy wybrać plik!</p> : file !== null && <p>Wybrano plik: {file.name}</p>
                                    }
                                </Grid>
                                <Grid item xs={12} className={classes.margin} >
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSubmit}
                                        style={{ 'marginLeft': '35%' }}
                                    >
                                        Wyślij dane
                                    </Button>
                                    { responseOk && <p style={{'marginLeft': '35%'}}>Pomyślnie wysłano dane</p>}
                                </Grid>

                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={false} sm={1} md={4} />
            </Grid>
        </MuiPickersUtilsProvider >

    )

}

export default AddDataPanel
