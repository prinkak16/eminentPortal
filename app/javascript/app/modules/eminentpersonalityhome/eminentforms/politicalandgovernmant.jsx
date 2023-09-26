import { Typography, Stack, Button, Box, Paper, Grid, FormLabel, TextField,Textarea} from '@mui/material';
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { styled } from '@mui/material/styles';
import Startdatepicker from '../component/startdatepicker/startdatepicker';
import Enddatepicker from "../component/enddatepicker/enddatepicker";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddIcon from '@mui/icons-material/Add';
import Formheading from "../component/formheading/formheading";
import Selectfield from "../component/selectfield/selectfield";
import Savebtn from "../component/button/button";
import './allfroms.scss'
import Inputfield from "../component/inputfield/inputfield";
const PolticalandGovrnform =()=>{
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor:'transparent',
        boxShadow:'none',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        flexGrow: 1,
    }));
    const [fields, setFields] = useState([""]);

    const handleAddField = () => {
        setFields([...fields, ""]);
    };
    const label = { inputProps: { 'aria-label': 'Home town address is same as current? Yes' } };
    const [showFields, setShowFields] = useState(false);
    const [formValues, setFormValues] = useState([])
    let addFormFields = () => {
        setFormValues([...formValues, { house: "", street: "", pincode:"", city:"", state:"", date: new Date() }])
        setShowFields(true)
    }

    let removeFormFields = (i) => {
        let newFormValues = [...formValues];
        newFormValues.splice(i-1, 1);
        setFormValues(newFormValues)
    }

    return(
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Stack className="mb-4" direction="row" useFlexGap flexWrap="wrap">
                    <Item><Formheading number="1" heading="Political Profile" /></Item>
                    <Item sx={{textAlign:'right'}}><Savebtn/></Item>
                </Stack>
                <Grid className='detailFrom' container spacing={2}>
                    <Grid item xs={12}>
                        <Formik
                            initialValues={{partylevel: "", unit: "", designation:"", startyear: "", endyear:""}}
                            validate={(values) => {
                                const errors = {};
                                if (!values.education) {
                                    errors.education = "Required";
                                }
                                if (!values.qualification) {
                                    errors.qualification = "Required";
                                }
                                if(!values.college){
                                    errors.college="Required"
                                }
                                if (!values.board) {
                                    errors.board = "Required";
                                }
                                if (!values.school) {
                                    errors.school = "Required";
                                }
                                if (!values.profession) {
                                    errors.profession = "Required";
                                }
                                return errors;
                            }}
                            onSubmit={(values, { setSubmitting }) => {
                                setTimeout(() => {
                                    alert(JSON.stringify(values, null, 2));
                                    setSubmitting(false);
                                }, 400);
                            }}
                        >
                            {({save})=>(
                                <Form>
                                    <Grid container className="educationforms">
                                        <Grid item xs={4}>
                                            <FormLabel>Party level <sup>*</sup></FormLabel>
                                            <Selectfield name="partylevel"/>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <FormLabel>Unit</FormLabel>
                                            <Selectfield name="unit"/>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <FormLabel>Designation</FormLabel>
                                            <Selectfield name="designation"/>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <FormLabel  fullwidth>Start Year</FormLabel><br/>
                                            <Startdatepicker/>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <FormLabel>End / Passing Year</FormLabel>
                                            <Enddatepicker/>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Button className="cancelbtn cancel" variant="outlined">Cancel</Button>
                                            <Button className="nextbtn save" variant="contained">Save</Button>
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
                                    <Grid container sx={{my:3}}>
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
                                                <Startdatepicker/>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <FormLabel>End Year</FormLabel>
                                                <Enddatepicker/>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button className="cancelbtn cancel" variant="outlined">Cancel</Button>
                                                <Button className="nextbtn save" variant="contained">Save</Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid container>
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
                                                name="desc"
                                                multiline
                                                minRows={3}
                                                maxRows={4}
                                                placeholder="Please enter your Organization description."
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container >
                                        <Grid item sx={{mt:3}} xs={12}>
                                            <Typography variant="h5" content="h5">
                                                <Box className="detailnumbers" component="div" sx={{ display: 'inline-block' }}>4</Box> Electoral / Government <sup>*</sup>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4} sx={{mt:2, ml:3}}>
                                            <FormLabel>Have you contested any election?</FormLabel>
                                            <div className='d-flex'>
                                                <label className='d-flex justify-content-start me-3 ' >
                                                    <Field className="w-auto me-2" type="radio" name="picked" value="One" /> Yes
                                                </label>
                                                <label className='d-flex justify-content-start'>
                                                    <Field type="radio" className="w-auto me-2" name="picked" value="Two" /> No
                                                </label>
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} sx={{mb:2}}>
                                            <Button  className="addanotherfieldsbtn me-2" onClick={handleAddField} sx={{ mb: 2 }} startIcon={<AddIcon/>}>
                                                Add More
                                            </Button>
                                            <Typography>( If fought any other election. )</Typography>
                                        </Grid>
                                    </Grid>

                                </Form>
                            )}
                        </Formik>
                    </Grid>
                    <Grid item xs={4}>
                        {/* <Button type="submit" className="savebtn" variant="contained" disabled={save}> Save Progress</Button> */}

                    </Grid>
                </Grid>

            </Box>
        </>

    )
}
export default PolticalandGovrnform