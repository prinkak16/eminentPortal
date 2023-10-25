import {Typography, Stack, Box, Paper, Grid, FormLabel, TextField, Textarea, Select, MenuItem} from '@mui/material';
import React, {useEffect, useState} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { styled } from '@mui/material/styles';
import Startdatepicker from '../component/startdatepicker/startdatepicker';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Formheading from "../component/formheading/formheading";
import SelectField from "../component/selectfield/selectfield";
import Savebtn from "../component/saveprogressbutton/button";
import Inputfield from "../component/inputfield/inputfield";
import Stepfouraddmore from '../component/stepfouraddmore/selectlokshabha';
import Rajyasabhaform from '../component/stepfouraddmore/selectrajyasabha';
import Vidhansabhaform from '../component/stepfouraddmore/lagislativeassemblyform';
import Vidhanparishadform from "../component/stepfouraddmore/vidhanprishad";
import Urbanlocalfrom from '../component/stepfouraddmore/urbanlocal';
import Primarybutton from '../component/primarybutton/primarybutton';
import {getFormData, getPartyData} from "../../../api/stepperApiEndpoints/stepperapiendpoints";
import * as Yup from "yup";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import MoreVertIcon from "@mui/icons-material/MoreVert";
const PolticalandGovrnform =(props)=>{
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor:'transparent',
        boxShadow:'none',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        flexGrow: 1,
    }));
    const [showFields, setShowFields] = useState(false);
    const [formValues, setFormValues] = useState([])
    const [count, setcount]=useState(2)
    const [PartyData, setPartyData]=useState([])
    const handlesocialfield = () => {
        setFormValues([...formValues, { organization: "", description: "" }])
        setShowFields(true);
        setcount(count+1);
    }
    const handledelete = () => {
        const newFormValues = [...formValues];
        newFormValues.splice(-1, 1);
        setFormValues(newFormValues);
        setcount(count-1);
    }
    const [electfiled, setElectfield]=useState(false)
    const [selectedOption, setSelectedOption] = useState('');
    const handleaddField = () => {
        setElectfield(true)
    }
    function handlremoveField(){
        setElectfield(false)
    }
    const selectChange = (e) => {
        setSelectedOption(e.target.value);
    };
    useEffect(() => {
        getParty()
    }, []);
    const getParty=()=>{
        getPartyData.then((res)=>{
            setPartyData(res.data.data)})
    }
    const [saveParty, setSaveParty]=useState(null);
    const handleSaveParty=()=>{
        setSaveParty(props.formValues)
    }
    const [saveProfile, setSaveProfile]=useState(null)
    const  handleSaveProfile=()=>{
        setSaveProfile(props.formValues)
    }
    return(
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Stack className="mb-4" direction="row" useFlexGap flexWrap="wrap">
                    <Item><Formheading number="1" heading="Political Profile" /></Item>
                    <Item sx={{textAlign:'right'}}><Savebtn/></Item>
                </Stack>
                {saveParty && (
                    <div className="data-table">
                        <table className="w-100 table-responsive ">
                            <thead>
                            <tr>
                                <th>Party level</th>
                                <th>Unit</th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{saveParty.party_level}</td>
                                <td>{saveParty.unit}</td>
                                <td></td>
                                <td></td>
                                <td><MoreVertIcon/></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                )}
                <Grid container className="educationforms grid-wrap" >
                    <Grid item xs={4}>
                        <FormLabel>Party level <sup>*</sup></FormLabel>
                        {/*<SelectField*/}
                        {/*    name="party_level"*/}
                        {/*    defaultOption="Select Party Level"*/}
                        {/*    optionList={PartyData}*/}
                        {/*/>*/}
                        <SelectField
                            name="party_level"
                            defaultOption="Select Highest Qualification"
                            optionList={PartyData}
                        />
                        <ErrorMessage name="party_level" component="div" />
                    </Grid>
                    <Grid item xs={4}>
                        <FormLabel>Unit</FormLabel>
                        <Inputfield type="text"
                                    name="unit"
                                    placeholder="Enter Unit "/>
                    </Grid>
                    <Grid item xs={4}>
                        <FormLabel>Designation</FormLabel>
                        <Inputfield type="text"
                                    name="designation"
                                    placeholder="Enter Designation"/>
                    </Grid>
                    <Grid item xs={4}>
                        <FormLabel  fullwidth>Start Year</FormLabel><br/>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Field name="start_year2">
                                {({ field, form }) => (
                                    <DatePicker
                                        {...field}
                                        value={field.value} // Use field.value to get the current value
                                        onChange={(year) => form.setFieldValue("start_year2", year)} // Update the value
                                        views={['year']}
                                    />
                                )}
                            </Field>
                        </LocalizationProvider>
                        {/*<Startdatepicker  year="start_year"/>*/}
                    </Grid>
                    <Grid item xs={4}>
                        <FormLabel>End / Passing Year</FormLabel><br/>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Field name="end_year2">
                                {({ field, form }) => (
                                    <DatePicker
                                        {...field}
                                        value={field.value} // Use field.value to get the current value
                                        onChange={(year) => form.setFieldValue("end_year2", year)} // Update the value
                                        views={['year']}
                                    />
                                )}
                            </Field>
                        </LocalizationProvider>
                    </Grid>

                    <Grid item xs={12}>
                        <Primarybutton addclass="cancelbtn cancel" buttonlabel="Cancel"/>
                        <Primarybutton addclass="nextbtn" handleclick={handleSaveParty} buttonlabel="Save"/>
                    </Grid>
                </Grid>

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
                {saveProfile && (
                    <div className="data-table">
                        <table className="w-100 table-responsive ">
                            <thead>
                            <tr>
                                <th>Party</th>
                                <th>Position</th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{saveProfile.party}</td>
                                <td>{saveProfile.position}</td>
                                <td></td>
                                <td></td>
                                <td><MoreVertIcon/></td>
                            </tr>
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
                    <Grid container className="educationforms">
                        <Grid item xs={4}>
                            <FormLabel>Party</FormLabel>
                            <Inputfield type="text"
                                        name="party"
                                        placeholder="Enter Party"/>

                        </Grid>
                        <Grid item xs={4}>
                            <FormLabel>Position</FormLabel>
                            <Inputfield type="text"
                                        name="position"
                                        placeholder="Enter Position"/>
                        </Grid>
                        <Grid item xs={4}>
                            <FormLabel  fullwidth>Start Year</FormLabel><br/>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Field name="start_year3">
                                    {({ field, form }) => (
                                        <DatePicker
                                            {...field}
                                            value={field.value} // Use field.value to get the current value
                                            onChange={(year) => form.setFieldValue("start_year3", year)} // Update the value
                                            views={['year']}
                                        />
                                    )}
                                </Field>
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={4}>
                            <FormLabel>End Year</FormLabel><br/>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Field name="end_year3">
                                    {({ field, form }) => (
                                        <DatePicker
                                            {...field}
                                            value={field.value} // Use field.value to get the current value
                                            onChange={(year) => form.setFieldValue("end_year3", year)} // Update the value
                                            views={['year']}
                                        />
                                    )}
                                </Field>
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <Primarybutton addclass="cancelbtn cancel" buttonlabel="Cancel"/>
                            <Primarybutton addclass="nextbtn" handleclick={handleSaveProfile} buttonlabel="Save"/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container className="grid-wrap">
                    <Grid item sx={{mb:2}} xs={12}>
                        <Typography variant="h5" content="h5">
                            <Box className="detailnumbers" component="div" sx={{ display: 'inline-block' }}>3</Box> Social Affiliation <InfoOutlinedIcon/>
                        </Typography>
                    </Grid>
                    <Grid item xs={4} sx={{mb:2}}>
                        <FormLabel>Organization </FormLabel>
                        <Inputfield type="text"
                                    name="organization"
                                    placeholder="Enter Organization "/>
                    </Grid>
                    <Grid item xs={12}>
                        <FormLabel>Description <InfoOutlinedIcon/></FormLabel>
                        <TextField
                            className='p-0'
                            fullWidth
                            name="description"
                            multiline
                            minRows={3}
                            maxRows={4}
                            placeholder="Please enter your Organization description."
                        />
                    </Grid>
                    <Grid item  xs={12}>
                        {showFields && formValues.map((field, index) => (

                            <Grid container>
                                <Grid item sx={{mb:2}} xs={12}>
                                    <Typography variant="h5" content="h5">
                                        <Box className="detailnumbers" component="div" sx={{ display: 'inline-block' }}>3{count}</Box> Social Affiliation <InfoOutlinedIcon/>
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} sx={{mb:2}}>
                                    <FormLabel>Organization </FormLabel>
                                    <Inputfield type="text"
                                                name="organization"
                                                placeholder="Enter Organization "/>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormLabel>Description <InfoOutlinedIcon/></FormLabel>
                                    <TextField
                                        className='p-0'
                                        fullWidth
                                        name="description"
                                        multiline
                                        minRows={3}
                                        maxRows={4}
                                        placeholder="Please enter your Organization description."
                                    />
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                    <Grid item  xs={12}>
                        <Primarybutton addclass="addanotherfieldsbtn me-2" starticon={<AddIcon/>} buttonlabel="Add Another" handleclick={()=>handlesocialfield()}/>

                        {formValues.length>=1 ?(
                            <Primarybutton addclass="deletebtn mt-3" starticon={<DeleteIcon/>} handleclick={()=>handledelete(formValues.length-1)}/>
                        ):null}
                    </Grid>


                </Grid>
                <Grid container className="grid-wrap">
                    <Grid item sx={{mt:3}} xs={12}>
                        <Typography variant="h5" content="h5">
                            <Box className="detailnumbers" component="div" sx={{ display: 'inline-block' }}>4</Box> Electoral / Government <sup>*</sup>
                        </Typography>
                    </Grid>
                    <Grid item xs={4} sx={{mt:2, ml:3}}>
                        <FormLabel fullwidth>Have you contested any election?</FormLabel>
                        <div className='d-flex'>
                            <label className='d-flex justify-content-start me-3 ' >
                                <Field onChange={handleaddField} className="w-auto me-2" type="radio" name="won" value="One" /> Yes
                            </label>
                            <label className='d-flex justify-content-start'>
                                <Field onChange={handlremoveField} type="radio" className="w-auto me-2" name="won" value="Two" /> No
                            </label>
                        </div>
                    </Grid>
                    <Grid item xs={12} sx={{mb:2}}>
                        <Grid container spacing={2} className='px-5 py-3'>
                            <Grid item xs={4}>
                                {electfiled &&(

                                    // <SelectField selectedvalues={selectedOption} handleSelectChange={selectChange} name="state"  optionList={['Select Type','Lok sabha','Rajya sabha', 'Legislative Assembly (vidhan sabha)', 'Legislative Council (vidhan sabha)', 'Urban Local body', 'Rural Local body', 'Other']}/>
                                    <Field
                                    as={Select}
                                name="state"
                                className="custom-select"
                                fullWidth
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                            >

                                <MenuItem value="Select Type">
                                    <em>Select Type</em>
                                </MenuItem>

                                    <MenuItem value="Lok sabha">
                                        <em>Lok sabha</em>
                                    </MenuItem>
                                    <MenuItem value="Rajya sabha">
                                        <em>Rajya sabha </em>
                                    </MenuItem>
                                    <MenuItem value="Legislative Assembly (vidhan sabha)">
                                        <em>Legislative Assembly (vidhan sabha)</em>
                                    </MenuItem>
                                    <MenuItem value="Legislative Council (vidhan sabha)">
                                        <em>Legislative Council (vidhan sabha)</em>
                                    </MenuItem>
                                    <MenuItem value="Urban Local body">
                                        <em>Urban Local body</em>
                                    </MenuItem>
                                    <MenuItem value="Rural Local body">
                                        <em>Rural Local body</em>
                                    </MenuItem>
                                    <MenuItem value="Other">
                                        <em>Other</em>
                                    </MenuItem>
                            </Field>
                                )}

                            </Grid>
                            <Grid item xs={9}>
                                <Field name="state">
                                    {({ field }) => (
                                        <div>
                                            {field.value === 'Lok sabha' && <Stepfou0raddmore />}
                                            {field.value === 'Rajya sabha' && <Rajyasabhaform />}
                                            {field.value === 'Legislative Assembly (vidhan sabha)' && <Vidhansabhaform />}
                                            {field.value === 'Legislative Council (vidhan sabha)' && <Vidhanparishadform />}
                                            {field.value === 'Urban Local body' && <Urbanlocalfrom />}
                                            {field.value === 'Rural Local body' && <Urbanlocalfrom />}
                                        </div>
                                    )}
                                </Field>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sx={{mb:2}}>
                        <Primarybutton  addclass="nextbtn mb-2" starticon={<AddIcon/>} buttonlabel="Add More"/>
                        <Typography>( If fought any other election. )</Typography>
                    </Grid>
                </Grid>
            </Box>


        </>

    )
}
PolticalandGovrnform.label = 'Political and Government'
PolticalandGovrnform.initialValues = {
    political_profile:[
        {  party_level: "",
            unit: "",
            designation: "",
            start_year: "",
            end_year: "",
        }
    ],
    rss_years:"",
    bjp_years:"",
    other_parties:[{
        party: "",
        position: "",
        start_year: "",
        end_year: "",
    }],
    social_profiles:[{
        organization: "",
        description: "",
    }],
};
PolticalandGovrnform.validationSchema = Yup.object().shape({
    party_level: Yup.string().required('Please enter your first name'),
});
export default PolticalandGovrnform