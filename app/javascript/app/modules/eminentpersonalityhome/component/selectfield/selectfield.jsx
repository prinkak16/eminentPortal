import * as React from 'react';
import { useState } from 'react';
import {Formik, Form, Field} from "formik";
import "./selectfield.scss"
const Selectfield=(props)=>{
    const {name, optionList, selectedvalues, handleSelectChange} = props;

    return(
        <>

                <Field as="select" value={selectedvalues} onChange={handleSelectChange} name={name}>
                    {optionList?.map(item=> {
                        return <option value={item}>{item}</option>;
                    })}
                </Field>
        </>
    )
}
export default Selectfield;