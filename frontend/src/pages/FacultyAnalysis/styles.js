import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
  pageTitleContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  formContainer: {
    marginTop: theme.spacing(10),
    display: "flex",
  },
  facultySelector: {
    minWidth: "100px",
    marginRight: "5px"
  },
  cycleSelector: {
    minWidth: "100px",
    marginRight: "5px"
  },
  typeSelector: {
    minWidth: "100px",
    marginRight: "5px"
  },
  text: {
    color: theme.palette.text.hint,
  },
  margin: {
    marginTop: theme.spacing(1.6),
    marginBottom: theme.spacing(2),
  },
}));