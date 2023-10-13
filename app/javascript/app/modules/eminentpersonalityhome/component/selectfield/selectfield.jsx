import * as React from 'react';
import { useState } from 'react';
import {Formik, Form, Field, ErrorMessage} from "formik";
import { Select} from '@mui/material';
import "./selectfield.scss"


const Selectfield=(props)=>{
    const {name, optionList} = props;
    return(
        <>
            <Field as="select" name={name} className="custom-select">
                <option value="">Select Language</option>
                {optionList?.map(item => (
                    <option key={item.id} className="selectOption" value={item.id}>
                        {item.name}
                    </option>
                ))}
            </Field>

        </>
    )
}
export default Selectfield;