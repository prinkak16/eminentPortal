import {Box, Button, Fade, FormLabel, Grid, Paper, Popper, Stack, TextField, Typography} from '@mui/material';
import React, {useContext, useEffect, useState} from 'react';
import {ErrorMessage} from 'formik';
import {styled} from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Formheading from "../component/formheading/formheading";
import Savebtn from "../component/saveprogressbutton/button";
import Inputfield from "../component/inputfield/inputfield";
import Stepfouraddmore from '../component/stepfouraddmore/selectlokshabha';
import Rajyasabhaform from '../component/stepfouraddmore/selectrajyasabha';
import Vidhansabhaform from '../component/stepfouraddmore/lagislativeassemblyform';
import Vidhanparishadform from "../component/stepfouraddmore/vidhanprishad";
import Urbanlocalfrom from '../component/stepfouraddmore/urbanlocal';
import Primarybutton from '../component/primarybutton/primarybutton';
import * as Yup from "yup";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PopupState, {bindPopper, bindToggle} from 'material-ui-popup-state';
import {Edit} from "@mui/icons-material";
import {
    electionTypeList,
    electionWiseJson, formFilledValues,
    isValuePresent,
    otherPartyJson,
    politicalProfileJson,
    saveProgress
} from "../../utils";
import ComponentOfFields from "./componentOfFields";
import {v4 as uuidv4} from "uuid";
import OtherInputField from "../component/otherFormFields/otherInputField";
import RadioButton from "./radioButton";
import AutoCompleteDropdown from "../simpleDropdown/autoCompleteDropdown";
import ElectoralGovermentMatrix from "./electoralGovermentMatrix";
import {ApiContext} from "../../ApiContext";
import {getFormData} from "../../../api/stepperApiEndpoints/stepperapiendpoints";

