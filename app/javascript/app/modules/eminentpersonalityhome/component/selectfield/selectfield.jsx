import * as React from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import './selectfield.scss';
const Selectfield=(props)=>{
    const {name, optionList, defaultOption, heading, handleSelectChange, placeholder} = props;

    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
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