import * as React from 'react';
import {Formik, Form, Field} from "formik";
import "./inputfield.scss"
import { TextField , InputAdornment} from '@mui/material';
const Inputfield=({name,type,placeholder,endicon, inputprop,maxnumber})=>{
    return(
        <>
            <Field

                type={type}
                name={name}
                max={maxnumber}
                placeholder={placeholder}
                InputProps={inputprop}
                as={TextField} 
                    endIcon={endicon}
                fullWidth

            />
        </>
    )
}
export default Inputfield;