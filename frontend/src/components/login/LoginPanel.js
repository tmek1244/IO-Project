import React, {useState} from 'react';
import {useAuthDispatch} from '../../context/AuthContext';
import { loginUser } from '../../context/UserActions';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import { Button, Card, CardContent, CardHeader, Typography } from '@material-ui/core';

function LoginPanel(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [rememberMe, setRememberMe] = useState(false); TODO: add
    
    const dispatch = useAuthDispatch();

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
        if(!password) {
            return false;
        }
        return true;
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            let response = await loginUser(dispatch, {username:email, password});
            if(!response.access) return;

            
        } catch (error) {
            console.log(error);
        }
    }
    

    const useStyles = makeStyles((theme) => ({
        root: {
            width: '100%',
            height: '100%',
            flexGrow: 1,
        },
        control: {
            padding: theme.spacing(2),
        },
        margin: {
            margin: theme.spacing(1),
        },
        typography: {
            info1: {
                fontSize: 100,
            },
        },
    }));
    const classes = useStyles();

    const info = "Strona AGH do analizy danych rekrutacyjnych. " + 
                "Jeśli jesteś pracownikiem AGH oraz nie masz jeszcze konta, " +
                "należy skontaktować się z administratorem."

    return (
        <div className={classes.root}>
            <Grid container alignItems="center">
                <Grid item xs={1} sm={3} lg={4} />
                <Grid item xs={10} sm={6} lg={4} >
                    <Card>
                        <CardHeader 
                            title={<Typography variant='h5' > Logowanie </Typography>}
                            style={{ 'backgroundColor': '#fafafa'}}
                        />
                        <CardContent >
                            <Grid container>
                                <Grid item xs={12} item className={classes.margin}>
                                    <TextField
                                        id="email"
                                        name="email"
                                        label="Email"
                                        variant="outlined"
                                        onChange={(e)=>setEmail(e.target.value)}
                                        fullWidth={true}
                                    />
                                </Grid>

                                {validateEmail() ? null : <p> Podaj dobry adres</p>}

                                <Grid item xs={12} item className={classes.margin}>
                                    <TextField
                                        id="password"
                                        name="password"
                                        label="Hasło"
                                        variant="outlined"
                                        onChange={(e)=>setPassword(e.target.value)}
                                        fullWidth={true}
                                    />
                                </Grid>

                                <Button item className={classes.margin}
                                    variant="contained" 
                                    color="primary" 
                                    onClick={handleLogin} 
                                    disabled={false}>
                                        login
                                 </Button>

                                <Grid item xs={12}>
                                    <Typography wrap="nowrap" variant='caption'>{info}</Typography>
                                </Grid>

                            </Grid>
                            
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={1} sm={3} lg={4} />
            </Grid>
        </div>
    )
}

export default LoginPanel;
