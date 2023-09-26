import { Typography, Stack, Button, Box, Paper, Grid, FormLabel, TextField,Textarea} from '@mui/material';
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { styled } from '@mui/material/styles';
import Startdatepicker from '../component/startdatepicker/startdatepicker';
import Enddatepicker from "../component/enddatepicker/enddatepicker";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import './allfroms.scss'
import Formheading from "../component/formheading/formheading";
import Savebtn from "../component/button/button";
import Selectfield from "../component/selectfield/selectfield";
import Inputfield from "../component/inputfield/inputfield";

const Educationform =()=>{
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
                    <Item><Formheading number="1" heading="Education Details" /></Item>
                    <Item sx={{textAlign:'right'}}><Savebtn/></Item>
                </Stack>
                <Grid className='detailFrom' container spacing={2}>
                    <Grid item xs={12}>
                        <Formik
                            initialValues={{education: "", qualification: "", college:"", board: "", school:"",profession:""}}
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
                                    <Grid container sx={{mb:4}}>
                                        <Grid item xs={4}>
                                            <FormLabel>Education Level ( Highest ) <sup>*</sup></FormLabel>
                                            <Selectfield name="religion"/>
                                            <ErrorMessage name="education" component="div" />
                                        </Grid>
                                    </Grid>
                                    <Grid container className="educationforms">
                                        <Grid item xs={12}>
                                            <Typography variant="h5" content="h5">
                                                Enter your educational detail ( All )
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <FormLabel>Qualification <sup>*</sup></FormLabel>
                                            <Selectfield name="qualification"/>
                                            <ErrorMessage name="qualification" component="div" />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <FormLabel>Course / Branch / Subject</FormLabel>
                                            <Inputfield type="text"
                                                        name="course"
                                                        placeholder="Enter Course / Branch / Subject"/>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <FormLabel>University / Board <sup>*</sup></FormLabel>
                                            <Inputfield type="text"
                                                        name="university"
                                                        placeholder="Enter University / Board"/>

                                        </Grid>
                                        <Grid item xs={4}>
                                            <FormLabel>College / School <sup>*</sup></FormLabel>
                                            <Inputfield type="text"
                                                        name="college"
                                                        placeholder="Enter College / School"/>
                                            <ErrorMessage name="college" component="div" />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <FormLabel  fullwidth>Start Year</FormLabel><br/>
                                            <Startdatepicker/>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <FormLabel>End / Passing Year</FormLabel><br/>
                                            <Enddatepicker/>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Button className="cancelbtn cancel" variant="outlined">Cancel</Button>
                                            <Button className="nextbtn save" variant="contained">Save</Button>
                                        </Grid>
                                    </Grid>
                                    <Grid container sx={{my:3}}>
                                        <Grid item sx={{mb:2}} xs={12}>
                                            <Typography variant="h5" content="h5">
                                                <Box className="detailnumbers" component="div" sx={{ display: 'inline-block' }}>2</Box> Professional Profile
                                            </Typography>
                                        </Grid>
                                        <Grid container className="educationforms">
                                            <Grid item xs={4}>
                                                <FormLabel>Profession <sup>*</sup></FormLabel>
                                                <Inputfield type="text"
                                                            name="profession"
                                                            placeholder="Enter profession"/>
                                                <ErrorMessage name="profession" component="div" />
                                            </Grid>
                                            <Grid item xs={4}>
                                                <FormLabel>Course / Branch / Subject</FormLabel>
                                                <Inputfield type="text"
                                                            name="sub"
                                                            placeholder="Enter Course / Branch / Subject"/>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <FormLabel>Position</FormLabel>
                                                <Inputfield type="text"
                                                            name="position"
                                                            placeholder="Enter Position"/>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <FormLabel>Organization Name</FormLabel>
                                                <Inputfield type="text"
                                                            name="organization"
                                                            placeholder="Enter Organization Name"/>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <FormLabel  fullwidth>Start Year</FormLabel><br/>
                                                <Startdatepicker/>
                                            </Grid>
                                            <Grid item xs={4} textend>
                                                <FormLabel>End / Passing Year</FormLabel><br/>
                                                <Enddatepicker/>
                                                <FormLabel className="checkbox align-items-center d-flex"><Field type="checkbox"  className="w-auto me-1" name="checked" value="One" /> Currently Working </FormLabel>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button className="cancelbtn cancel" variant="outlined">Cancel</Button>
                                                <Button className="nextbtn save" variant="contained">Save</Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid container sx={{spacing:0}}>
                                        <Grid item xs={12}>
                                            <FormLabel>Description <InfoOutlinedIcon/></FormLabel>
                                            <TextField
                                                className='p-0'
                                                fullWidth
                                                name="desc"
                                                multiline
                                                minRows={3}
                                                maxRows={4}
                                                placeholder="Please enter your professional description only, anything related to  Sangathan not to be entered here"
                                            />
                                        </Grid>
                                    </Grid>
                                </Form>
                            )}
                        </Formik>
                    </Grid>
                </Grid>

            </Box>
        </>

    )
}
export default Educationform