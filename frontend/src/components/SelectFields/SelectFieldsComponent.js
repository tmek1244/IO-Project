import React from 'react';
import {ToggleButtonGroup, ToggleButton } from '@material-ui/lab'
import useStyles from "./styles";

const SelectFieldsComponent = ({fields, setFields}) => {
    const classes = useStyles();

    const [chosenFields, setChosenFields] = React.useState(() => fields);

    const handleFieldsChange = (event, newChosenFields) => {
        setChosenFields(newChosenFields);
        setFields(newChosenFields);
    };

    return(
        <>
            <ToggleButtonGroup orientation="horizontal" value={chosenFields} onChange={handleFieldsChange}>
                {fields.map((name) => (
                    <ToggleButton 
                        value={name} aria-label={name}
                        classes={{root: classes.toggleFields, selected: classes.selectedToggleFields}}
                    >
                        <p>{name}</p>
                    </ToggleButton>
                    ))}
            </ToggleButtonGroup>
        
        </>
    );
}

export default SelectFieldsComponent;