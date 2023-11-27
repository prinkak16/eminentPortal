import {FormLabel, Grid, TextField, Typography} from "@mui/material";
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
import RadioButton from "./radioButton";
import {
    getAssemblyData,
    getLocationsData,
    getStateData
} from "../../../api/stepperApiEndpoints/stepperapiendpoints";
import NumberField from "../component/numberfield/numberfield";
const ElectoralGovermentMatrix = ({jsonForm, saveData, isEditable,notApplicable, formIndex, setBackDropToggle}) => {
    const [fieldsData, setFieldsData] = useState({});
    const [editField, setEditField] = useState(0);
    const [locationsArray, setLocationsArray] =useState({})
    const [states, setStates] = useState([])
    const [isDataSet, setIsDataSet] = useState(false)

    const getStates = () => {
        setBackDropToggle(true)
        getStateData.then((res) => {
           const respondStates = res.data.data
            setStates(respondStates)
            setLocationsArray((prevFieldsData) => ({
                ...prevFieldsData,
                ['State']: respondStates.map(item => item.name),
            }));
            setBackDropToggle(false)
        })
    }

    useEffect(() => {
        getStates()
    }, []);

    useEffect(() => {
        if (isValuePresent(isEditable)) {
            const updatedFieldsData = { ...fieldsData };
            for (const key in isEditable) {
                if (Object.prototype.hasOwnProperty.call(isEditable, key)) {
                    updatedFieldsData[key] = isEditable[key];
                }
            }
            setEditField(1)
            setFieldsData(updatedFieldsData);
        }
    }, [isEditable]);


    const handleFieldChange = (value, name, valueType) => {
        if (valueType === 'State') {
            let field = jsonForm.fields.find((item) => item.key === 'State')
            let state = states.find((item) => item.name === value)
            if (isValuePresent(field.combo_fields)) {
                resetLocationFields(field.combo_fields[0])
                getLocations(state.id, field.combo_fields[0])
            }
        }
      setData(valueType, value)
    };

    const setData = (valueType, value) => {
        setFieldsData((prevFieldsData) => ({
            ...prevFieldsData,
            [valueType]: value,
        }));
        setIsDataSet(true)
    };

    const handleSave = () => {
        saveData(fieldsData,formIndex)
        setIsDataSet(false)
    }
    useEffect(() => {
        if (isDataSet) {
            handleSave()
        }
    }, [isDataSet]);

    const contestedElection = (value, fieldKey) => {
        setData(fieldKey, value)
    }

    const showField = (isConditional, key, value) => {
        return isConditional ? fieldsData[key] === value : true
    }

   const getLocations = (stateId,field) => {
       if (stateId) {
           setBackDropToggle(true)
           let dataAssembly = `?location_type=State&location_id=${stateId}&required_location_type=${field.key}`;
           getLocationsData(dataAssembly).then((res) => {
               setLocationsArray((prevFieldsData) => ({
                   ...prevFieldsData,
                   [field.key]: res.data.data.locations.map(item => item.name),
               }));
               setBackDropToggle(false)
           })
       }
    }

    const resetLocationFields = (field) => {
        setFieldsData((prevFieldsData) => ({
            ...prevFieldsData,
            [field.key]: '',
        }));
    }

    useEffect(() => {
        let field = jsonForm.fields.find((item) => item.key === 'State')
        if (isValuePresent(field.combo_fields)) {
            let state = states.find((item) => item.name === fieldsData?.State)
            getLocations(state?.id, field?.combo_fields[0])
        }
    }, [fieldsData?.State]);

    const getList = (key) => {
        return  isValuePresent(locationsArray[key]) ? locationsArray[key] : []
    }

    return (
        <div>
            <Grid container className="electoral-matrix-form grid-wrap ">
                {jsonForm.fields && jsonForm.fields.map((f) => (
                    <>
                        {showField(f.is_conditional, f.condition_key, f.condition_value) &&
                        <div className='electoral-form-fields'>
                            {
                                f.type === 'dropdown' &&
                                <Grid item xs={4}>
                                    <FormLabel>{f.name} <mark>*</mark></FormLabel>
                                    <AutoCompleteDropdown
                                        name={f.name}
                                        selectedValue={fieldsData[f.key] || null}
                                        listArray={getList(f.key)}
                                        onChangeValue={handleFieldChange}
                                        dropDownType={f.key}/>
                                    <ErrorMessage name="qualification" style={{color:'red'}} component="p" />
                                </Grid>
                            }
                            {
                                f.type === "textField" &&
                                <Grid item xs={4}>
                                    <FormLabel>{f.name} <mark>*</mark></FormLabel>
                                    <OtherInputField
                                        type="text"
                                        value={fieldsData[f.key] || null}
                                        onChange={handleFieldChange}
                                        textType={f.key}
                                        placeholder={f.placeholder}/>
                                </Grid>
                            }
                            {
                                f.type === "numField" &&
                                <Grid item xs={4}>
                                    <FormLabel>{f.name} <mark>*</mark></FormLabel>
                                    <Field
                                        type="text"
                                        value={fieldsData[f.key] || null}
                                        as={TextField}
                                        className='elec-number-field'
                                        placeholder={f.placeholder}
                                        onChange={(e) => handleFieldChange(e.target.value, f.name ,f.key)}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onInput={(event) => {
                                            event.target.value = event.target.value.replace(/\D/g, '').slice(0, 3);
                                        }}
                                    />
                                </Grid>
                            }
                            {
                                f.type === "radio" &&
                                <Grid item xs={4}>
                                    <FormLabel>{f.name} <mark>*</mark></FormLabel>
                                    <RadioButton radioList={f.list} selectedValue={fieldsData[f.key] || null} onClicked={contestedElection}  fieldKey={f.key}/>
                                </Grid>
                            }
                            {isValuePresent(f.combo_fields) && f.combo_fields.map((fi, index) => (
                                <>
                                    {
                                        fi.type === 'dropdown' &&
                                        <Grid item xs={4}>
                                            <FormLabel>{fi.name} <mark>*</mark></FormLabel>
                                            <AutoCompleteDropdown
                                                name={fi.name}
                                                selectedValue={fieldsData[fi.key] || null}
                                                listArray={getList(fi.key)}
                                                onChangeValue={handleFieldChange}
                                                dropDownType={fi.key}/>
                                            <ErrorMessage name="qualification" style={{color:'red'}} component="p" />
                                        </Grid>
                                    }
                                    {
                                        fi.type === "textField" &&
                                        <Grid item xs={4}>
                                            <FormLabel>{fi.name} <mark>*</mark></FormLabel>
                                            <OtherInputField
                                                type="text"
                                                value={fieldsData[fi.key] || null}
                                                onChange={handleFieldChange}
                                                textType={fi.key}
                                                placeholder={fi.placeholder}/>
                                        </Grid>
                                    }
                                    {
                                        fi.type === "numField" &&
                                        <div  className='d-grid'>
                                            <FormLabel>{f.name}
                                                <mark>*</mark>
                                            </FormLabel>
                                            <NumberField
                                                value={fieldsData[fi.key] || null}
                                                type="text"
                                                textType={fi.key}
                                                placeholder={fi.placeholder}
                                                onChange={(e) => handleFieldChange(e.target.value, fi.name, fi.key)}
                                                onInput={(event) => {
                                                    event.target.value = event.target.value.replace(/\D/g, '').slice(0, 3);
                                                }}
                                            />
                                        </div>
                                    }
                                    {
                                        fi.type === "radio" &&
                                        <Grid item xs={4}>
                                            <FormLabel>{fi.name} <mark>*</mark></FormLabel>
                                            <RadioButton radioList={fi.list}  selectedValue={fieldsData[fi.key] || null} onClicked={contestedElection} fieldKey={f.key} />
                                        </Grid>
                                    }
                                </>
                            ))}
                        </div>
                        }
                    </>
                ))}
            </Grid>
        </div>
    )
}

export default ElectoralGovermentMatrix
