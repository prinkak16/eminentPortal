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
import RadioButton from "./radioButton";
import {
    getAssemblyData,
    getLocationsData,
    getStateData
} from "../../../api/stepperApiEndpoints/stepperapiendpoints";
const ElectoralGovermentMatrix = ({jsonForm, saveData, isEditable,notApplicable, formIndex}) => {
    const [fieldsData, setFieldsData] = useState({});
    const [locationsArray, setLocationsArray] =useState({})
    const [states, setStates] = useState([])

    const getStates = () => {
        getStateData.then((res) => {
            setStates(res.data.data)
            setLocationsArray((prevFieldsData) => ({
                ...prevFieldsData,
                ['State']: res.data.data.map(item => item.name),
            }));
        })
    }

    useEffect(() => {
        getStates()
    }, []);

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
        if (valueType === 'State') {
            let field = jsonForm.find((item) => item.key === 'State')
            let state = states.find((item) => item.name === value)
            getLocations(state[0].id, field.combo_fields[0])
        }
        setFieldsData((prevFieldsData) => ({
            ...prevFieldsData,
            [valueType]: value,
        }));
    };

    const handleSave = () => {
        saveData(fieldsData,formIndex)
    }

    const contestedElection = (value, fieldKey) => {
        setFieldsData((prevFieldsData) => ({
            ...prevFieldsData,
            [fieldKey]: value,
        }));
    }

    const showField = (isConditional, key, value) => {
        return isConditional ? fieldsData[key] === value : true
    }

   const getLocations = (stateId,field) => {
       if (stateId) {
           let dataAssembly = `?location_type=State&location_id=${stateId}&required_location_type=${field.key}`;
           getLocationsData(dataAssembly).then((res) => {
               setLocationsArray((prevFieldsData) => ({
                   ...prevFieldsData,
                   [field.key]: res.data.data.locations.map(item => item.name),
               }));
           })
       }
    }


    const getList = (key) => {
        return  isValuePresent(locationsArray[key]) ? locationsArray[key] : []
    }

    useEffect(() => {
        handleSave()
    }, [fieldsData]);

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
                                    <ErrorMessage name="qualification" component="div"/>
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
                                            <ErrorMessage name="qualification" component="div"/>
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
