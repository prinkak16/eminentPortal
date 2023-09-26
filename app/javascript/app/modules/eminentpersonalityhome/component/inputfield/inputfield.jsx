import * as React from 'react';
import {Formik, Form, Field} from "formik";
import "./inputfield.scss"
const Inputfield=({name,type,placeholder, handlechange, value})=>{
    return(
        <>

            <Field
                type={type}
                name={name}
                placeholder={placeholder}
                onChange={handlechange}
                value={value}
            />
        </>
    )
}
export default Inputfield;