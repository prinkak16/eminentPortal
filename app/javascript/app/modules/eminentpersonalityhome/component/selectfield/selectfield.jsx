import * as React from 'react';
import { useState } from 'react';
import {Formik, Form, Field} from "formik";
import { Select} from '@mui/material';
import "./selectfield.scss"
const Selectfield=(props)=>{
    const {name, optionList, } = props;

    return(
        <>
                <Field as="Select"   name={name} className="custom-select">
                    {optionList?.map(item=> {
                        return <option className="selectOption"  value={item}>{item}</option>;
                    })}
                </Field>
        </>
    )
}
export default Selectfield;