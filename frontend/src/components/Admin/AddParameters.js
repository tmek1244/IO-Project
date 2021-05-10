import React from 'react';
import { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Button, Card, CardContent, CardHeader, Typography } from '@material-ui/core';
import { useAuthState } from '../../context/AuthContext'


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

        if (validateInput()) {
            const formData = new FormData()
            formData.append('file', file)



            fetch('/api/backend/upload/fields_of_study/2020/', {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${authState.access}`,
                },
                body: formData
            })
                .then(response => {
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
                <Grid container>

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
                        {responseOk && <p style={{ 'marginLeft': '35%' }}>Pomyślnie wysłano dane</p>}
                    </Grid>

                </Grid>
            </CardContent>
        </Card>
    )

}

export default AddParameters
