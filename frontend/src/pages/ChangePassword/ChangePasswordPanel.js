import React from 'react';
import { useState } from 'react'
import Grid from '@material-ui/core/Grid';
import { Button, Card, CardContent, CardHeader, Typography, TextField } from '@material-ui/core';
import { useAuthState } from '../../context/AuthContext'
import useStyles from "./styles";


function ChangePasswordPanel(props) {
    const classes = useStyles();
    const authState = useAuthState();
    
    const [old_password, setOld] = useState("");
    const [new_password, setNew] = useState("");
    const [status, setStatus] = useState("");

    const [oldCheck, setOldCheck] = useState(false);
    const [newCheck, setNewCheck] = useState(false);

    const handlePasswordChange = async (e) => {
        try {
            let response = await fetch("/api/user/change_password/", {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authState.access}`,
                },
                body: JSON.stringify({old_password, new_password})
            })
            setStatus(await response.status);
            setOld("");
            if(await response.status==="200") setOldCheck(false);
        }
        catch (error) {
            console.log(error)
        }
    }

    const onKeyUp = (event)  => {
        if(event.charCode === 13 && validate(old_password) && validate(new_password)) {
            handlePasswordChange();
        }
    }

    const validate = (password) => {
        if(password.length < 4) {
            return false;
        }
        return true;
    }

    return (
        <div className={classes.root}>
            <Grid container className={classes.container}>
                <Grid item xs={1} sm={2} lg={4} />
                <Grid item xs={10} sm={8} lg={4} >
                    <Card>
                        <CardHeader 
                            title={<Typography variant='h5' > Zmiana hasła </Typography>}
                            style={{ 'backgroundColor': '#fafafa'}}
                        />
                        <CardContent >
                            <Grid container>
                                <Grid item xs={12} className={(classes.margin, classes.center)}>
                                    {
                                        (status==="400" || status==="500") ?
                                        <Typography
                                            variant='body1'
                                            color='error'
                                            align="center"
                                        >
                                            {(status==="400") ? "Nie zmieniono hasła. Poprawnie wpisałeś stare hasło?" :
                                            "Brak połączenia z serwerem"}
                                        </Typography> :
                                        (status==="200" ?
                                        <Typography
                                            variant='body1'
                                            color='primary'
                                            align="center"
                                        >
                                            Udało się zmienić hasło!
                                        </Typography> :
                                        null)
                                    }
                                </Grid> 
                                <Grid item xs={12} className={classes.margin}>
                                    <TextField
                                        label="Stare hasło"
                                        id="oldPassword"
                                        name="oldPassword"
                                        type="password"
                                        variant="outlined"
                                        value={old_password}
                                        onChange={(e)=>setOld(e.target.value)}
                                        onFocus={(e) => setOldCheck(false)}
                                        onBlur={(e) => setOldCheck(true)}
                                        error={!validate(old_password) && oldCheck}
                                        fullWidth={true}
                                    />
                                </Grid>
                                <Grid item xs={12} className={classes.margin}>
                                    <TextField
                                        label="Nowe hasło"
                                        id="newPassword"
                                        name="newPassword"
                                        type="password"
                                        variant="outlined"
                                        value={new_password}
                                        onChange={(e)=>setNew(e.target.value)}
                                        onKeyPress={onKeyUp}
                                        onFocus={(e)=> setNewCheck(false)}
                                        onBlur={(e)=> setNewCheck(true)}
                                        helperText={validate(new_password)?null:"Hasła muszą mieć przynajmniej 4 znaki"}
                                        error={!validate(new_password) && newCheck}
                                        fullWidth={true}
                                    />
                                </Grid>
                                <Grid item container xs={12} className={classes.button}>
                                    <Button 
                                        className={classes.margin}
                                        variant="contained" 
                                        color="primary" 
                                        onClick={handlePasswordChange} 
                                        disabled={!(validate(old_password) && validate(new_password))}
                                    >
                                        Zmień hasło
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={1} sm={2} lg={4} />
            </Grid>
        </div>
    )
}

export default ChangePasswordPanel;