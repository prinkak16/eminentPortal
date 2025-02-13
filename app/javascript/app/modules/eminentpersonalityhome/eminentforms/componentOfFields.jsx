import {FormLabel, Grid, Typography} from "@mui/material";
import Inputfield from "../component/inputfield/inputfield";
import {ErrorMessage, Field} from "formik";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import Primarybutton from "../component/primarybutton/primarybutton";
import React, {useEffect, useInsertionEffect, useState} from "react";
import AutoCompleteDropdown from "../simpleDropdown/autoCompleteDropdown";
import OtherInputField from "../component/otherFormFields/otherInputField";
import {v4 as uuidv4} from 'uuid';
import {
    mobileView,
    educationDetailsJson, isMobileUser,
    isValuePresent,
    showErrorToast,
    showSuccessToast,
    yearToDateConvert
} from "../../utils";
import {isDisabled} from "bootstrap/js/src/util";
import './componentOfFIelds.scss'

import dayjs from "dayjs";
import {DemoContainer} from "@mui/x-date-pickers/internals/demo";
const ComponentOfFields = ({jsonForm, saveData, isEditable,notApplicable, educationsList = [], isViewDisabled, professionList = [], showProfessionForm, showEducationForm, showPoliticalForm, showOtherPartyForm}) => {
    const [fieldsData, setFieldsData] = useState({});
    const [resetYear, setResetYear] = useState(false)
    const [isNaButtonExist, setIsNaButtonExist] = useState(false)
    const [disabledFields, setDisabledFields] = useState([])
    const [currentlyWorking, setCurrentlyWorking] = useState(false)

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
        return initialFieldsData;
    };

    useEffect(() => {
        if (jsonForm?.title ===  'Education Details') {
            handleFieldChange(false,'', 'highest_qualification' )
        } else if ( jsonForm.title === 'Profession Profile') {
            handleFieldChange(false,'', 'main_profession' )
        }
    }, []);


    useEffect(() => {
        if (isValuePresent(isEditable)) {
            setResetYear(true)
            const updatedFieldsData = { ...fieldsData };
            for (const key in isEditable) {
                if (Object.prototype.hasOwnProperty.call(isEditable, key)) {
                    updatedFieldsData[key] = isEditable[key];
                }
            }
            setFieldsData(updatedFieldsData);
            if (jsonForm.title === 'Profession Profile') {
                setCurrentlyWorking(updatedFieldsData.end_year === 'Current Working')
            }
            setResetYear(false)
        }
    }, [isEditable]);

    const resetFieldsToBlank = () => {
        setCurrentlyWorking(false)
        setFieldsData((prevFieldsData) => {
            const updatedFieldsData = { ...prevFieldsData };
            for (const key in updatedFieldsData) {
                updatedFieldsData[key] = '';
            }
            return updatedFieldsData;
        });
        setResetYear(true)

       if(showProfessionForm){
           showProfessionForm(false);
       }
       else if(showEducationForm) {
           showEducationForm(false);
       }
       else if(showPoliticalForm){
           showPoliticalForm(false);
       }
       else{
           showOtherPartyForm(false);
       }
    };

    // const resetFormData=()=>{
    //     setFieldsData({'name':'amit'});
    // }



    useEffect(() => {
        if (resetYear) {
            setResetYear(false)
        }

    }, [resetYear]);


    const handleFieldChange = (value, name, valueType) => {
        if (valueType === 'profession') {
            setFieldsData({})
        }

        if (valueType === 'qualification') {

            const fields = []
            const disabledFields = ['Less than 10th', '10th Pass'];
            if (disabledFields.includes(value)) {
                fields.push('start_year','course')
                fieldsData.start_year = '-';
                fieldsData.course = '-';
            } else if (value === '12th Pass') {
                fields.push('start_year')
                fieldsData.start_year = '-';
            } else {
                fieldsData.start_year = '';
                fieldsData.course = '';
            }
            setDisabledFields(fields)
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
            if (isValuePresent(fieldsData.start_year) && fieldsData.start_year !== '-') {
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
        if (fieldsData.start_year === '-') {
            date = new Date()
        }

        return dayjs(date)
    }


    const disabledField = (key) => {
        let value = disabledFields.includes(key)
        if (key === 'end_year') {
            value = !disabledFields.includes('start_year')
        }

        if (key === 'end_year' && value) {
            value = !isValuePresent(fieldsData.start_year)
        }

        if (key === 'end_year') {
            if (jsonForm.title === 'Profession Profile') {
                value = currentlyWorking
            }
        }

        return value
    }


    const handleSave = (id) => {
        const formValue = fieldsData
        if (jsonForm?.title ===  'Education Details') {
            if (!formValue.hasOwnProperty('highest_qualification')) {
                formValue['highest_qualification'] = false
            }
        } else if ( jsonForm.title === 'Profession Profile') {
            if (!formValue.hasOwnProperty('main_profession')) {
                formValue['main_profession'] = false
            }
        }

        for (let key in formValue) {
            if (key !== 'id') {
                if (!isValuePresent(formValue[key]) && formValue[key] !== false) {
                 const item = jsonForm.fields.find((item) => item.key === key)
                    if (item.isRequired) {
                        return showErrorToast(`Please enter ${key}`)
                    }
                }
                if (key === 'start_year') {
                    if (parseInt(formValue[key]) < 1900 ) {
                        return showErrorToast(`Start Year Should be greater then start year 1900`)
                    }
                }

                if (key === 'end_year' && formValue.end_year !== '-') {
                    if (isValuePresent(formValue.end_year)) {
                        if (formValue.start_year > formValue.end_year) {
                            return showErrorToast(`End Year Should be greater then start year ${formValue.start_year}`)
                        }
                    }
                }
            }
        }
        saveData(jsonForm.title,formValue, id)
        resetFieldsToBlank()
    }

    const notApplicableFields = (naType, key) => (event) => {
        const valueToSet = event.target.checked ? naType === 'all' ? '-' : 'Current Working' : '';
        setCurrentlyWorking(event.target.checked)
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

    const requiredField = (state) => {
        return isValuePresent(state) ? <mark>*</mark> : ''
    }

    const getList = (e) => {
        let list = []
        if (jsonForm.title === 'Education Details') {
            if (e.key === 'qualification'){
            list = educationsList }
            if(e.key === 'university'){
                list = [];
            }
            if (e.key === 'college'){
                list = [];
            }
        } else if (jsonForm.title === 'Profession Profile') {
            list = professionList
        }
        return list
    }

    return (
        <div>
            <Grid container className={`educationforms ${isMobileUser ? '' :'grid-wrap'}`}>
                {jsonForm.title === 'Education Details' &&
                    <Grid item xs={12}>
                        <Typography variant="h6" content="h6">
                            Enter your educational detail ( All )
                        </Typography>
                    </Grid>
                }
                {jsonForm.fields && jsonForm.fields.map((f) => (
                    <>
                        {
                            f.type === 'dropdown' &&
                            <Grid item xs={mobileView()}>
                                <FormLabel>{f.name} {requiredField(f.isRequired)}</FormLabel>
                                <div className='components-dropdown'>
                                    <AutoCompleteDropdown
                                        disabled={isViewDisabled}
                                        name={f.name}
                                        selectedValue={fieldValue(f.key) || null}
                                        listArray={isValuePresent(getList(f)) ? getList(f) : f.list}
                                        onChangeValue={handleFieldChange}
                                        dropDownType={f.key}/>
                                </div>
                            </Grid>
                        }
                        {
                            f.type === "textField" &&
                            <Grid item xs={mobileView()}>
                                    <FormLabel>{f.name} {requiredField(f.isRequired)}</FormLabel>
                                    <div style={{marginTop:'7px'}}>
                                        <OtherInputField
                                            disabled={disabledField(f.key) || isViewDisabled}
                                            type="text"
                                            value={fieldValue(f.key) || null}
                                            onChange={handleFieldChange}
                                            textType={f.key}
                                            placeholder={f.placeholder}/>
                                    </div>

                                </Grid>
                        }
                        { !resetYear &&
                            f.type === "date" &&
                            <Grid item xs={mobileView()} className='d-grid'>
                                    <FormLabel fullwidth>{f.name} {requiredField(f.isRequired)}</FormLabel>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} style={{width: '100%', marginTop: '-5px'}}>
                                        <DemoContainer components={['DatePicker']} style={{width: '100%'}} sx={{width: '100%'}}>
                                            <DatePicker
                                                label={f.name}
                                                isRequired={isValuePresent(f?.isRequired)}
                                                disabled={disabledField(f.key) || isViewDisabled}
                                                value={isValuePresent(fieldValue(f.key)) && fieldValue(f.key) !== '-' && fieldValue(f.key) !== 'Current Working' ? dayjs(`${fieldValue(f.key)}-01-01`) : null}
                                                maxDate={maxDate(f.key)}
                                                onChange={handleEduStartDateChange(f.key)}
                                                minDate={minDate(f.key)}
                                            views={['year']}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                    {f.na_button === true || isNaButtonExist ?
                                        <div className='date-na-button' style={{visibility: isNaButtonExist === true && f.key === 'start_year' ? 'hidden' : ''}}>
                                            {!isNaButtonExist ? setIsNaButtonExist(true): null }
                                            <span className='na-check-box'>
                                                <input disabled={isViewDisabled} type="checkbox" checked={currentlyWorking} onClick={notApplicableFields(f.na_type, f.key)}/>
                                             </span>
                                            <span className='na-check-msg'>
                                                {f.na_massage}
                                            </span>
                                        </div>
                                        : null
                                    }
                                </Grid>
                        }
                    </>
                ))}
                {
                    jsonForm.title === 'Education Details' &&
                    <Grid item xs={4} style={{minWidth: '27rem', display: 'flex', gap: '0.8rem'}}>
                        <FormLabel className='mr-1 main-edu-text' >Please Select if this is your Highest Qualification </FormLabel>
                        <input disabled={isViewDisabled} type='checkbox' checked={fieldsData['highest_qualification']}  onChange={(e) =>
                            handleFieldChange(e.target.checked, 'highest_qualification', 'highest_qualification')} />
                    </Grid>
                }

                {
                    jsonForm.title === 'Profession Profile' &&  <Grid item xs={4} className='d-grid'> </Grid>}
                {
                    jsonForm.title === 'Profession Profile' &&
                    <Grid item xs={mobileView()} style={{minWidth: '27rem', display: 'flex', gap: '0.8rem'}}>
                        <FormLabel className='mr-1 main-edu-text'>Please Select if this is your Main Profession </FormLabel>
                        <input disabled={isViewDisabled} type='checkbox' checked={fieldsData['main_profession']}  onChange={(e) =>
                            handleFieldChange(e.target.checked, 'main_profession', 'main_profession')} />
                    </Grid>
                }
                <Grid item xs={12}>
                    <Primarybutton disabled={isViewDisabled} addclass="cancelbtn cancel" buttonlabel="Cancel" handleclick={() => resetFieldsToBlank()} />
                    <Primarybutton disabled={isViewDisabled} addclass="nextbtn" handleclick={() => handleSave(fieldsData.id)}
                                   buttonlabel="Save"/>
                </Grid>

            </Grid>
        </div>
    )
}

export default ComponentOfFields
