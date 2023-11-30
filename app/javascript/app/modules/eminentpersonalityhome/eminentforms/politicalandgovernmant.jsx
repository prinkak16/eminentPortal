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
    electionWiseJson, formFilledValues,
    isValuePresent, ministerPortfolioArray,
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
    const [electoralDetails, setElectoralDetails] = useState(props?.formValues?.election_fought)
    const [electionContested, setElectionContested] = useState(props?.formValues?.election_contested ? "Yes" : "No")
    const [showList, setShowList] = useState()
    const componentRef = useRef(null);
    const [isElectionTypeChange, setIsElectionTypeChange] = useState(false)
    const [isViewDisabled, setIsViewDisabled] = useState(false)

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
        setElectoralDetails([...electoralDetails,  {election_type: '', election_details:{}}])
    }

    const deleteSocialFields = () => {
        const newFormValues = [...socialFields];
        newFormValues.splice(-1, 1);
        setSocialFields(newFormValues);
        setcount(count-1);
    }

    const handleSave = ( title, formData, id) => {
        setBackDropToggle(true)
        setTimeout(function() {
            if (title === 'Political Profile') {
                politicalProfileSave(formData, id)
                setEditableProfileField({})
            }

            if (title === 'Other Party Profile') {
                setEditableProfileField({})
                otherPartiProfileSave(formData, id)
            }
        }, 50)


    };

    const editForm = (type,id) => {
        setShowList(null)
        if (type === 'Political Profile') {
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
            const form = politicalProfileDetails.filter((item) => item.id !== id);
            if (form) {
                setPoliticalProfileDetails(form)
            }
        } else {
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


    const changeElectionType = (value,name ,type, formIndex) => {
        setIsElectionTypeChange(true)
        const updatedElectoralData = [...electoralDetails];
        updatedElectoralData[formIndex].election_type = value;
        updatedElectoralData[formIndex].election_details = {}
        setElectoralDetails(updatedElectoralData);
        setTimeout(function() {
            setIsElectionTypeChange(false)
        },100)
    }



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
            top: scroll, // Scroll to the bottom
            behavior: 'smooth', // Optional: Add smooth scrolling animation
        });
    };


    return(
        <>
            <Box sx={{ flexGrow: 1 }}>
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
                                    <div className='edit-button-logo' ref={componentRef}>
                                        <Button onClick={() => openList(data.id)} className="bg-transparent text-black display-contents">
                                            <MoreVertIcon/>
                                        </Button>
                                        {showList === data.id && (
                                            <Paper className='details-edit-list'>
                                                <Typography sx={{p: 2}}
                                                            className='edit-buttons'
                                                            onClick={() => editForm('Political Profile',data.id)}><Edit/>Edit</Typography>
                                                <Typography onClick={() => deleteFormFields('Political Profile',data.id)}
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
                {politicalProfileDetails.length === 0 &&
                    <div className='date-na-button date-na-button-out-side'>
                         <span className='na-check-box'>
                           <input type="checkbox" checked={NAFields} onClick={NotApplicableFields}/>
                        </span>
                        <span className='na-check-msg'>Not Applicable</span>
                    </div>
                }
                {!backDropToggle &&
                    <>
                        {!NAFields &&
                            <ComponentOfFields jsonForm={politicalProfileJson} saveData={handleSave}
                                               isEditable={editableProfileField}
                                               notApplicable={NAFields} isViewDisabled={isViewDisabled}/>}
                    </>
                }
                <Grid container sx={{my:3}} spacing={2}>
                    <Grid item xs={2}>
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
                    <Grid item xs={2}>
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
                                        <div className='edit-button-logo' ref={componentRef}>
                                            <Button onClick={() => openList(data.id)} className="bg-transparent text-black display-contents">
                                                <MoreVertIcon/>
                                            </Button>
                                            {showList === data.id && (
                                                <Paper className='details-edit-list'>
                                                    <Typography sx={{p: 2}}
                                                                className='edit-buttons'
                                                                onClick={() => editForm('Other Party Profile',data.id)}><Edit/>Edit</Typography>
                                                    <Typography onClick={() => deleteFormFields('Other Party Profile',data.id)}
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
                <Grid  className="grid-wrap">
                    {!backDropToggle &&
                        <ComponentOfFields jsonForm={otherPartyJson} saveData={handleSave}
                                           isEditable={editableOtherPartyField} isViewDisabled={isViewDisabled}/>
                    }
                </Grid>


                <Grid container className="grid-wrap">
                    <Grid item  container sx={{my:3}} spacing={2}>
                        {socialFields && socialFields.map((field, index) => (
                            <Grid container className='mb-5'>
                                <Grid className='social-affiliation-grid' item sx={{mb:2}} xs={12}>
                                    <Typography className='social-affiliation' variant="h5" content="h5">
                                        <Box className="detailnumbers social-affiliation-box" component="div" sx={{ display: 'inline-block' }}>{index+3}</Box> Social Affiliation <InfoOutlinedIcon/>
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} sx={{mb:2}} className='organization-grid'>
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
                                <Grid item xs={12} className='organization-description-grid'>
                                    <FormLabel>Description
                                        <Tooltip title="Social Affiliation- If associated/owner to any NGO/SHG.">
                                            <InfoOutlinedIcon/>
                                        </Tooltip>
                                    </FormLabel>
                                    <TextField
                                        disabled={isViewDisabled}
                                        className='p-0'
                                        fullWidth
                                        value={field.description}
                                        onChange={enterSocialFields( 'description' ,index)}
                                        multiline
                                        minRows={5}
                                        maxRows={5}
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
                                <Grid container spacing={2} className='px-5 py-3'>
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
                                                    />
                                                {electoralDetails.length === index + 1 &&
                                                    <Primarybutton
                                                        isViewDisabled={isViewDisabled}
                                                        addclass="addanotherfieldsbtn me-2"
                                                        starticon={<AddIcon/>}
                                                        buttonlabel="Add Another"
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