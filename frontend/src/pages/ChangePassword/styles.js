import { makeStyles } from '@material-ui/styles';

export default makeStyles(theme => ({
    container: {
        height: "40vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        top: 0,
        left: 0,
    },
    center: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    control: {
        padding: theme.spacing(2),
    },
    margin: {
        margin: theme.spacing(1),
    },
    typography: {
        info1: {
            fontSize: 100,
        },
    },
    button: {
        justifyContent:'center',
        margin: theme.spacing(.5),
    },
}));