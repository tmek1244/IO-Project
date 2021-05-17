import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
  pageTitleContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(8),
  },
  formContainer: {
    display: "flex",
    justifyContent: "right",
    marginRight: "3%",
    marginTop: "10px",
  },
  dateSelector: {
    minWidth: "100px",
    marginRight: "5px"
  },
  text: {
    color: theme.palette.text.hint,
  },
}));