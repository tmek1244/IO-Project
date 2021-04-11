import { makeStyles } from "@material-ui/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";


// const useStyles = makeStyles({
//     toolbar: {
//         background: 'primary',
//         minHeight: '100px',
//         textAlign: 'center'
//     },
//     logo: {
//         marginLeft: '10%'
//     },
//     title: {
//         marginLeft: '30%'
//     }
// })

export default makeStyles(theme => ({
    logo: {
        marginLeft: theme.spacing(10),
        marginRight: theme.spacing(10),
    },
    appBar: {
        width: "100vw",
        zIndex: theme.zIndex.drawer + 1,
    },
    title: {
        marginLeft: theme.spacing(50)
    },
    grow: {
        flexGrow: 1,
    },
    toolbar: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
    hide: {
        display: "none",
    },
    grow: {
        flexGrow: 1,
    },
    headerMenuButton: {
        marginLeft: theme.spacing(2),
        padding: theme.spacing(0.5),
    },
    headerIcon: {
        fontSize: 35,
    }
}));
