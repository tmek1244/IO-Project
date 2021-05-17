import { CircularProgress } from '@material-ui/core'
import React from 'react'
import makeStyles from './styles'

const Spinner = () => {
    const classes = makeStyles()

    return (
        <div >
            <CircularProgress className={classes.spinner}/>
        </div>
    )
}

export default Spinner
