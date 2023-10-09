import * as React from 'react';
import {Formik, Form, Field} from "formik";
import "./inputfield.scss"
import { TextField , InputAdornment} from '@mui/material';
const Inputfield=({name,type,placeholder,endicon, inputprop,maxnumber, validatefield})=>{

    return(
        <>
            <Field
                type={type}
                name={name}
                max={maxnumber}
                validate={validatefield}
                placeholder={placeholder}
                InputProps={inputprop}
                onKeyPress={(e) => {
                    const key = e.key;
                    if (!/^[A-Za-z]+$/.test(key)) {
                        e.preventDefault();
                    }
                }}
                as={TextField} 
                    endIcon={endicon}
                fullWidth
            />
        </>
    )
}
export default Inputfield;