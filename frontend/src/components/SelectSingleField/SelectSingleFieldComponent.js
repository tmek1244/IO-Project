import React from 'react';
// import useStyles from "./styles";
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

function SelectSingleFieldComponent({fields, setField}) {
    // const classes = useStyles();

    const [chosenField, setChosenField] = React.useState(fields[0]);

    const handleFieldsChange = (event) => {
        let name = event.target.checked ?
            event.target.name :
            chosenField

        setChosenField(name)
        setField(name)
    };

    return(
        <>
            <FormControl component="fieldset">
                <FormLabel component="legend">Kierunki</FormLabel>
                <FormGroup>
                    {fields.map((name) => (
                        <FormControlLabel
                            control={<Checkbox checked={chosenField===name} onChange={handleFieldsChange} name={name} color="primary"/>}
                            label={name}
                        />
                    ))}

                </FormGroup>
            </FormControl>
        </>
    );
}

export default SelectSingleFieldComponent; 