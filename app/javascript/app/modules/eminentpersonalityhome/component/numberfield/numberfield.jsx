import {Field} from "formik";
import {TextField} from "@mui/material";
import React from "react";

const NumberField =({id,name,placeholder,onInput,inputProps, value})=>{
    return(
        <>
            <Field
                id={id}
                type="text"
                name={name}
                value={value}
                as={TextField}
                className="call-log-textfield"
                placeholder={placeholder}
                onInput={onInput}
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={inputProps}
            />
        </>
    )
}
export default NumberField;