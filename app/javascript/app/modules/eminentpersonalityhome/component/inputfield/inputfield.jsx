import * as React from 'react';
import {Formik, Form, Field} from "formik";
import "./inputfield.scss"
import { TextField , InputAdornment} from '@mui/material';
const Inputfield=({name,type,placeholder,endicon, inputprop,maxnumber, validatefield,value, onKeyPress,disabled})=>{

    return(
        <>
            <Field
                disabled={disabled}
                type={type}
                name={name}
                max={maxnumber}
                value={value}
                validate={validatefield}
                placeholder={placeholder}
                InputProps={inputprop}
                onKeyPress={onKeyPress}
                as={TextField}
                    endIcon={endicon}
                fullWidth
            />
        </>
    )
}
export default Inputfield;