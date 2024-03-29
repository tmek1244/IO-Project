import React from 'react';
import { useState } from 'react'
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { Button, Card, CardContent, CardHeader, MenuItem, Select, Typography } from '@material-ui/core';

import { useAuthState } from '../../context/AuthContext'
import useFetch from '../../hooks/useFetch'


export default function AddNewUserPanel() {
    const [newUserData, setNewUserData] = useState({
        'first_name': null,
        'last_name': null,
        'faculty': null,
        'email': null,
        'is_staff': null
    })
    const [errorForm, setErrorForm] = useState({
        'first_name': false,
        'last_name': false,
        'faculty': false,
        'email': false,
        'is_staff': false
    })

    const [userCreated, setUserCreated] = useState(null)


    const [faculties, loading, error] = useFetch('api/backend/faculties', [])



    const authState = useAuthState()

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setNewUserData({
            ...newUserData,
            [name]: value
        })
    }

    const validateInput = () => {
        var allCorrect = true
        const newValues = {}
        Object.keys(newUserData).forEach(key => {
            if (newUserData[key] === null) {
                allCorrect = false
                newValues[key] = true
            }
            else {
                newValues[key] = false
            }
        })
        setErrorForm(newValues)
        return allCorrect
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (validateInput()) {

            const body = { ...newUserData }
            body.is_staff = newUserData.is_staff === 'admin' ? true : false



            fetch('api/user/register/', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authState.access}`,
                },
                body: JSON.stringify(body)
            })
                .then(response => {
                    if (response.ok) setUserCreated(true)
                    else {
                        setUserCreated(false)
                        throw new Error("Coulnd't create user")
                    }
                }
                )
                .catch(e => console.log(e))
        }
    }

    return (
        <Card >
            <CardHeader
                title={<Typography variant='h5'> Dodaj użytkownika </Typography>}
                style={{ 'textAlign': 'center' }}
            />
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={false} sm={2} />
                    <Grid item xs={12} sm={12} md={4}>
                        <TextField
                            id='first_name-input'
                            name='first_name'
                            error={errorForm.frist_name}
                            label='Imię'
                            variant="outlined"
                            onChange={handleInputChange}
                            fullWidth={true}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <TextField
                            id='last_name-input'
                            name='last_name'
                            error={errorForm.last_name}
                            label='Nazwisko'
                            variant="outlined"
                            fullWidth={true}
                            onChange={handleInputChange}

                        />
                    </Grid>
                    <Grid item xs={false} sm={1} />
                    <Grid item xs={false} sm={2} />

                    <Grid item xs={12} sm={12} md={9} >
                        <FormControl variant="outlined" error={errorForm.faculty} style={{ "width": "89%" }} >
                            <InputLabel id="faculty-input-label">Wydział</InputLabel>
                            <Select
                                labelId="faculty-input-label"
                                label="Wydział"
                                id="faculty-input"
                                name='faculty'
                                onChange={handleInputChange}
                            >
                                {faculties.map((name) => (
                                    <MenuItem key={name} value={name}>{name}</MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={false} sm={2} />
                    <Grid item xs={12} md={5} >
                        <TextField
                            id='email-input'
                            name='email'
                            error={errorForm.email}
                            label='E-mail'
                            variant="outlined"
                            fullWidth={true}
                            onChange={handleInputChange}
                        />
                    </Grid>

                    <Grid item xs={12} md={3} >
                        <FormControl variant="outlined" style={{ "width": "100%" }} >
                            <InputLabel id="role-input-label">Rola</InputLabel>
                            <Select
                                labelId="role-input-label"
                                label="Rola"
                                id="role-input"
                                error={errorForm.is_staff}
                                name='is_staff'
                                onChange={handleInputChange}
                            >
                                <MenuItem key='admin' value='admin'>Administrator</MenuItem>
                                <MenuItem key='user' value='user'>Użytkownik</MenuItem>

                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item sm={2} />
                    <Grid item sm={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            style={{ 'marginLeft': '40%' }}
                        >
                            Dodaj użytkownika
                         </Button>
                        {userCreated && <p style={{ 'color': 'green' }}>Stworzono użytkownika</p>}
                        {userCreated === false && <p style={{ 'color': 'red' }}>Nie stworzono użytkownika</p>}

                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}


