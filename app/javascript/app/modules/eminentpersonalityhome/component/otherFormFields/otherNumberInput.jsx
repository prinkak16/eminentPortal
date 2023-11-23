import {Field} from "formik";
import {TextField} from "@mui/material";
import React from "react";
import {validate} from "uuid";

const OtherNumberField =({id,name,placeholder,onInput,inputProps, onChange, value,disabled})=>{

    const onFieldChange = (event) => {
        onChange(event.target.value)
    }
    return(
        <>
            <Field
                disabled={disabled}
                id={id}
                type="text"
                value={value}
                name={name}
                as={TextField}
                onChange={onFieldChange}
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
export default OtherNumberField;