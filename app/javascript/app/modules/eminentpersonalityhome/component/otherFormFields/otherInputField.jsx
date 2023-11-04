import * as React from 'react';
import {Formik, Form, Field} from "formik";
import "./otherInputField.scss"
import { TextField , InputAdornment} from '@mui/material';
const OtherInputField=({placeholder, value, onChange, textType, disabled, fieldIndex})=>{

    const onFieldChange = (event) => {
        onChange(event.target.value, '', textType, fieldIndex)
    }

    return(
        <>
            <Field
                disabled={disabled}
                value={value}
                placeholder={placeholder}
                onChange={onFieldChange}
                as={TextField}
                fullWidth
            />
        </>
    )
}
export default OtherInputField;