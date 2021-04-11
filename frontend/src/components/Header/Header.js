import React from 'react'
import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core'
import { ReactComponent as Logo } from '../../static/logo/logo.svg'
// import HeaderDropdownMenu from './HeaderDropdownMenu'
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



    return (
        <AppBar position='fixed' className={classes.appBar}>
            <Toolbar className={classes.toolBar}>
                <IconButton
                    color="inherit"
                    onClick={() => sidebarToggle(!sidebarState)}
                    className={classNames(
                        classes.headerMenuButtonSandwich,
                        classes.headerMenuButtonSandwich
                    )}
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
                <div classNames={classes.grow}></div>
                <Typography className={classes.title} variant='h3' >Rekrutacja AGH</Typography>

                <IconButton
                    color="inherit"
                    onClick={() => console.log("dodaj wylogowanie proszę :)")}
                    classes={{
                        root: classNames(
                            classes.headerIcon
                        )
                    }}
                >
                    <ExitToAppIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}

export default withRouter(Header)