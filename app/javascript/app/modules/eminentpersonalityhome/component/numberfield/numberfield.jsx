import {Field} from "formik";
import {TextField} from "@mui/material";
import React from "react";

const NumberField =({id,name,placeholder,onInput,inputProps})=>{
    return(
        <>
            <Field
                id={id}
                type="text"
                name={name}
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