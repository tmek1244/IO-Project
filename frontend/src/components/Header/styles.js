import { makeStyles } from "@material-ui/styles";


export default makeStyles(theme => ({
    logo: {
        marginLeft: theme.spacing(10),
        marginRight: theme.spacing(10),
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    headerIcon: {
        fontSize: 35,
    }
}));
