import { makeStyles } from '@material-ui/styles';

export default makeStyles(theme => ({
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
        justifyContent: 'center',
        margin: theme.spacing(.5),
    },
    pageTitleContainer: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: theme.spacing(4),
        marginTop: theme.spacing(8),
    },
    text: {
        color: theme.palette.text.hint,
    },
}));