import React, {useState} from 'react';
import {useAuthDispatch} from '../../context/AuthContext'
import { loginUser } from '../../context/UserActions';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import { Button, Card, CardContent, CardHeader, Typography } from '@material-ui/core';

function LoginPanel(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    
    const dispatch = useAuthDispatch();
    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            let response = await loginUser(dispatch, {email, password});
            if(!response.user) return;
            
        } catch (error) {
            console.log(error);
        }
    }
    

    const [resetPassword, setResetPasswrd] = useState(false);
    const useStyles = makeStyles((theme) => ({
        root: {
            width: '100%',
            height: '100%',
            flexGrow: 1,
        },
        control: {
            padding: theme.spacing(2),
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
                            title={<Typography variant='h5'> Logowanie </Typography>}
                            style={{ 'backgroundColor': '#fafafa'}}
                        />
                        <CardContent>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Typography wrap="nowrap">{info}</Typography>
                                </Grid>
                                {/* <Grid item xs={0}/> */}

                                <Grid item xs={1}/>
                                <Grid item xs={10}>
                                    <TextField
                                        id="email"
                                        name="email"
                                        label="Email"
                                        variant="outlined"
                                        onChange={(e)=>setEmail(e.target.value)}
                                        fullWidth={true}
                                    />
                                </Grid>
                                <Grid item xs={1}/>
                                
                                <Grid item xs={1}/>
                                <Grid item xs={10}>
                                    <TextField
                                        id="password"
                                        name="password"
                                        label="Hasło"
                                        variant="outlined"
                                        onChange={(e)=>setPassword(e.target.value)}
                                        fullWidth={true}
                                    />
                                </Grid>
                                <Grid item xs={1}/>

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



// return (
//     <div>
//         <div className={{ width: 200 }}>
            
//             {/* {userDetails.errorMessage ? <p>{userDetails.errorMessage}</p> : null} */}

//             <form >
//                 <div>
//                     <div>
//                         <label htmlFor="email">Username</label>
//                         <input type="text" id='email' value={email} onChange={(e) => setEmail(e.target.value)} disabled={false} />
//                     </div>
//                     <div>
//                         <label htmlFor="password">Password</label>
//                         <input type="password" id='password' value={password} onChange={(e) => setPassword(e.target.value)} disabled={false} />
//                     </div>
//                 </div>
//                 <button onClick={handleLogin} disabled={false}>login</button>
//             </form>
//         </div>
//     </div>
// )