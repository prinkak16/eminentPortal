import * as React from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import './otherSelectField.scss';
const OtherSelectField=(props)=>{
    const {name, optionList, defaultOption, heading, handleSelectChange, placeholder, onChange} = props;

    const onFieldChange = (event) => {
        onChange(event.target.value)
    }
    return(
        <>
            <FormControl>
                <Field
                    placeholde={placeholder}
                    as={Select}
                    name={name}
                    labelId={`${name}-label`}
                    className="custom-select"
                    fullWidth
                    displayEmpty
                    onChange={onFieldChange}
                    inputProps={{ 'aria-label': 'Without label' }}
                >

                    <MenuItem value="">
                        <em>{defaultOption}</em>
                    </MenuItem>
                    {optionList?.map((item) => (
                        <MenuItem key={item.id} value={item.name}>
                            {item.name}
                        </MenuItem>
                    ))}
                </Field>
            </FormControl>
        </>
    )
}
export default OtherSelectField;