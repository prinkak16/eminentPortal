import * as React from 'react';
import {Formik, Form, Field} from "formik";
import "./otherInputField.scss"
import { TextField , InputAdornment} from '@mui/material';
const OtherInputField=({placeholder, value, onChange})=>{

    const onFieldChange = (event) => {
        onChange(event.target.value)
    }

    return(
        <>
            <Field
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