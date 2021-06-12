import React from 'react';
import useStyles from "./styles";
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
function SelectFieldsComponent({fields, setFields}) {
    const classes = useStyles();

    const [chosenFields, setChosenFields] = React.useState([fields]);

    React.useEffect(() => { 
        if (!fields.includes(chosenFields[0]) && chosenFields.length !== 0) {
            setChosenFields(fields)
            setFields(fields)
        }
    });

    const handleFieldsChange = (event) => {
        let arr = (event.target.checked ?
                [...chosenFields, event.target.name] :
                chosenFields.filter(name => name !== event.target.name)
            ).filter(name => fields.includes(name));

        setChosenFields(arr);
        setFields(arr);
    };
        
    return(
        <div className={classes.container}>
            <FormControl component="fieldset">
                <FormLabel component="legend">Kierunki:</FormLabel>
                <FormGroup row={true}>
                    {fields.map((name) => (
                        <FormControlLabel
                            control={<Checkbox checked={chosenFields.includes(name)} onChange={handleFieldsChange} name={name} color="primary"/>}
                            label={name}
                        />
                    ))}
                </FormGroup>
            </FormControl>
        </div>
    );
}

export default SelectFieldsComponent;