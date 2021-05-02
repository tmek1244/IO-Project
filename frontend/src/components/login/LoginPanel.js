import React, {useState} from 'react';
import {useAuthDispatch, useAuthState} from '../../context/AuthContext';
import { loginUser } from '../../context/UserActions';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Button, Card, CardContent, CardHeader, Typography } from '@material-ui/core';
import useStyles from "./styles";

function LoginPanel(props) {
    const classes = useStyles();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailCheck, setEmailCheck] = useState(false);
    const [passwordCheck, setPasswordCheck] = useState(false);
    
    const dispatch = useAuthDispatch();
    const { loading, errorMessage } = useAuthState();


    const validateEmail = () => {
        if(!email) {
            return false;
        }
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(email)) {
          return false;
        }
        return true;
    }

    const validatePassword = () => {
        if(password.length < 4) {
            return false;
        }
        return true;
    }

    const onKeyUp = (event)  => {
        if(event.charCode === 13){ // && validatePassword() && validateEmail()) {
            handleLogin();
        }
    }

    const handleLogin = async (e) => {
        try {
            let response = await loginUser(dispatch, {username:email, password});
            if(!response.access) return;
        } catch (error) {
            console.log(error);
        } 
    }

    const info = "Strona AGH do analizy danych rekrutacyjnych. " + 
                "Jeśli jesteś pracownikiem AGH oraz nie masz jeszcze konta, " +
                "należy skontaktować się z administratorem."

    return (
        <div className={classes.root}>
            <Grid container className={classes.container}>
                <Grid item xs={1} sm={2} lg={4} />
                <Grid item xs={10} sm={8} lg={4} >
                    <Card>
                        <CardHeader 
                            title={<Typography variant='h5' > Logowanie </Typography>}
                            style={{ 'backgroundColor': '#fafafa'}}
                        />
                        <CardContent >
                            <Grid container>
                                <Grid item xs={12} className={(classes.margin, classes.center)}>
                                        <Typography
                                            variant='body1'
                                            color='error'
                                            align="center"
                                        >
                                            {errorMessage ? 
                                            "Nie udało się zalogować. Sprawdź email i hasło." :
                                            null
                                            }
                                        </Typography>
                                </Grid> 
                                <Grid item xs={12} className={classes.margin}>
                                    <TextField
                                        error={!validateEmail() && emailCheck}
                                        id="email"
                                        name="email"
                                        label="Email"
                                        variant="outlined"
                                        onChange={(e)=>setEmail(e.target.value)}
                                        onFocus={(e) => setEmailCheck(false)}
                                        onBlur={(e) => setEmailCheck(true)}
                                        fullWidth={true}
                                        helperText={validateEmail()?null:"Podaj dobry email"}
                                    />
                                </Grid>
                                <Grid item xs={12} className={classes.margin}>
                                    <TextField
                                        error={!validatePassword() && passwordCheck}
                                        id="password"
                                        name="password"
                                        type="password"
                                        label="Hasło"
                                        onKeyPress={onKeyUp}
                                        onChange={(e)=>setPassword(e.target.value)}
                                        onFocus={(e)=> setPasswordCheck(false)}
                                        onBlur={(e)=> setPasswordCheck(true)}
                                        helperText={validatePassword()?null:"Hasło musi mieć przynajmniej 4 znaki"}
                                        variant="outlined"
                                        fullWidth={true}
                                    />
                                </Grid>
                                <Grid item container xs={12} className={classes.button}>
                                    <Button 
                                        className={classes.margin}
                                        variant="contained" 
                                        color="primary" 
                                        onClick={handleLogin} 
                                        // disabled={!(validateEmail() && validatePassword()) || loading}  //comment this line out to be able to login via non-email usernames
                                    >
                                        login
                                    </Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography wrap="nowrap" variant='body2'>{info}</Typography>
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

export default LoginPanel;
