import * as React from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import './selectfield.scss';
const Selectfield=(props)=>{
    const {name, optionList, defaultOption, heading, handleSelectChange, placeholder, value} = props;

    return(
        <>
            <FormControl>
                <Field
                    key={name}
                    placeholde={placeholder}
                    as={Select}
                    name={name}
                    value={value}
                    labelId={`${name}-label`}
                    className="custom-select"
                    fullWidth
                    displayEmpty
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
export default Selectfield;