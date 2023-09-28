import React from "react"
import {Stack, Typography, Button, Box, Paper, Grid, FormLabel} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { styled } from '@mui/material/styles';
import ImageUpload from '../component/imageupload/imageupload';
import './allfroms.scss'
import Age from '../../../../../../public/images/age.svg'
import Formheading from "../component/formheading/formheading";
import Savebtn from "../component/saveprogressbutton/button";
import Selectfield from "../component/selectfield/selectfield";
import Inputfield from "../component/inputfield/inputfield";
const Personaldetailsform=()=>{
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
                    <Item><Formheading number="1" heading="Personal Detail" /></Item>
                    <Item sx={{textAlign:'right'}}><Savebtn handleSave={() => {save.submitForm()}}/></Item>
                </Stack>
                <Grid className='detailFrom' container spacing={2}>
                    <Grid item xs={8}>
                        <Formik
                            initialValues={{fullname: "", religion: "", gender: "", category:"",caste:"",subcaste:"",date:"", month:"", year:"" }}
                            validate={(values) => {
                                const errors = {};
                                if (!values.fullname) {
                                    errors.fullname = "Required";
                                }
                                if (!values.religion) {
                                    errors.religion = "Required";
                                }
                                if (!values.gender) {
                                    errors.gender = "Required";
                                }
                                if (!values.category) {
                                    errors.category = "Required";
                                }
                                if (!values.caste) {
                                    errors.religion = "Required";
                                }
                                if (!values.subcaste) {
                                    errors.subcaste = "Required";
                                }
                                if (!values.date) {
                                    errors.date = "Required";
                                }
                                if (!values.month) {
                                    errors.month = "Required";
                                }
                                if (!values.year) {
                                    errors.year = "Required";
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
                                    <Grid  className="grid-wrap" container spacing={2} sx={{mb:5}}>
                                        <Grid item xs={12}>
                                            <FormLabel>Fullname <sup>*</sup></FormLabel>
                                            <Inputfield  type="text" name="fullname" placeholder="Fullname (As Per Pan Card)"/>
                                            <ErrorMessage name="fullname" component="div" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Religion <sup>*</sup></FormLabel>
                                            <Selectfield name="religion"/>
                                            <ErrorMessage name="religion" component="div" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Gender <sup>*</sup></FormLabel>
                                            <Selectfield name="gender"/>
                                            <ErrorMessage name="gender" component="div" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Category <sup>*</sup></FormLabel>
                                            <Selectfield name="category"/>
                                            <ErrorMessage name="category" component="div" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Caste <sup>*</sup></FormLabel>
                                            <Inputfield type="text" name="caste" placeholder="Enter Caste"/>
                                            <ErrorMessage name="caste" component="div" />
                                        </Grid>
                                        <Grid item xs={6} className="mb-md-0">
                                            <FormLabel>Sub Caste  <sup>*</sup></FormLabel>
                                            <Inputfield type="text" name="subcaste" placeholder="Enter Sub Caste"/>
                                            <ErrorMessage name="subcaste" component="div" />
                                        </Grid>
                                        <Grid item xs={6} className="mb-md-0">
                                            <FormLabel>Date of birth  <sup>*</sup></FormLabel>
                                            <Grid className='detailFrom' container spacing={2}>
                                                <Grid item xs={4}>
                                                    <Inputfield type="text"
                                                                name="date"
                                                                placeholder="DD"/>

                                                    <ErrorMessage name="date" component="div" />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <Inputfield type="text"
                                                                name="month"
                                                                placeholder="MM"/>

                                                    <ErrorMessage name="month" component="div" />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <Inputfield type="text"
                                                                name="year"
                                                                placeholder="YYYY"/>

                                                    <ErrorMessage name="year" component="div" />
                                                </Grid>
                                            </Grid>
                                            <Typography><Age alt='age'/> 44 Years</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Languages known</FormLabel>
                                            <Selectfield name="languageknown"/>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2} sx={{mb:5}}>
                                        <Grid item xs={12}>
                                            <Formheading number="2" heading="ID Proof" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Aadhar No. (optional)</FormLabel>
                                            <Inputfield type="text"
                                                        name="aadharno"
                                                        placeholder="XXXX-XXXX-XXXX"/>

                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Voter Id. (optional)</FormLabel>
                                            <Inputfield type="text"
                                                        name="voterid"
                                                        placeholder="Voter Id. (optional)"/>

                                        </Grid>
                                    </Grid>

                                </Form>
                            )}

                        </Formik>
                    </Grid>
                    <Grid item xs={4}>

                        <Item>
                            <ImageUpload cardName="Input Image"/>
                        </Item>
                    </Grid>
                </Grid>
            </Box>
        </>

    )
}
export default Personaldetailsform;
