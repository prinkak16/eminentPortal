import { Typography, Stack, Box, Paper, Grid, FormLabel, TextField} from '@mui/material';
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { styled } from '@mui/material/styles';
import Startdatepicker from '../component/startdatepicker/startdatepicker';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Formheading from "../component/formheading/formheading";
import Savebtn from "../component/saveprogressbutton/button";
import Selectfield from "../component/selectfield/selectfield";
import Inputfield from "../component/inputfield/inputfield";
import Primarybutton from '../component/primarybutton/primarybutton';
const Educationform =(props)=>{
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor:'transparent',
        boxShadow:'none',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        flexGrow: 1,
    }));

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
                            initialValues={{qualification: "", subject:"" , college:"", board: "", school:"",profession:""}}
                            validate={(values) => {
                                const errors = {};
                                if (!values.qualification) {
                                    errors.qualification = "Required";
                                }
                                if (!values.subject) {
                                    errors.subject = "Required";
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
                                props.enableProgressAction(Objects.keys(errors).length===0);
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
                                    <Grid container sx={{mb:5}} >
                                        <Grid item xs={6} className='education-field pb-3'>
                                            <Grid item xs={7}>
                                                <FormLabel>Education Level ( Highest ) <sup>*</sup></FormLabel>
                                                <Selectfield name="qualification"  optionList={['Select Highest Education','Delhi','Gurugram']}/>
                                                <ErrorMessage name="qualification" component="div" />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid container className="educationforms grid-wrap" >
                                        <Grid item xs={12}>
                                            <Typography variant="h5" content="h5">
                                                Enter your educational detail ( All )
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <FormLabel>Qualification <sup>*</sup></FormLabel>
                                            <Selectfield name="qualification"  optionList={['Select Qualification','Delhi','Gurugram']}/>
                                            <ErrorMessage name="qualification" component="div" />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <FormLabel>Course / Branch / Subject</FormLabel>
                                            <Inputfield type="text"
                                                        name="subject"
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
                                            <Startdatepicker  year="start_year"/>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <FormLabel>End / Passing Year</FormLabel><br/>
                                            <Startdatepicker year="end_year"/>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Primarybutton addclass="cancelbtn cancel" buttonlabel="Cancel"/>
                                            <Primarybutton addclass="nextbtn" buttonlabel="Save"/>
                                        </Grid>
                                    </Grid>
                                    <Grid container sx={{my:5}} className="grid-wrap">
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
                                                            name="subject"
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
                                                <Startdatepicker  year="start_year"/>
                                            </Grid>
                                            <Grid item xs={4} textend>
                                                <FormLabel>End / Passing Year</FormLabel><br/>
                                                <Startdatepicker  year="end_year"/>
                                                <FormLabel className="checkbox align-items-center d-flex"><Field type="checkbox"  className="w-auto me-1" name="checked" value="One" /> Currently Working </FormLabel>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Primarybutton addclass="cancelbtn cancel" buttonlabel="Cancel"/>
                                                <Primarybutton addclass="nextbtn" buttonlabel="Save"/>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid container sx={{spacing:0}}>
                                        <Grid item xs={8}>
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