import {FormLabel, Grid, Typography} from "@mui/material";
import Inputfield from "../component/inputfield/inputfield";
import {ErrorMessage, Field} from "formik";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import Primarybutton from "../component/primarybutton/primarybutton";
import React, {useEffect, useState} from "react";
import AutoCompleteDropdown from "../simpleDropdown/autoCompleteDropdown";
import OtherInputField from "../component/otherFormFields/otherInputField";
import {v4 as uuidv4} from 'uuid';
import {isValuePresent} from "../../utils";
const ComponentOfFields = ({jsonForm, saveData, isEditable}) => {
    const [fieldsData, setFieldsData] = useState({});
    useEffect(() => {
        if (jsonForm.fields.length > 0) {
            setFieldInitialValue('')
        }
    }, []);

    const setFieldInitialValue = (value) => {
        const keys = jsonForm.fields.map((field) => field.key);
        const initialFieldsData = generateInitialFieldsData(keys, value);
        setFieldsData(initialFieldsData);
    };

    const generateInitialFieldsData = (keys, value) => {
        const initialFieldsData = { id: uuidv4() };
        keys.forEach((key) => {
            initialFieldsData[key] = isValuePresent(value) ? value : '';
        });
        return initialFieldsData;
    };

    useEffect(() => {
        if (isValuePresent(isEditable)) {
            const updatedFieldsData = { ...fieldsData };
            for (const key in isEditable) {
                if (Object.prototype.hasOwnProperty.call(isEditable, key)) {
                    updatedFieldsData[key] = isEditable[key];
                }
            }
            setFieldsData(updatedFieldsData);
        }
    }, [isEditable]);


    const resetFieldsToBlank = () => {
        setFieldsData((prevFieldsData) => {
            const updatedFieldsData = { ...prevFieldsData };
            for (const key in updatedFieldsData) {
                updatedFieldsData[key] = '';
            }
            return updatedFieldsData;
        });
    };
    const handleFieldChange = (value, name, valueType) => {
        setFieldsData((prevFieldsData) => ({
            ...prevFieldsData,
            [valueType]: value,
        }));
    };

    const handleEduStartDateChange = (field) => (date) => {
        handleFieldChange(date.$y, '', field)
    };

    const disabledField = (field) => {
        let value = false
        if (jsonForm.title ===  'Education Details') {
            if (field === 'start_year' || field === 'course') {

                let disabledFields = ['Less than 10th', '10th Pass']
                if (field === 'start_year') {
                    disabledFields.push('12th Pass')
                }
                value = disabledFields.includes(fieldsData.qualification)
            }
        }

        if (field === 'end_year') {
            if (!isValuePresent(fieldsData.start_year) ) {
                value = !isValuePresent(fieldsData.start_year)
            }

            if (disabledField('start_year')) {
                value = !disabledField('start_year')
            }
        }

        if (fieldsData[field] === 'NA') {
          value = true
        }
        return value
    }

    const handleSave = (id) => {
        saveData(jsonForm.title,fieldsData, id)
        resetFieldsToBlank()
    }

    const notApplicableFields = (naType) => (event) => {
        const valueToSet = event.target.checked ? 'NA' : '';
        if (naType === 'all') {
            setFieldInitialValue(valueToSet);
        } else {
            setFieldsData((prevFieldsData) => ({
                ...prevFieldsData,
                [naType]: valueToSet,
            }));
        }
    };

    return (
        <div>
            <Grid container className="educationforms grid-wrap">
                {jsonForm.title === 'Education Details' &&
                    <Grid item xs={12}>
                        <Typography variant="h5" content="h5">
                            Enter your educational detail ( All )
                        </Typography>
                    </Grid>
                }
                {jsonForm.fields && jsonForm.fields.map((f) => (
                    <>
                        {
                            f.type === 'dropdown' &&
                                <Grid item xs={4}>
                                    <FormLabel>{f.name} <sup>*</sup></FormLabel>
                                    <AutoCompleteDropdown
                                        name={f.name}
                                        selectedValue={fieldsData[f.key] || null}
                                        listArray={f.list}
                                        onChangeValue={handleFieldChange}
                                        dropDownType={f.key}/>
                                    <ErrorMessage name="qualification" component="div"/>
                                </Grid>
                        }
                        {
                            f.type === "textField" &&
                                <Grid item xs={4}>
                                    <FormLabel>{f.name} <sup>*</sup></FormLabel>
                                    <OtherInputField
                                        disabled={disabledField(f.key)}
                                        type="text"
                                        value={fieldsData[f.key] || null}
                                        onChange={handleFieldChange}
                                        textType={f.key}
                                        placeholder={f.placeholder}/>
                                </Grid>
                        }
                        {
                            f.type === "date" &&
                            <Grid item xs={4}>
                                <FormLabel fullwidth>{f.name}</FormLabel>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Field name={f.name} value={fieldsData[f.key]} placeholder={f.placeholder}>
                                        {({field}) => (
                                            <DatePicker
                                                disabled={disabledField(f.key)}
                                                label={`Select ${field.name}`}
                                                value={field.value}
                                                onChange={handleEduStartDateChange(f.key)}
                                                views={['year']}
                                            />
                                        )}
                                    </Field>
                                </LocalizationProvider>
                                {f.na_button &&
                                    <div className='date-na-button'>
                                        <span className='na-check-box'>
                                            <input type="checkbox" onClick={notApplicableFields(f.na_type)} />
                                        </span>
                                        <span className='na-check-msg'>
                                            {f.na_massage}
                                        </span>
                                    </div>
                                }
                            </Grid>
                        }
                    </>
                ))}
                <Grid item xs={12}>
                    <Primarybutton addclass="cancelbtn cancel" buttonlabel="Cancel"/>
                    <Primarybutton addclass="nextbtn" handleclick={() => handleSave(fieldsData.id)}
                                   buttonlabel="Save"/>
                </Grid>

            </Grid>
        </div>
    )
}

export default ComponentOfFields
