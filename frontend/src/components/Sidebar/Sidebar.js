import React from 'react'
import { Drawer, List } from "@material-ui/core"
import {
    useLayoutState,
} from '../../context/LayoutContext'
import { withRouter } from 'react-router'

import {
    Home as HomeIcon,
    PersonAdd as PersonAddIcon,
    AddBox as AddBoxIcon,
    TableChart as TableChartIcon,
} from '@material-ui/icons'

import SidebarLink from './components/SidebarLink'
import classNames from 'classnames'

import useStyles from './styles'
import { useAuthState } from '../../context/AuthContext'


const Sidebar = ({location}) => {
    const classes = useStyles()

    const sidebarState = useLayoutState()
    const authState = useAuthState()

    var links = [
        { id: 0, label: "Dashboard", link: '/', icon: <HomeIcon /> },
        { id: 1, label: "Dodaj dane", link: '/dodajDane', icon: <AddBoxIcon /> },
        { id: 2, label: "Podsumowanie", link: '/podsumowanie', icon: <TableChartIcon /> },
    ]

    const adminLinks = [
        { id: 3, label: "Dodaj użytkownika", link: '/rejestracja', icon: <PersonAddIcon /> },
    ]
    
    if (authState.is_staff){
        links = links.concat(adminLinks)
    }
      

    return (
        <Drawer
            variant="permanent"
            className={classNames(classes.drawer, {
                [classes.drawerOpen]: sidebarState,
                [classes.drawerClose]: !sidebarState,
            })}
            classes={{
                paper: classNames({
                    [classes.drawerOpen]: sidebarState,
                    [classes.drawerClose]: !sidebarState,
                }),
            }}
            open={sidebarState}
        >
            <div className={classes.toolbar} />

            <List>
                {
                    links.map(link => (
                        <SidebarLink
                            id={link.id}
                            label={link.label}
                            link={link.link}
                            icon={link.icon}
                            isSidebarOpened={sidebarState}
                            location={location}
                        />
                    ))
                }
            </List>
        </Drawer>
    )
}


export default withRouter(Sidebar)