const PolticalandGovrnform =(props)=>{
    const {config} = useContext(ApiContext)
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor:'transparent',
        boxShadow:'none',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        flexGrow: 1,
    }));
    const [socialFields, setSocialFields] = useState(props?.formValues?.social_profiles)
    const [count, setcount]=useState(2)
    const [politicalProfileDetails, setPoliticalProfileDetails] = useState(props?.formValues?.political_profile);
    const [otherPartyDetails, setOtherPartyDetails] = useState(props?.formValues?.other_parties);
    const [editableProfileField, setEditableProfileField] = useState()
    const [editableOtherPartyField, setEditableOtherPartyField] = useState()
    const [NAFields, setNAFields] = useState(false)
    const [electoralDetails, setElectoralDetails] = useState(props?.formValues?.election_fought)
    const [electionContested, setElectionContested] = useState(props?.formValues?.election_contested)

    console.log(electoralDetails,'electoralDetails')

    useEffect(() => {
        props.formValues.political_profile =  politicalProfileDetails
    }, [politicalProfileDetails]);

    useEffect(() => {
        props.formValues.other_parties =  otherPartyDetails
    }, [otherPartyDetails]);


    const addSocialFields = () => {
        setSocialFields(prevSocialFields => [...prevSocialFields, { organization: "", description: "" }]);
        setShowFields(true);
        setcount(count+1);
    }

    const addFieldElectoralElection = () => {
        setElectoralDetails([...electoralDetails,  {election_type: '', election_details:[]}])
    }

    const deleteSocialFields = () => {
        const newFormValues = [...socialFields];
        newFormValues.splice(-1, 1);
        setSocialFields(newFormValues);
        setcount(count-1);
    }


    const handleSave = ( title, formData, id) => {
        if (title === 'Political Profile') {
            politicalProfileSave(formData, id)
        }

        if (title === 'Other Party Profile') {
            otherPartiProfileSave(formData, id)
        }

    };

    const editForm = (type,id) => {
        if (type === 'Political Profile') {
            const form = politicalProfileDetails.find((item) => item.id === id);
            if (form) {
                setEditableProfileField(form)
            }
        }
        else {
            const form = otherPartyDetails.find((item) => item.id === id);
            if (form) {
                setEditableOtherPartyField(form)
            }
        }

    };


    const politicalProfileSave = (formData, id) => {
        const newFormData = {
            id: uuidv4(),
            party_level: formData.party_level,
            unit: formData.unit,
            designation: formData.designation,
            start_year: formData.start_year,
            end_year: formData.end_year,
        };

        setPoliticalProfileDetails((prevData) =>
            isValuePresent(id)
                ? prevData.map((form) => (form.id === id ? { ...form, ...newFormData } : form))
                : [...prevData, newFormData]
        );
    }


    const otherPartiProfileSave = (formData, id) => {
        const newFormData = {
            id: uuidv4(),
            party: formData.party,
            position: formData.position,
            start_year: formData.start_year,
            end_year: formData.end_year,
        };

        setOtherPartyDetails((prevData) =>
            isValuePresent(id)
                ? prevData.map((form) => (form.id === id ? { ...form, ...newFormData } : form))
                : [...prevData, newFormData]
        );
    }

    const NotApplicableFields = (event) => {
        setNAFields(event.target.checked)
    }

    const enterSocialFields = (field,index) => (event) => {
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

    useEffect(() => {
        props.formValues.social_profiles = socialFields;
    }, [socialFields, props.formValues]);

    const contestedElection = (value) => {
        setElectionContested(value === 'Yes')
        props.formValues.election_contested =value
    }

    console.log(electionContested,'electionContested')

    const changeElectionType = (value,name ,type, formIndex) => {
        const updatedElectoralData = [...electoralDetails];
        updatedElectoralData[0].election_type = value;
        setElectoralDetails(updatedElectoralData);
    }

    function toSnakeCase(inputString) {
        const cleanedString = inputString.replace(/[^a-zA-Z0-9\s]/g, '').trim();
        return cleanedString.replace(/\s+/g, '_').toLowerCase();
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

    useEffect(() => {
        props.formValues.election_fought = electoralDetails
    }, [electoralDetails]);



    const saveProgress = () => {
        const fieldsWithValues = formFilledValues(props.formValues);
        getFormData(fieldsWithValues, props.activeStep + 1, config, true).then(response => {
            console.log('API response:', response.data);
        });
    }

    return(
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Stack className="mb-4" direction="row" useFlexGap flexWrap="wrap">
                    <Item><Formheading number="1" heading="Political Profile" /></Item>
                    <Item sx={{textAlign:'right'}}><Savebtn onClick={saveProgress} /></Item>
                </Stack>
                {politicalProfileDetails.length > 0 && (
                    <div className="data-table">
                        <table className="w-100 table-responsive text-center">
                            <thead>
                            <tr>
                                <th>Party level</th>
                                <th>Unit</th>
                                <th>Designation</th>
                                <th>Start Year</th>
                                <th>End Year</th>
                            </tr>
                            </thead>
                            <tbody>
                            {politicalProfileDetails.map((data, index) => (
                            <tr>
                                <td>{data.party_level}</td>
                                <td>{data.unit}</td>
                                <td>{data.designation}</td>
                                <td>{data.start_year}</td>
                                <td className='end-date-td'>{data.end_year}
                                    <PopupState variant="popper" popupId="demo-popup-popper">
                                        {(popupState) => (
                                            <div className='edit-button-logo'>
                                                <Button
                                                    variant="contained" {...bindToggle(popupState)}
                                                    className="bg-transparent text-black display-contents">
                                                    <MoreVertIcon/>
                                                </Button>
                                                <Popper {...bindPopper(popupState)} transition>
                                                    {({TransitionProps}) => (
                                                        <Fade {...TransitionProps}
                                                              timeout={350}>
                                                            <Paper>
                                                                <Typography sx={{p: 2}}
                                                                            onClick={() => editForm('Political Profile',data.id)}><Edit/></Typography>
                                                                <Typography
                                                                    sx={{p: 2}}><DeleteIcon/></Typography>
                                                            </Paper>
                                                        </Fade>
                                                    )}
                                                </Popper>
                                            </div>
                                        )}
                                    </PopupState>
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
                           <input type="checkbox" onClick={NotApplicableFields}/>
                        </span>
                        <span className='na-check-msg'>Not Applicable</span>
                    </div>
                }
                {!NAFields &&
                <ComponentOfFields jsonForm={politicalProfileJson} saveData={handleSave} isEditable={editableProfileField} notApplicable={NAFields}/>
                }
                <Grid container sx={{my:3}} spacing={2}>
                    <Grid item xs={2}>
                        <FormLabel>Years with BJP</FormLabel>
                        <Inputfield type="number"
                                    name="bjp"
                                    placeholder="00"/>
                    </Grid>
                    <Grid item xs={2}>
                        <FormLabel>Years with RSS</FormLabel>
                        <Inputfield type="number"
                                    name="rss"
                                    placeholder="00"/>
                    </Grid>
                </Grid>
                {otherPartyDetails.length > 0 && (
                    <div className="data-table">
                        <table className="w-100 table-responsive text-center">
                            <thead>
                            <tr>
                                <th>Party</th>
                                <th>Position</th>
                                <th>Start Year</th>
                                <th>End Year</th>
                            </tr>
                            </thead>
                            <tbody>
                            {otherPartyDetails.map((data, index) => (
                            <tr>
                                <td>{data.party}</td>
                                <td>{data.position}</td>
                                <td>{data.start_year}</td>
                                <td className='end-date-td'>{data.end_year}
                                    <PopupState variant="popper" popupId="demo-popup-popper">
                                        {(popupState) => (
                                            <div className='edit-button-logo'>
                                                <Button
                                                    variant="contained" {...bindToggle(popupState)}
                                                    className="bg-transparent text-black display-contents">
                                                    <MoreVertIcon/>
                                                </Button>
                                                <Popper {...bindPopper(popupState)} transition>
                                                    {({TransitionProps}) => (
                                                        <Fade {...TransitionProps}
                                                              timeout={350}>
                                                            <Paper>
                                                                <Typography sx={{p: 2}}
                                                                            onClick={() => editForm('Other Party Profile',data.id)}><Edit/></Typography>
                                                                <Typography
                                                                    sx={{p: 2}}><DeleteIcon/></Typography>
                                                            </Paper>
                                                        </Fade>
                                                    )}
                                                </Popper>
                                            </div>
                                        )}
                                    </PopupState>
                                </td>
                            </tr>
                        ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <Grid container sx={{my:3}} className="grid-wrap">
                    <Grid item sx={{mb:2}} xs={12}>
                        <Typography variant="h5" content="h5">
                            <Box className="detailnumbers" component="div" sx={{ display: 'inline-block' }}>2</Box> Other Party Profile ( If any )
                        </Typography>
                    </Grid>

                    <ComponentOfFields jsonForm={otherPartyJson} saveData={handleSave} isEditable={editableOtherPartyField}/>
                </Grid>
                <Grid container className="grid-wrap">
                    <Grid item  xs={12}>
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
                                        type="text"
                                        value={field?.organization || null}
                                        onChange={handleFieldChange}
                                        fieldIndex={index}
                                        textType="organization"
                                        placeholder="Enter Organization "/>
                                </Grid>
                                <Grid item xs={12} className='organization-description-grid'>
                                    <FormLabel>Description <InfoOutlinedIcon/></FormLabel>
                                    <TextField
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
                        <Primarybutton addclass="addanotherfieldsbtn me-2" starticon={<AddIcon/>} buttonlabel="Add Another" handleclick={()=>addSocialFields()}/>
                        {socialFields.length > 1 ?(
                            <Primarybutton addclass="deletebtn mt-3" starticon={<DeleteIcon/>} handleclick={()=>deleteSocialFields(socialFields.length-1)}/>
                        ):null}
                    </Grid>


                </Grid>
                <Grid container className="grid-wrap">
                    <Grid item sx={{mt:3}} xs={12}>
                        <Typography variant="h5" content="h5">
                            <Box className="detailnumbers" component="div" sx={{ display: 'inline-block' }}>{socialFields.length+3}</Box> Electoral / Government <sup>*</sup>
                        </Typography>
                    </Grid>
                    <Grid item xs={4} sx={{mt:2, ml:3}}>
                        <FormLabel fullwidth>Have you contested any election?</FormLabel>
                        <div className='d-flex mt-2'>
                            <RadioButton radioList={['Yes', 'No']} selectedValue={electionContested} onClicked={contestedElection} />
                        </div>
                        <ErrorMessage name="won" component="div" />
                    </Grid>
                    {electionContested && electoralDetails.map((field,index) => (
                        <>
                            <Grid item xs={12} sx={{mb:2}}>
                                <Grid container spacing={2} className='px-5 py-3'>
                                    <Grid item xs={4}>
                                        {electionContested &&
                                            <AutoCompleteDropdown
                                                name={'Election Type'}
                                                selectedValue={field.election_type}
                                                listArray={electionTypeList}
                                                onChangeValue={changeElectionType}
                                                formIndex={index}
                                            />
                                        }
                                    </Grid>
                                    <Grid item xs={9}>
                                        {isValuePresent(field.election_type) &&
                                            <>
                                                    <ElectoralGovermentMatrix
                                                        jsonForm={electionWiseJson[toSnakeCase(field.election_type)]}
                                                        saveData={saveElectoralData}
                                                        isEditable={field.election_details}
                                                        formIndex={index}
                                                    />
                                                {electoralDetails.length === index + 1 &&
                                                    <Primarybutton
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
    state_name:'',
    pc:'',
    ac:'',
    ad_name:'',
    political_profile: [],
    rss_years: '',
    bjp_years: '',
    other_parties: [],
    social_profiles: [],
    election_contested: false,
    election_fought: [],

};


PolticalandGovrnform.validationSchema = Yup.object().shape({
    // party_level: Yup.string().required('Please enter your party level'),
    // won:Yup.string().required("A radio option is required")
});
export default PolticalandGovrnform