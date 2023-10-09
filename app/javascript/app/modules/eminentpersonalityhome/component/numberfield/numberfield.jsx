import {ErrorMessage, Field} from "formik";
import {TextField} from "@mui/material";
import React from "react";

const NumberField =({id,name,placeholder,onInput,inputProps})=>{
    return(
        <>
            <Field
                id={id}
                type="number"
                name={name}
                as={TextField}
                className="call-log-textfield"
                placeholder={placeholder}
                // onInput={(event) => {
                //     // Remove non-numeric characters and limit the length to 10 characters
                //     event.target.value = event.target.value.replace(/\D/g, '').slice(0, 10);
                // }}
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