import React from 'react'
import { Drawer, List, Divider } from "@material-ui/core"
import {
    useLayoutState,
} from '../../context/LayoutContext'
import { withRouter } from 'react-router'

import {
    Home as HomeIcon,
    PersonAdd as PersonAddIcon,
    AddBox as AddBoxIcon,
    TableChart as TableChartIcon,
    FormatUnderlined as DragHandleIcon,
    Equalizer as EqualizerIcon,
    Timeline as TimelineIcon,
    LinearScale as LinearScaleIcon,
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
        { id: 1, label: "Podsumowanie", link: '/podsumowanie', icon: <TableChartIcon /> },
        { id: 2, label: "Wydział", link: '/podsumowanie_wydzial', icon: <EqualizerIcon /> },
        { id: 3, label: "Kierunek", link: '/podsumowanie_kierunek', icon: <TimelineIcon /> },
        { id: 4, label: "Rekrutacja", link: '/podsumowanie_roku', icon: <LinearScaleIcon /> },
        { id: 5, label: "Zmień hasło", link: '/haslo', icon: <DragHandleIcon /> },
        { id: 6, label: "Dodaj dane", link: '/dodajDane', icon: <AddBoxIcon /> },
    ]

    const adminLinks = [
        { id: 7, label: "Administracja", link: '/administracja', icon: <PersonAddIcon /> },
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
                    links.map(link =>  {
                        let component = 
                            <SidebarLink
                                id={link.id}
                                label={link.label}
                                link={link.link}
                                icon={link.icon}
                                isSidebarOpened={sidebarState}
                                location={location}
                            />

                        if(link.id == 5) {
                            return (
                                <>
                                    <Divider />
                                    {component}
                                </>
                            )
                        }
                        else return component
                    })
                }
            </List>
        </Drawer>
    )
}


export default withRouter(Sidebar)
