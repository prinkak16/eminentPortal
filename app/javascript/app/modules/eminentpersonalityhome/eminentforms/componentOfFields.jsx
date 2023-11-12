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
import {isValuePresent, showErrorToast, showSuccessToast, yearToDateConvert} from "../../utils";
import {isDisabled} from "bootstrap/js/src/util";
const dayjs = require('dayjs');
const ComponentOfFields = ({jsonForm, saveData, isEditable,notApplicable, educationsList}) => {
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

    useEffect(() => {
        const valueToSet = notApplicable ? 'NA' : '';
        setFieldInitialValue(valueToSet);
    }, [notApplicable]);

    const generateInitialFieldsData = (keys, value) => {
        const initialFieldsData = { id: '' };
        keys.forEach((key) => {
            initialFieldsData[key] = isValuePresent(value) ? value : '';
        });
        if (jsonForm.title ===  'Education Details') {
            initialFieldsData['highest_qualification'] = false
        }
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
        if (valueType === 'qualification') {
            const disabledFields = ['Less than 10th', '10th Pass'];
            if (disabledFields.includes(value)) {
                fieldsData.start_year = 'NA';
                fieldsData.course = 'NA';
            } else if (value === '12th Pass') {
                fieldsData.start_year = 'NA';
            } else {
                fieldsData.start_year = '';
                fieldsData.course = '';
            }
        }

        setFieldsData((prevFieldsData) => ({
            ...prevFieldsData,
            [valueType]: value,
        }));
    };

    const handleEduStartDateChange = (field) => (date) => {
        handleFieldChange(date.$y, '', field)
    };

    const minDate = (key) =>  {
        let date = new Date(1900, 0, 1)
        if (key === 'end_year') {
            if (isValuePresent(fieldsData.start_year) && fieldsData.start_year !== 'NA') {
                date = new Date(parseInt(fieldsData.start_year), 0, 1)
            }
        }
        return dayjs(date)
    }

    const maxDate = (key) => {
        let date = new Date(2040, 0, 1)
        if (key === 'start_year') {
            date = new Date()
        }
        if (fieldsData.start_year === 'NA') {
            date = new Date()
        }

        return dayjs(date)
    }


    const disabledField = (field) => {
        let value = false
        if (jsonForm.title ===  'Education Details') {
            if (field === 'start_year' || field === 'course') {

                let disabledFields = ['Less than 10th', '10th Pass']
                if (field === 'start_year') {
                    disabledFields.push('12th Pass')
                }
                value = disabledFields.includes(fieldsData.qualification)
                if (value) {
                    fieldsData[field] = 'NA'
                }
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
        for (let key in fieldsData) {
            if (key !== 'id') {
                if (!isValuePresent(fieldsData[key])) {
                    return showErrorToast(`Please enter ${key}`)
                }
            }
        }
        saveData(jsonForm.title,fieldsData, id)
        setFieldInitialValue('')
    }

    const notApplicableFields = (naType, key) => (event) => {
        const valueToSet = event.target.checked ? naType === 'all' ? 'NA' : 'Current Working' : '';
        if (naType === 'all') {
            setFieldInitialValue(valueToSet);
        } else {
            setFieldsData((prevFieldsData) => ({
                ...prevFieldsData,
                [key]: valueToSet,
            }));
        }
    };

    const fieldValue = (key) => {
        return  fieldsData[key]
    }

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
                                        selectedValue={fieldValue(f.key) || null}
                                        listArray={jsonForm.title === 'Education Details' ? educationsList : f.list}
                                        onChangeValue={handleFieldChange}
                                        dropDownType={f.key}/>
                                </Grid>
                        }
                        {
                            f.type === "textField" &&
                                <Grid item xs={4}>
                                    <FormLabel>{f.name} <sup>*</sup></FormLabel>
                                    <OtherInputField
                                        disabled={disabledField(f.key)}
                                        type="text"
                                        value={fieldValue(f.key) || null}
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
                                    <Field name={f.name} value={fieldValue(f.key)} placeholder={f.placeholder}>
                                        {({field}) => (
                                            <DatePicker
                                                disabled={disabledField(f.key)}
                                                label={`Select ${field.name}`}
                                                value={field.value}
                                                disableFuture={f.key === 'start_year'}
                                                onChange={handleEduStartDateChange(f.key)}
                                                views={['year']}
                                                maxDate={maxDate(f.key)}
                                                minDate={minDate(f.key)}
                                            />
                                        )}
                                    </Field>
                                </LocalizationProvider>
                                {f.na_button &&
                                    <div className='date-na-button'>
                                        <span className='na-check-box'>
                                            <input type="checkbox" onClick={notApplicableFields(f.na_type,f.key)} />
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
                {
                    jsonForm.title === 'Education Details' &&
                    <Grid item xs={4}>
                        <FormLabel>Please Select if this is your Highest Qualification <sup>*</sup></FormLabel>
                        <input type='checkbox' value={fieldsData['highest_qualification']}  onChange={(e) =>
                            handleFieldChange(e.target.checked, 'highest_qualification', 'highest_qualification')} />
                    </Grid>
                }
                <Grid item xs={12}>
                    <Primarybutton addclass="cancelbtn cancel" buttonlabel="Cancel" onClick={resetFieldsToBlank}/>
                    <Primarybutton addclass="nextbtn" handleclick={() => handleSave(fieldsData.id)}
                                   buttonlabel="Save"/>
                </Grid>

            </Grid>
        </div>
    )
}

export default ComponentOfFields
