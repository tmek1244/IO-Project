import { makeStyles } from "@material-ui/styles";

const drawerWidth = 240;

export default makeStyles(theme => ({
    menuButton: {
        marginLeft: 12,
        marginRight: 36,
    },
    hide: {
        display: "none",
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: "hidden",
        width: theme.spacing(7) + 40,
        [theme.breakpoints.down("sm")]: {
            width: drawerWidth,
        },
    },
    toolbar: {
        minHeight: 80,
        [theme.breakpoints.down("sm")]: {
            display: "none",
        },
    },
}))