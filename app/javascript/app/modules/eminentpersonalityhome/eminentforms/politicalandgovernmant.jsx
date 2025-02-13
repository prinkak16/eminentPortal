import {Box, Button, Fade, FormLabel, Grid, Paper, Popper, Stack, TextField, Typography} from '@mui/material';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {ErrorMessage} from 'formik';
import {styled} from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Formheading from "../component/formheading/formheading";
import Primarybutton from '../component/primarybutton/primarybutton';
import * as Yup from "yup";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PopupState, {bindPopper, bindToggle} from 'material-ui-popup-state';
import {Edit} from "@mui/icons-material";
import {
    disabledSaveProgressButton,
    electionTypeList,
    electionWiseJson, formFilledValues, isMobileUser,
    isValuePresent, ministerPortfolioArray, mobileView,
    otherPartyJson,
    politicalProfileJson,
    saveProgress, saveProgressButton, showErrorToast, toSnakeCase
} from "../../utils";
import ComponentOfFields from "./componentOfFields";
import {v4 as uuidv4} from "uuid";
import OtherInputField from "../component/otherFormFields/otherInputField";
import RadioButton from "./radioButton";
import AutoCompleteDropdown from "../simpleDropdown/autoCompleteDropdown";
import ElectoralGovermentMatrix from "./electoralGovermentMatrix";
import {ApiContext} from "../../ApiContext";
import {getFormData} from "../../../api/stepperApiEndpoints/stepperapiendpoints";
import NumberField from "../component/numberfield/numberfield";
import Tooltip from "@mui/material/Tooltip";
import ComponentFieldDetails from "./componentFieldDetails";

