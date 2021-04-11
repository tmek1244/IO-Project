import React from "react";

import { Typography } from '@material-ui/core'

// styles
import useStyles from "./styles";

// components

const PageTitle = (props) => {
    var classes = useStyles();

    return (
        <div className={classes.pageTitleContainer}>
            <Typography className={classes.typo} variant="h3" size="sm">
                {props.title}
            </Typography>
        </div>
    );
}

export default PageTitle