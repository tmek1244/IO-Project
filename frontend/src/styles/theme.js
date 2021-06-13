import { createMuiTheme } from "@material-ui/core"


export const theme = createMuiTheme({
    palette: {
        primary: {
            // main: 'rgba(27,89,196,1)'
            main: '#046582 '
        }
    },
    overrides: {
        MUIDataTableBodyCell: {
            root: {
                textAlign: "center",
            }
        },
       
    }
})