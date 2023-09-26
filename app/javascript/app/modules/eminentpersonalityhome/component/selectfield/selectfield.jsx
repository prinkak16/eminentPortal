import * as React from 'react';
import {Formik, Form, Field} from "formik";
import "./selectfield.scss"
const Selectfield=({name})=>{
    return(
        <>

                <Field as="select" name={name}>
                    <option value="green">English</option>
                    <option value="blue">Hindi</option>
                </Field>
        </>
    )
}
export default Selectfield;