const PolticalandGovrnform =(props)=>{
    const {config, isCandidateLogin, setBackDropToggle,backDropToggle} = useContext(ApiContext)
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor:'transparent',
        boxShadow:'none',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        flexGrow: 1,
    }));
    const [socialFields, setSocialFields] = useState(props.formValues.social_profiles || [])
    const [count, setcount]=useState(2)
    const [politicalProfileDetails, setPoliticalProfileDetails] = useState(props.formValues.political_profile || []);
    const [otherPartyDetails, setOtherPartyDetails] = useState(props.formValues.other_parties || []);
    const [editableProfileField, setEditableProfileField] = useState()
    const [editableOtherPartyField, setEditableOtherPartyField] = useState()
    const [NAFields, setNAFields] = useState(props?.formValues?.political_not_applicable)
    const [NAFieldOther, setNAFieldOther] = useState(props?.formValues?.other_party_not_applicable)
    const [electoralDetails, setElectoralDetails] = useState(props?.formValues?.election_fought)
    const [electionContested, setElectionContested] = useState(props?.formValues?.election_contested ? "Yes" : "No")
    const [showList, setShowList] = useState()
    const [isElectionTypeChange, setIsElectionTypeChange] = useState(false)
    const [isViewDisabled, setIsViewDisabled] = useState(false)
    const [formResetIndex, setFormResetIndex] = useState(null)
    const [showPoliticalForm, setShowPoliticalForm] = useState(true)
    const [showOtherPartyForm, setShowOtherPartyForm] = useState(true)
    const [resetFields, setResetFields] = useState("");
    const [clearFieldsData, setClearFieldsData] = useState(false);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (event.target.id !== 'list-container' && event.target.id !== 'list-icon-button' && event.target.id !== 'list-icon') {
                setShowList(null)
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (props.viewMode === 'view') {
            setIsViewDisabled(true)
        }
    },[props.viewMode])


    const addSocialFields = () => {
        setSocialFields(prevSocialFields => [...prevSocialFields, { organization: "", description: "" }]);
        setcount(count+1);
    }

    const addFieldElectoralElection = () => {
        if (!isViewDisabled) {
            setElectoralDetails([...electoralDetails,  {election_type: '', election_details:{}}])
        }
    }

    const deleteSocialFields = () => {
        const newFormValues = [...socialFields];
        newFormValues.splice(-1, 1);
        setSocialFields(newFormValues);
        setcount(count-1);
    }

    useEffect(()=> {
       if(otherPartyDetails.length > 0) {
           setShowOtherPartyForm(false);
       }
    },[otherPartyDetails]);

    useEffect(()=> {
        if(politicalProfileDetails.length > 0){
            setShowPoliticalForm(false);
        }
    },[politicalProfileDetails])


    const handleSave = ( title, formData, id) => {
        setBackDropToggle(true)
        setTimeout(function() {
            if (title === 'Political Profile') {
                setShowPoliticalForm(false)
                politicalProfileSave(formData, id)
                setEditableProfileField({})
            }

            if (title === 'Other Party Profile') {
                setEditableProfileField({})
                setShowOtherPartyForm(false)
                otherPartiProfileSave(formData, id)
            }
        }, 50)


    };

    const editForm = (type,id) => {
        showFormFields(type)
        setShowList(null)
        if (type === 'political') {
            scrollToBottom(400)
            setEditableProfileField({})
            const form = politicalProfileDetails.find((item) => item.id === id);
            if (form) {
                setEditableProfileField(form)
            }
        }
        else {
            scrollToBottom(1200)
            setEditableOtherPartyField({})
            const form = otherPartyDetails.find((item) => item.id === id);
            if (form) {
                setEditableOtherPartyField(form)
            }
        }

    };



    const deleteFormFields = (type, id) => {
        setShowList(null)
        if (type === 'Political Profile') {
            if(politicalProfileDetails.length === 1){
                setShowPoliticalForm(true);
            }
            const form = politicalProfileDetails.filter((item) => item.id !== id);
            if (form) {
                setPoliticalProfileDetails(form)
            }
        } else {
            if(otherPartyDetails.length === 1 ){
                setShowOtherPartyForm(true);
            }
            const form = otherPartyDetails.filter((item) => item.id !== id);
            if (form) {
                setOtherPartyDetails(form)
            }
        }
    }

    const politicalProfileSave = (formData, id) => {
        const newFormData = {
            id: uuidv4(),
            party_level: formData.party_level,
            unit: isValuePresent(formData.unit) ? formData.unit : '-',
            designation: isValuePresent(formData.designation) ? formData.designation : '-',
            start_year: isValuePresent(formData.start_year) ? formData.start_year : '-',
            end_year: isValuePresent(formData.end_year) ? formData.end_year : '-',
        };

        setPoliticalProfileDetails((prevData) =>
            isValuePresent(id)
                ? prevData.map((form) => (form.id === id ? { ...form, ...newFormData } : form))
                : [...prevData, newFormData]
        );
        setBackDropToggle(false)
    }

    const otherPartiProfileSave = (formData, id) => {
        const newFormData = {
            id: uuidv4(),
            party: formData.party,
            position: isValuePresent(formData.position) ? formData.position : '-',
            start_year: isValuePresent(formData.start_year) ? formData.start_year : '-',
            end_year: isValuePresent(formData.end_year) ? formData.end_year : '-',
        };

        setOtherPartyDetails((prevData) =>
            isValuePresent(id)
                ? prevData.map((form) => (form.id === id ? { ...form, ...newFormData } : form))
                : [...prevData, newFormData]
        );
        setBackDropToggle(false)
    }

    const NotApplicableFields = (event) => {
        setNAFields(event.target.checked)
        props.formValues.political_not_applicable = event.target.checked
    }

    const NotApplicableOtherFields = (event) => {
        setNAFieldOther(event.target.checked)
        props.formValues.other_party_not_applicable = event.target.checked
    }

    const enterSocialFields = (field, index) => (event) => {
        let canEnterValue = true
        if (field === 'description') {
            if (event.target.value.length > 500) {
                canEnterValue = false
                return showErrorToast('Description can not be greater than 500 character')
            }
        }

        if (canEnterValue) {
            setSocialFields((preSocialField) => {
                return preSocialField.map((form, i) => {
                    if (i === index) {
                        return {
                            ...form,
                            [field]: event.target.value,
                        };
                    }
                    return form;
                });
            });
        }
    }

    const handleFieldChange = (value, name, valueType, index) => {
        setSocialFields((preSocialField) => {
            return preSocialField.map((form, i) => {
                if (i === index) {
                    return {
                        ...form,
                        [valueType]: value,
                    };
                }
                return form;
            });
        });
    };

    const contestedElection = (value) => {
        setElectionContested(value)
        props.formValues.election_contested = value === 'Yes'
        if (value !== 'Yes') {
            setElectoralDetails([{
                election_type: '', election_details: {}
            }])
        }
    }




    const changeElectionType = (value, name, type, formIndex) => {
        setIsElectionTypeChange(true)
        setFormResetIndex(formIndex)
        setElectoralDetails(prevDetails => {
            return prevDetails.map((item, index) => {
                if (index === formIndex) {
                    return {
                        ...item,
                        election_type: value,
                        election_details: {}
                    };
                }
                return item;
            });
        });

        setTimeout(function() {
            setIsElectionTypeChange(false)
            setFormResetIndex(null)
        },100)
    };



    const saveElectoralData = (data,index) => {
        setElectoralDetails((preElectoral) => {
            return preElectoral.map((form, i) => {
                if (i === index) {
                    return {
                        ...form,
                        ['election_details']: data,
                    };
                }
                return form;
            });
        });
    }

    const saveProgress = () => {
        if (!isViewDisabled) {
            const fieldsWithValues = formFilledValues(props.formValues);
            getFormData(fieldsWithValues, props.activeStep + 1, config, true, isCandidateLogin, props.stateId, setBackDropToggle).then(response => {
            });
        }
    }


    useEffect(() => {
        props.formValues.social_profiles = socialFields;
    }, [socialFields]);

    useEffect(() => {
        props.formValues.election_fought = electoralDetails
    }, [electoralDetails]);



    useEffect(() => {
        props.formValues.political_profile =  politicalProfileDetails
    }, [politicalProfileDetails]);

    useEffect(() => {
        props.formValues.other_parties =  otherPartyDetails
    }, [otherPartyDetails]);

    const deleteElectoralFields = (index) => {
        const fields  = electoralDetails.filter((item, i) => i !== index)
        setElectoralDetails(fields)
    }


    const openList = (id) => {
        if (showList === id) {
            setShowList(null)
        } else {
            setShowList(id)
        }
    }

    const scrollToBottom = (scroll) => {
        window.scrollTo({
            top: scroll,
            behavior: 'smooth',
        });
    };

    const handleClearFieldsData = () => {
        setClearFieldsData(true);
    };

    const showFormFields = (type) => {
        if (type === 'political') {
            setShowPoliticalForm(true)
        }else {

            setShowOtherPartyForm(true)
        }

    }

    return(
        <>
            <Box sx={{ flexGrow: 1}} className={`${isMobileUser ? 'political-mobile-view' : ''}`}>
                <Stack className="mb-4" direction="row" useFlexGap flexWrap="wrap">
                    <Item><Formheading number="1" heading="Political Profile" /></Item>
                    <Item sx={{textAlign: 'right'}}>
                        <div onClick={saveProgress}>
                            {
                                isViewDisabled ?
                                    disabledSaveProgressButton :
                                    saveProgressButton
                            }
                        </div>
                    </Item>
                </Stack>
                {isMobileUser ?
                    <> {politicalProfileDetails.length > 0 &&
                        <ComponentFieldDetails data={politicalProfileDetails} type={'political'} disabled={isViewDisabled}
                                               openList={openList} editForm={editForm} deleteFields={deleteFormFields} />
                       }
                       </>
                    :
                    <>
                        {politicalProfileDetails.length > 0 && (
                            <div className="data-table">
                                <table className="w-100 table-responsive text-center">
                                    <thead>
                                    <tr key={'otherPartyDetails'}>
                                        <th>Party level</th>
                                        <th>Unit</th>
                                        <th>Designation</th>
                                        <th>Start Year</th>
                                        <th>End Year</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {politicalProfileDetails.map((data, index) => (
                                        <tr key={index}>
                                            <td>{data.party_level}</td>
                                            <td>{data.unit}</td>
                                            <td>{data.designation}</td>
                                            <td>{data.start_year}</td>
                                            <td className='end-date-td'>{data.end_year}
                                                <div className='edit-button-logo' id='list-container'>
                                                    <Button id='list-icon-button' disabled={isViewDisabled} onClick={() => openList(data.id)} className="bg-transparent text-black display-contents">
                                                        <MoreVertIcon id='list-icon'/>
                                                    </Button>
                                                    {showList === data.id && (
                                                        <Paper className='details-edit-list'>
                                                            <Typography sx={{p: 2}} className='edit-buttons' onClick={() => editForm('political', data.id)}><Edit/>Edit</Typography>
                                                            <Typography onClick={() => deleteFormFields('Political Profile', data.id)} className='edit-buttons' sx={{p: 2}}><DeleteIcon/>Delete</Typography>
                                                        </Paper>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                }
                {politicalProfileDetails.length === 0 &&
                    <div className='date-na-button date-na-button-out-side'>
                         <span className='na-check-box'>
                           <input type="checkbox" checked={NAFields} onClick={NotApplicableFields}/>
                        </span>
                        <span className='na-check-msg'>Not Applicable</span>
                    </div>
                }

                {showPoliticalForm ?
                    <>
                        {!NAFields &&
                            <ComponentOfFields jsonForm={politicalProfileJson} saveData={handleSave}
                                               isEditable={editableProfileField}
                                               notApplicable={NAFields} isViewDisabled={isViewDisabled} showPoliticalForm={setShowPoliticalForm}/>}
                    </> :
                    <Grid item xs={12} className="d-flex align-items-center">
                        <div>
                            <Primarybutton addclass="addanotherfieldsbtn me-1 mb-1"
                                           starticon={<AddIcon/>}
                                           buttonlabel="Add ANOTHER"
                                           handleclick={async () => {
                                               await handleClearFieldsData();
                                               setEditableProfileField({});
                                               showFormFields('political');
                                           }}
                            />
                        </div>
                    </Grid>
                }
                <Grid container sx={{my:mobileView()}} spacing={2}>
                    <Grid item xs={mobileView('bjp')}>
                        <FormLabel>Years with BJP</FormLabel>
                        <NumberField
                            disabled={isViewDisabled}
                            type="number"
                            name="bjp_years"
                            value={props.formValues.bjp_years}
                            placeholder='00'
                            onInput={(event) => {
                                event.target.value = event.target.value.replace(/\D/g, '').slice(0, 2);
                            }}
                        />
                    </Grid>
                    <Grid item xs={mobileView('rss')}>
                        <FormLabel>Years with RSS</FormLabel>
                        <NumberField
                            disabled={isViewDisabled}
                            type="number"
                            name="rss_years"
                            value={props.formValues.rss_years}
                            placeholder='00'
                            onInput={(event) => {
                                event.target.value = event.target.value.replace(/\D/g, '').slice(0, 2);
                            }}
                        />
                        <ErrorMessage name="rss" component="div" />
                    </Grid>
                </Grid>
                <Grid item sx={{mb:2}} xs={12}>
                    <Typography variant="h5" content="h5">
                        <Box className="detailnumbers" component="div" sx={{ display: 'inline-block' }}>2</Box> Other Party Profile ( If any )
                    </Typography>
                </Grid>

                {isMobileUser ?
                    <> {otherPartyDetails.length > 0 &&
                        <ComponentFieldDetails data={otherPartyDetails} type={'other_party'} disabled={isViewDisabled}
                                               openList={openList} editForm={editForm} deleteFields={deleteFormFields}/>
                    }
                    </>
                    :
                    <>
                        {otherPartyDetails.length > 0 && (
                            <div className="data-table">
                                <table className="w-100 table-responsive text-center">
                                    <thead>
                                    <tr key={'otherPartyDetails'}>
                                        <th>Party</th>
                                        <th>Position</th>
                                        <th>Start Year</th>
                                        <th>End Year</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {otherPartyDetails.map((data, index) => (
                                        <tr key={index}>
                                            <td>{data.party}</td>
                                            <td>{data.position}</td>
                                            <td>{data.start_year}</td>
                                            <td className='end-date-td'>{data.end_year}
                                                <div className='edit-button-logo' id='list-container'>
                                                    <Button id='list-icon-button' disabled={isViewDisabled} onClick={() => openList(data.id)} className="bg-transparent text-black display-contents">
                                                        <MoreVertIcon id='list-icon'/>
                                                    </Button>
                                                    {showList === data.id && (
                                                        <Paper className='details-edit-list'>
                                                            <Typography sx={{p: 2}}
                                                                        className='edit-buttons'
                                                                        onClick={() => editForm('other_party',data.id)}><Edit/>Edit</Typography>
                                                            <Typography onClick={() => deleteFormFields('other_party',data.id)}
                                                                        className='edit-buttons'
                                                                        sx={{p: 2}}><DeleteIcon/>Delete</Typography>
                                                        </Paper>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                }


                {otherPartyDetails.length === 0 &&
                    <div className='date-na-button date-na-button-out-side'>
                         <span className='na-check-box'>
                           <input type="checkbox" checked={NAFieldOther} onClick={NotApplicableOtherFields}/>
                        </span>
                        <span className='na-check-msg'>Not Applicable</span>
                    </div>
                }


                {showOtherPartyForm ?
                    <>
                        {!NAFieldOther &&
                            <Grid className="grid-wrap">
                                {!backDropToggle &&
                                    <ComponentOfFields jsonForm={otherPartyJson} saveData={handleSave}
                                                       isEditable={editableOtherPartyField}
                                                       isViewDisabled={isViewDisabled} showOtherPartyForm={setShowOtherPartyForm}  clearFieldsData={clearFieldsData} setClearFieldsData={setClearFieldsData}/>
                                }
                            </Grid>
                        } </> :
                    <Grid item xs={12} className="d-flex align-items-center">
                        <div>
                            <Primarybutton addclass="addanotherfieldsbtn me-1 mb-1"
                                           starticon={<AddIcon/>}
                                           buttonlabel="ADD ANOTHER"
                                           handleclick={async () => {
                                               await handleClearFieldsData();
                                               setEditableOtherPartyField({});
                                               showFormFields('other');
                                           }}
                            />
                        </div>
                    </Grid>
                }


                <Grid container className="grid-wrap" sx={{padding: isMobileUser ? '1rem' : ''}} xs={mobileView()}>
                    <Grid item  container sx={{my:3}} spacing={2}>
                        {socialFields && socialFields.map((field, index) => (
                            <Grid container className='mb-5'>
                                <Grid className='social-affiliation-grid' item sx={{mb:2}} xs={12}>
                                    <Typography className='social-affiliation' variant={`isMobileUser ? 'h6' : 'h5'`} content={`isMobileUser ? 'h6' : 'h5'`}>
                                        <Tooltip title="Social Affiliation- If associated/owner to any NGO/SHG.">
                                       <Formheading number={index+3}  heading="Social Affiliation"/> <InfoOutlinedIcon/>
                                        </Tooltip>
                                    </Typography>
                                </Grid>
                                <Grid item xs={mobileView('organization')} sx={{mb:2}} className='organization-grid'>
                                    <FormLabel>Organization </FormLabel>
                                    <OtherInputField
                                        disabled={isViewDisabled}
                                        type="text"
                                        value={field?.organization || null}
                                        onChange={handleFieldChange}
                                        fieldIndex={index}
                                        textType="organization"
                                        placeholder="Enter Organization "/>
                                </Grid>
                                <Grid item xs={12} className={`organization-description-grid${isMobileUser ? '-mobile' : ''}`}>
                                    <FormLabel>Description
                                        <Tooltip title="Write upto 500 words.">
                                            <InfoOutlinedIcon/>
                                        </Tooltip>
                                    </FormLabel>
                                    <TextField
                                        sx={{mt:2}}
                                        disabled={isViewDisabled}
                                        className='p-0'
                                        fullWidth
                                        value={field.description}
                                        onChange={enterSocialFields( 'description' ,index)}
                                        multiline
                                        minRows={4}
                                        maxRows={4}
                                        placeholder="Please enter your Organization description."
                                    />
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                    <Grid item  xs={12}>
                        <Primarybutton disabled={isViewDisabled} addclass="addanotherfieldsbtn me-2" starticon={<AddIcon/>} buttonlabel="Add Another" handleclick={()=>addSocialFields()}/>
                        {socialFields.length > 1 ?(
                            <Primarybutton disabled={isViewDisabled} addclass="deletebtn mt-3" starticon={<DeleteIcon/>} handleclick={()=>deleteSocialFields(socialFields.length-1)}/>
                        ):null}
                    </Grid>


                </Grid>
                <Grid container className="grid-wrap">
                    <Grid item sx={{mt:3}} xs={12}>
                        <Typography variant="h5" content="h5">
                            <Box className="detailnumbers" component="div" sx={{ display: 'inline-block' }}>{socialFields.length+3}</Box> Electoral / Government <mark>*</mark>
                        </Typography>
                    </Grid>
                    <Grid item xs={4} sx={{mt:2, ml:3}}>
                        <FormLabel fullwidth>Have you contested any election?</FormLabel>
                        <div className='d-flex mt-2'>
                            <RadioButton disabled={isViewDisabled} radioList={['Yes', 'No']} selectedValue={electionContested} onClicked={contestedElection} />
                        </div>
                    </Grid>
                    {electionContested === 'Yes' && electoralDetails && electoralDetails.map((field,index) => (
                        <>
                            <Grid item xs={12} sx={{mb:2}}>
                                <Grid container spacing={2} className=' py-3'>
                                    <Grid item xs={4}>
                                            <div className="d-flex">
                                                {/*<span className='election-contest-count'>{index+1}</span>*/}
                                                <AutoCompleteDropdown
                                                    disabled={isViewDisabled}
                                                    classes={'election-dropdown'}
                                                    name={'Election Type'}
                                                    selectedValue={field.election_type}
                                                    listArray={electionTypeList}
                                                    onChangeValue={changeElectionType}
                                                    formIndex={index}
                                                />
                                                {electoralDetails.length > 1 &&
                                                <Primarybutton disabled={isViewDisabled} addclass="deletebtn delete-btn" starticon={<DeleteIcon/>} handleclick={()=>deleteElectoralFields(index)}/>
                                                }
                                            </div>
                                    </Grid>
                                    <Grid item xs={9}>
                                        {isValuePresent(field.election_type) &&
                                            <>
                                                    <ElectoralGovermentMatrix
                                                        isViewDisabled={isViewDisabled}
                                                        jsonForm={electionWiseJson[toSnakeCase(field.election_type)]}
                                                        saveData={saveElectoralData}
                                                        isEditable={field.election_details}
                                                        formIndex={index}
                                                        setBackDropToggle={setBackDropToggle}
                                                        electionTypeChange={isElectionTypeChange}
                                                        resetFormIndex={formResetIndex}
                                                    />
                                                {electoralDetails.length === index + 1 &&
                                                    <Primarybutton
                                                        isViewDisabled={isViewDisabled}
                                                        addclass="addanotherfieldsbtn me-2"
                                                        starticon={<AddIcon/>}
                                                        buttonlabel="ADD ANOTHER"
                                                        handleclick={() => addFieldElectoralElection()}
                                                    />
                                                }
                                            </>
                                        }
                                    </Grid>
                                </Grid>
                            </Grid>
                        </>
                    ))}
                </Grid>
            </Box>
        </>

    )
}
PolticalandGovrnform.label = 'Political and Government'
PolticalandGovrnform.initialValues = {
    political_not_applicable:false,
    other_party_not_applicable:false,
    political_profile: [],
    rss_years: '',
    bjp_years: '',
    other_parties: [],
    social_profiles: [{
        organization:'',
        description: ''
    }],
    election_contested: false,
    election_fought: [
        {
            election_type: '', election_details: {}
        }
    ],

};


PolticalandGovrnform.validationSchema = Yup.object().shape({
    election_contested: Yup.boolean().required('Please Select election contest'),

});
export default PolticalandGovrnform