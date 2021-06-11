import React from 'react';
import {FormControl, InputLabel, MenuItem, Select} from '@material-ui/core';
import { makeStyles } from "@material-ui/styles";
import { useState } from 'react';

function SelectSingleFieldComponent({fields, setField}) {
    const classes = makeStyles(theme => ({
        facultySelector: {
          minWidth: "100px",
          marginRight: "5px"
        },
    }));

    const [fieldIdx, setFieldIdx] = useState(0);

    React.useEffect(() => {
        setFieldIdx(0);
        setField(fields[0]);
    }, fields);

    const handleFieldsChange = (idx) => {
        setFieldIdx(idx);
        setField(fields[idx]);
    };

    return(
        <div className={classes.facultySelector}>
            <FormControl variant="outlined" fullWidth >
                <InputLabel id="field-input-label">Kierunek</InputLabel>
                <Select
                    labelId="field-input-label"
                    label="Kierunek"
                    id="field-input"
                    name='field'
                    value={fieldIdx}
                    onChange={e => handleFieldsChange(e.target.value)}
                >
                    {
                        fields.map((element, idx) => {
                            return <MenuItem key={idx} value={idx}>{element}</MenuItem>
                        })
                    }
                </Select>
            </FormControl>
        </div>
    );
}

export default SelectSingleFieldComponent; 