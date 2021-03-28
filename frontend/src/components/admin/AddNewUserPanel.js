import React from 'react';
import { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { Button, Card, CardContent, CardHeader, MenuItem, Select, Typography } from '@material-ui/core';


const faculites = [
    'Wydział Górnictwa i Geoinżynierii',
    'Wydział Inżynierii Metali i Informatyki Przemysłowej',
    'Wydział Elektrotechniki, Automatyki, Informatyki i Inżynierii Biomedycznej',
    'Wydział Informatyki, Elektroniki i Telekomunikacji',
    'Wydział Inżynierii Mechanicznej i Robotyki',
    'Wydział Geologii, Geofizyki i Ochrony Środowiska',
    'Wydział Geodezji Górniczej i Inżynierii Środowiska',
    'Wydział Inżynierii Materiałowej i Ceramiki',
    'Wydział Odlewnictwa',
    'Wydział Metali Nieżelaznych',
    'Wydział Wiertnictwa, Nafty i Gazu',
    'Wydział Zarządzania',
    'Wydział Energetyki i Paliw',
    'Wydział Fizyki i Informatyki Stosowanej',
    'Wydział Matematyki Stosowanej',
    'Wydział Humanistyczny'
]

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
}));

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

    const classes = useStyles();

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
            if (newUserData[key] === null){
                console.log(key)
                allCorrect = false
                newValues[key] = true    
            }
            else{
                newValues[key] = false
            }
        })
        setErrorForm(newValues)
        return allCorrect
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if(validateInput()){
            
            const body = { ...newUserData}
            body.is_staff = newUserData.is_staff === 'admin' ? true : false

            fetch('/api/register/', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
        }
    }

    return (
        <Card style={{ 'marginTop': '5%' }}>
            <CardHeader
                title={<Typography variant='h5'> Wprowadź dane użytkownika </Typography>}
                style={{ 'textAlign': 'center' }}
            />
            <CardContent>
                <Grid container >
                    <Grid item xs={false} sm={2}  />
                    <Grid item className={classes.margin} xs={12} sm={12} md={4}>
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
                    <Grid item className={classes.margin} xs={12} sm={12} md={4}>
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

                    <Grid item xs={12} sm={12} md={9} className={classes.margin} >
                        <FormControl variant="outlined" error={errorForm.faculty} style={{ "width": "90.5%" }} >
                            <InputLabel id="faculty-input-label">Wydział</InputLabel>
                            <Select
                                labelId="faculty-input-label"
                                id="faculty-input"
                                name='faculty'
                                onChange={handleInputChange}
                            >
                                {faculites.map((name) => (
                                    <MenuItem key={name} value={name}>{name}</MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={false} sm={2} />
                    <Grid item xs={12} md={5} className={classes.margin}>
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

                    <Grid item xs={12} md={3} className={classes.margin}>
                        <FormControl variant="outlined" style={{ "width": "100%" }} >
                            <InputLabel id="role-input-label">Rola</InputLabel>
                            <Select
                                labelId="role-input-label"
                                id="role-input"
                                error={errorForm.role}
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
                            style={{ 'marginLeft': '45%'}}
                        >
                            Dodaj użytkownika
                         </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>

    )
}


