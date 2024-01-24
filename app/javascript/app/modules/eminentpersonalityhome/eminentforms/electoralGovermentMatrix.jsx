import {FormLabel, Grid, TextField} from "@mui/material";
import {ErrorMessage, Field} from "formik";
import React, {useEffect, useState} from "react";
import AutoCompleteDropdown from "../simpleDropdown/autoCompleteDropdown";
import OtherInputField from "../component/otherFormFields/otherInputField";
import {isMobileUser, isValuePresent, ministerPortfolioArray, mobileView} from "../../utils";
import RadioButton from "./radioButton";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {getLocationsData, getStateData} from "../../../api/stepperApiEndpoints/stepperapiendpoints";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import DeleteIcon from "@mui/icons-material/Delete";

const ElectoralGovermentMatrix = ({jsonForm, saveData, isEditable , formIndex, setBackDropToggle, electionTypeChange, isViewDisabled,resetFormIndex}) => {
    const [fieldsData, setFieldsData] = useState({});
    const [ministriesField, setMinistriesFields] = useState([]);
    const [editField, setEditField] = useState(0);
    const [locationsArray, setLocationsArray] =useState({})
    const [states, setStates] = useState([])
    const [isDataSet, setIsDataSet] = useState(false)
    const ministriesKey = ['designation','ministry_name', 'ministry_duration']
    const ministryPortfolioObject = {
        designation: '', // Set your default values or leave them empty
        ministry_name: '',
        ministry_duration: '',
    };
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
        if (isValuePresent(isEditable) && editField === 0) {
            const updatedFieldsData = { ...fieldsData };
            for (const key in isEditable) {
                if (Object.prototype.hasOwnProperty.call(isEditable, key)) {
                    updatedFieldsData[key] = isEditable[key];
                }
            }
            setEditField(1)
            setFieldsData(updatedFieldsData);
            const portFolio = updatedFieldsData.minister_portfolio_array
            if (isValuePresent(portFolio) && portFolio.length > 1) {
              for (let i = 0; i < portFolio.length -1; i++) {
                  setMinistriesFields(prevMinistriesField => [...prevMinistriesField, {id: i, ministerPortfolioArray}])
              }
            }
        }
    }, [isEditable]);


    const handleFieldChange = (value, name, valueType, index) => {
        if (valueType === 'State') {
            let field = jsonForm?.fields?.find((item) => item.key === 'State')
            if (isValuePresent(field.combo_fields)) {
                if (isValuePresent(value)) {
                    let state = states.find((item) => item.name === value)
                    resetLocationFields(field.combo_fields[0])
                    getLocations(state.id, field.combo_fields[0])
                } else {
                    setData(field.combo_fields[0].key, value)
                }
            }
        }

        if (ministriesKey.includes(valueType)) {
            setArrayData('minister_portfolio_array', valueType, value, index)
        } else {
            setData(valueType, value)
        }
    };

    const setArrayData = (type, key, value, index) => {
        setFieldsData((prevFieldsData) => {
            const updatedFieldsData = { ...prevFieldsData };
            updatedFieldsData[type][index][key] = value;
            return updatedFieldsData;
        });
        setIsDataSet(true);
    };

    const setData = (valueType, value) => {
        setFieldsData((prevFieldsData) => ({
            ...prevFieldsData,
            [valueType]: value,
        }));
        setIsDataSet(true)
    };

    const handleSave = () => {
        setIsDataSet(false)
        saveData(fieldsData,formIndex)
    }

    useEffect(() => {
        if (isDataSet) {
            handleSave()
        }
    }, [fieldsData]);

    const contestedElection = (value, fieldKey) => {
        if (fieldKey === 'election_win') {
            const filteredItems = jsonForm.fields.filter((item) => item.key === 'minister_portfolio');
            resetLocationFields(filteredItems[0])
        }

        if (fieldKey === 'minister_portfolio') {
            if (value === 'Yes') {
                fieldsData['minister_portfolio_array'] = [ministryPortfolioObject]
                setMinistriesFields([])
            } else {
                fieldsData['minister_portfolio_array'] = []
            }
        }

        setData(fieldKey, value)
    }

    const showField = (isConditional, key, value) => {
        return isConditional ? fieldsData[key] === value : true
    }

    const getLocations = (stateId, field) => {
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
        return isValuePresent(locationsArray[key]) ? locationsArray[key] : []
    }

    const addMinistries = () => {
        if (!isViewDisabled) {
            setFieldsData((prevFieldsData) => ({
                ...prevFieldsData,
                minister_portfolio_array: [
                    ...prevFieldsData.minister_portfolio_array,
                    ministryPortfolioObject,
                ],
            }));
            setMinistriesFields(prevMinistriesField => [...prevMinistriesField, {ministerPortfolioArray}])
        }
    }
    const deleteMinistry = (minIndex) => {
        if (!isViewDisabled) {
            setFieldsData((prevFieldsData) => {
                const updatedMinisterPortfolioArray = [...prevFieldsData.minister_portfolio_array];
                updatedMinisterPortfolioArray.splice(minIndex + 1, 1);
                return {
                    ...prevFieldsData,
                    minister_portfolio_array: updatedMinisterPortfolioArray,
                };
            });

            const newarr = ministriesField.filter((_, index) => index !== minIndex);
            setMinistriesFields([...newarr]);
        }

    };
    const getFieldsValue = (key, index) => {
        return  ministriesKey.includes(key) ? fieldsData.minister_portfolio_array[index][key] : fieldsData[key]
    }

    useEffect(() => {
        if (isValuePresent(electionTypeChange)) {
            if (resetFormIndex === formIndex) {
                setFieldsData({})
            }
        }
    },[electionTypeChange])


    const formLabel = (name,mt) => {
        return (<FormLabel sx={{mb:1, mt:2}}>{name}<mark>*</mark></FormLabel>)
    }

    return (
        <div>
            <Grid container className="electoral-matrix-form grid-wrap ">
                {jsonForm.fields && jsonForm.fields.map((f) => (
                    <>
                        {showField(f.is_conditional, f.condition_key, f.condition_value) &&
                            <div   className={`electoral-form-fields${isMobileUser ? '-mobile-view' : 'd-flex'}`}>
                                {
                                    f.type === 'dropdown' &&
                                    <Grid item xs={mobileView()} className={`${f.name === 'State' ? 'width-22rem' : 'width-25rem margin-left-3-rem'}` }>
                                        {formLabel(f.name,isMobileUser ? 2 : null)}
                                        <AutoCompleteDropdown
                                            disabled={isViewDisabled}
                                            name={f.name}
                                            selectedValue={fieldsData[f.key] || null}
                                            listArray={getList(f.key)}
                                            onChangeValue={handleFieldChange}
                                            dropDownType={f.key}/>
                                        <ErrorMessage name="qualification" style={{color: 'red'}} component="p"/>
                                    </Grid>
                                }
                                {
                                    f.type === "textField" &&
                                    <Grid item xs={mobileView()}>
                                        {f.name === 'Name Of Ministry' ? (
                                            <>
                                                1. {formLabel(f.name, isMobileUser ? 2 : null)}
                                            </>
                                        ) : (
                                            <>
                                                {formLabel(f.name, isMobileUser ? 2 : null)}
                                            </>
                                        )}

                                        <OtherInputField
                                            disabled={isViewDisabled}
                                            type="text"
                                            fieldIndex={0}
                                            value={getFieldsValue(f.key, 0) || null}
                                            onChange={handleFieldChange}
                                            textType={f.key}
                                            placeholder={f.placeholder}/>
                                    </Grid>
                                }
                                {
                                    f.type === "numField" &&
                                    <Grid item xs={mobileView()} className='d-grid'>
                                        {formLabel(f.name,isMobileUser ? 2 : null)}
                                        <Field
                                            disabled={isViewDisabled}
                                            style={{width: '22rem'}}
                                            type="text"
                                            value={getFieldsValue(f.key, 0) || null}
                                            as={TextField}
                                            className='elec-number-field'
                                            placeholder={f.placeholder}
                                            onChange={(e) => handleFieldChange(e.target.value, f.name, f.key, 0)}
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
                                    <Grid item xs={mobileView()}>
                                        {formLabel(f.name,isMobileUser ? 2 : null)}
                                        <RadioButton disabled={isViewDisabled} radioList={f.list} selectedValue={fieldsData[f.key] || null}
                                                     onClicked={contestedElection} fieldKey={f.key}/>
                                    </Grid>
                                }
                                {isValuePresent(f.combo_fields) && f.combo_fields.map((fi) => (
                                    <>
                                        {
                                            fi.type === 'dropdown' &&
                                            <Grid item xs={mobileView()}>
                                                {formLabel(fi.name,isMobileUser ? 2 : null)}
                                                <AutoCompleteDropdown
                                                    disabled={isViewDisabled}
                                                    name={fi.name}
                                                    selectedValue={fieldsData[fi.key] || null}
                                                    listArray={getList(fi.key)}
                                                    onChangeValue={handleFieldChange}
                                                    dropDownType={fi.key}/>
                                                <ErrorMessage name="qualification" style={{color: 'red'}}
                                                              component="p"/>
                                            </Grid>
                                        }
                                        {
                                            fi.type === "textField" &&
                                            <Grid item xs={mobileView()}>
                                                {formLabel(fi.name,isMobileUser ? 2 : null)}
                                                <OtherInputField
                                                    disabled={isViewDisabled}
                                                    type="text"
                                                    value={getFieldsValue(fi.key, 0, ) || null}
                                                    onChange={handleFieldChange}
                                                    textType={fi.key}
                                                    fieldIndex={0}
                                                    placeholder={fi.placeholder}/>
                                            </Grid>
                                        }
                                        {
                                            fi.type === "numField" &&
                                            <Grid className='d-grid'>
                                                {formLabel(fi.name,isMobileUser ? 2 : null)}
                                                <Grid item xs={mobileView()} className='d-grid'>
                                                    {formLabel(fi.name,isMobileUser ? 2 : null)}
                                                    <Field
                                                        disabled={isViewDisabled}
                                                        style={{width: '22rem'}}
                                                        type="text"
                                                        defaultValue={dayjs('2022-04-17')}
                                                        value={fieldsData[fi.key] || null}
                                                        as={TextField}
                                                        className='elec-number-field'
                                                        placeholder={fi.placeholder}
                                                        onChange={(e) => handleFieldChange(e.target.value, fi.name, fi.key)}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        onInput={(event) => {
                                                            event.target.value = event.target.value.replace(/\D/g, '').slice(0, 3);
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        }
                                        {
                                            fi.type === "radio" &&
                                            <Grid item xs={4}>
                                                {formLabel(fi.name,isMobileUser ? 2 : null)}
                                                <RadioButton   disabled={isViewDisabled} radioList={fi.list}
                                                               selectedValue={fieldsData[fi.key] || null}
                                                               onClicked={contestedElection} fieldKey={f.key}/>
                                            </Grid>
                                        }
                                    </>
                                ))}
                            </div>
                        }
                    </>
                ))}

                {ministriesField && ministriesField.map((field, minIndex) => {
                    return (
                        <>
                            {field.ministerPortfolioArray && field.ministerPortfolioArray.map((f) => {
                                return (
                                    <>
                                        {showField(f.is_conditional, f.condition_key, f.condition_value) &&
                                            <div className={`electoral-form-fields${isMobileUser ? '-mobile-view' : '' }`}>
                                                {
                                                    f.type === "textField" &&
                                                    <Grid item xs={mobileView()}>
                                                        {f.name === 'Name Of Ministry' ? `${minIndex + 2}. `  :''}
                                                        {formLabel(f.name,isMobileUser ? 2 : null)}
                                                        <OtherInputField
                                                            disabled={isViewDisabled}
                                                            type="text"
                                                            fieldIndex={minIndex+1}
                                                            value={getFieldsValue(f.key, minIndex+1) || null}
                                                            onChange={handleFieldChange}
                                                            textType={f.key}
                                                            placeholder={f.placeholder}
                                                        />
                                                    </Grid>
                                                }
                                                {
                                                    f.type === "numField" &&
                                                    <Grid item xs={mobileView()} className='d-grid'>
                                                        {formLabel(f.name,isMobileUser ? 2 : null)}
                                                        <Field
                                                            disabled={isViewDisabled}
                                                            style={{width: '22rem'}}
                                                            type="text"
                                                            value={getFieldsValue(f.key, minIndex+1) || null}
                                                            as={TextField}
                                                            className='elec-number-field'
                                                            placeholder={f.placeholder}
                                                            onChange={(e) => handleFieldChange(e.target.value, f.name, f.key, minIndex+1)}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            onInput={(event) => {
                                                                event.target.value = event.target.value.replace(/\D/g, '').slice(0, 3);
                                                            }}
                                                        />
                                                    </Grid>
                                                }
                                                {isValuePresent(f.combo_fields) && f.combo_fields.map((fi) => (
                                                    <>
                                                        {
                                                            fi.type === "textField" &&
                                                            <Grid item xs={mobileView()}>
                                                                <FormLabel className="mt-2 ">Designation</FormLabel>
                                                                <OtherInputField
                                                                    disabled={isViewDisabled}
                                                                    type="text"
                                                                    value={getFieldsValue(fi.key, minIndex+1, ) || null}
                                                                    onChange={handleFieldChange}
                                                                    textType={fi.key}
                                                                    fieldIndex={minIndex+1}
                                                                    placeholder={fi.placeholder}/>
                                                            </Grid>
                                                        }
                                                    </>
                                                ))}
                                            </div>
                                        }
                                    </>
                                )
                            })}
                            {fieldsData?.minister_portfolio === 'Yes' &&
                                <>
                                {ministriesField.length > 0 &&
                                    <span className='delete-ministry' onClick={() => deleteMinistry(minIndex)}>
                                    <DeleteIcon/> Delete
                              </span>
                                }
                                </>
                            }
                        </>
                    )
                })}

                {fieldsData?.minister_portfolio === 'Yes' &&
                    <div className='add-ministry-container' >
                       <span className='add-ministry' onClick={addMinistries}>
                            <FontAwesomeIcon className='' icon={faPlus} style={{color: "#FF9559",}} /> Add Ministry
                       </span>
                    </div>
                }
            </Grid>
        </div>
    )
}

export default ElectoralGovermentMatrix
