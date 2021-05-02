import React from 'react'
import { AppBar, Grid, IconButton, Toolbar, Typography } from '@material-ui/core'
import { ReactComponent as Logo } from '../../static/logo/logo.svg'
// import HeaderDropdownMenu from './HeaderDropdownMenu'
import { useAuthDispatch } from '../../context/AuthContext.js';
import { logoutUser } from '../../context/UserActions.js';
import { Link, withRouter } from 'react-router-dom'
import {
    Menu as MenuIcon,
    ArrowBack as ArrowBackIcon,
    ExitToApp as ExitToAppIcon
} from "@material-ui/icons";
import {
    useLayoutState,
    useSidebarToggle
} from '../../context/LayoutContext'

import useStyles from './styles'
import classNames from 'classnames'


const Header = () => {
    const classes = useStyles()

    const sidebarState = useLayoutState()
    const sidebarToggle = useSidebarToggle()

    const dispatch = useAuthDispatch();


    return (
        <AppBar position='fixed' className={classes.appBar}>
            <Toolbar >
                <Grid container spacing={2}>
                    <Grid item  container xs={4} >
                        <IconButton
                            color="inherit"
                            onClick={() => sidebarToggle(!sidebarState)}
                        >
                            {
                                sidebarState ?
                                    <ArrowBackIcon classes={{
                                        root: classNames(
                                            classes.headerIcon
                                        )
                                    }} />
                                    :
                                    <MenuIcon classes={{
                                        root: classNames(
                                            classes.headerIcon
                                        )
                                    }} />

                            }
                        </IconButton>
                        <Link to='/' className={classes.logo}>
                            <Logo />
                        </Link>
                    </Grid>

                    <Grid item container xs={4} alignContent='center' justify='center'>
                        <Typography variant='h3' >Rekrutacja AGH</Typography>
                    </Grid>
                    <Grid item container xs={4} aligntContent='right' justify='flex-end'>
                        <IconButton
                            color="inherit"
                            onClick={() => logoutUser(dispatch)}

                        >
                            <ExitToAppIcon classes={{
                                root: classNames(
                                    classes.headerIcon
                                )
                            }} />
                        </IconButton>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    )
}

export default withRouter(Header)