import React from 'react'
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

import useStyles from './styles'


const SidebarLink = ({ id, label, link, icon, isSidebarOpened, location }) => {
    const classes = useStyles()

    const isLinkActive = link && location.pathname === link
    return (
        <ListItem
            button
            component={link && Link}
            to={link}
            className={classes.link}
            classes={{
                root: classNames(classes.linkRoot, {
                    [classes.linkActive]: isLinkActive
                }),
            }}
            disableRipple
        >
            <ListItemIcon
                className={classNames(classes.linkIcon, {
                    [classes.linkIconActive]: isLinkActive,
                })}
            >
                {icon}
            </ListItemIcon>
            <ListItemText
                classes={{
                    primary: classNames(classes.linkText, {
                        [classes.linkTextActive]: isLinkActive,
                        [classes.linkTextHidden]: !isSidebarOpened,
                    }),
                }}
                primary={label}
            />
        </ListItem>
    )

}


export default SidebarLink