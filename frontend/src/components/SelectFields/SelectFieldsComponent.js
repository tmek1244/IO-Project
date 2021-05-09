import React from 'react';
import useStyles from "./styles";
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import {ToggleButtonGroup, ToggleButton } from '@material-ui/lab'
import FormHelperText from '@material-ui/core/FormHelperText';

const SelectFieldsComponent = ({fields, setFields}) => {
    const classes = useStyles();

    const [chosenFields, setChosenFields] = React.useState(() => fields);

    const handleFieldsChange = (event) => {
        let arr;
        if(event.target.checked) {
            arr = [
                ...chosenFields,
                event.target.name
            ]
        } else {
            arr = chosenFields.filter(name => name !== event.target.name)
        }
        setChosenFields(arr);
        setFields(arr);
        
    // const handleFieldsChange = (event, newChosenFields) => {
        // setChosenFields(newChosenFields);
        // setFields(newChosenFields);
    };

    return(
        <>
            {/* <ToggleButtonGroup orientation="horizontal" value={chosenFields} onChange={handleFieldsChange}>
                {fields.map((name) => (
                    <ToggleButton 
                        value={name} aria-label={name}
                        classes={{root: classes.toggleFields, selected: classes.selectedToggleFields}}
                    >
                        <p>{name}</p>
                    </ToggleButton>
                    ))}
            </ToggleButtonGroup> */}

            <FormControl component="fieldset">
                <FormLabel component="legend">Kierunki</FormLabel>
                <FormGroup>
                    {fields.map((name) => (
                        <FormControlLabel
                            control={<Checkbox checked={chosenFields.includes(name)} onChange={handleFieldsChange} name={name} color="primary"/>}
                            label={name}
                        />
                    ))}
                    
                </FormGroup>
            </FormControl>
        
        </>
    );
}

export default SelectFieldsComponent;