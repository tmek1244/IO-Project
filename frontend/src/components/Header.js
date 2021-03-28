import React from 'react'
import { AppBar, Toolbar, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { ReactComponent as Logo } from '../static/logo/logo.svg'
import HeaderDropdownMenu from './HeaderDropdownMenu'
import { Link } from 'react-router-dom'

const useStyles = makeStyles({
    header: {
        background: 'primary',
        minHeight: '100px',
        textAlign: 'center'
    },
    logo: {
        marginLeft: '10%'
    },
    title: {
        marginLeft: '30%'
    }
})


const Header = () => {
    const classes = useStyles()
    return (
        <AppBar position='static'>
            <Toolbar className={classes.header}>
                <Link to='/' className={classes.logo}>
                    <Logo />
                </Link>
                <Typography className={classes.title} variant='h3' >Rekrutacja AGH</Typography>
                <HeaderDropdownMenu />
            </Toolbar>
        </AppBar>
    )
}

export default Header