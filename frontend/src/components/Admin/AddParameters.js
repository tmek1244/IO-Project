import React from 'react';
import { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Button, Card, CardContent, CardHeader, Typography } from '@material-ui/core';
import { useAuthState } from '../../context/AuthContext'
import { DatePicker } from "@material-ui/pickers";
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';


const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
}));


const AddParameters = () => {
    const classes = useStyles();

    const authState = useAuthState()

    const [file, setFile] = useState(null)
    const [fileError, setFileError] = useState(false);
    const [fileSend, setFileSend] = useState(false)
    const [responseOk, setResponseOk] = useState(false);

    const [selectedDate, handleDateChange] = useState(moment());

    const onFileChange = event => {
        setFileError(false)
        setFile(event.target.files[0])
    }


    const validateInput = () => {
        const error = file === null
        setFileError(error)

        return !error
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        if (validateInput()) {
            const formData = new FormData()
            formData.append('file', file)

            console.log(selectedDate.year())
            const year = selectedDate.year()

            fetch(`/api/backend/upload/fields_of_study/${year}/`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${authState.access}`,
                },
                body: formData
            })
                .then(response => {
                    setFileSend(true)
                    if (response.ok) {
                        setFile(null)
                        setResponseOk(true)
                    }
                    else {
                        setResponseOk(false)
                        throw new Error(`Server responsed with status ${response.status}`)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }



    return (
        <Card >
            <CardHeader
                title={<Typography variant='h5'>Wybierz plik csv z parametrami rekrutacji rekrutacji</Typography>}
                style={{ 'textAlign': 'center' }}
            />
            <CardContent>
                <MuiPickersUtilsProvider utils={MomentUtils}>

                    <Grid container spacing={2}>

                        <Grid item >
                            <DatePicker
                                views={["year"]}
                                label="Rok rekrutacji"
                                disableFuture
                                inputVariant="outlined"
                                value={selectedDate}
                                onChange={handleDateChange}
                                style={{ marginLeft: "50%" }}
                            />
                        </Grid>
                        <Grid item>

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
                                    style={{ marginTop: "10px" }}
                                >
                                    Wybierz plik
                                </Button>
                            </label>

                        </Grid>
                        <Grid item xs={12} className={classes.margin} >
                            {
                                fileError ? <p style={{marginLeft: "35%"}} >Należy wybrać plik!</p> : (file !== null && <p style={{marginLeft: "30%"}}>Wybrano plik: {file.name}</p>)
                            }
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                style={{ 'marginLeft': '35%' }}
                            >
                                Wyślij dane
                                    </Button>
                            {fileSend && (responseOk ? <p style={{ 'marginLeft': '35%' }}>Pomyślnie wysłano dane</p> : <p style={{ 'marginLeft': '35%' }}>Nie udało się załadować pliku</p>)}
                        </Grid>

                    </Grid>
                </MuiPickersUtilsProvider >

            </CardContent>
        </Card>
    )

}

export default AddParameters
