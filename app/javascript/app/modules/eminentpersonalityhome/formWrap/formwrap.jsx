import React from "react"
import {Stack, Typography, Button, Box, Paper, Grid, FormLabel} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import './allfroms.scss'
import Savebtn from "../component/saveprogressbutton/button";
import Personaldetailsform from "../eminentforms/personaldetails";
const FormWrap=()=>{
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor:'transparent',
        boxShadow:'none',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        flexGrow: 1,
    }));
    return(
        <>
            
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
                                    <Form onSubmit={handleSubmit}>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Grid className='detailFrom' container spacing={2}>
                                                <Personaldetailsform/>
                                            </Grid>
                                        </Box>
                                      
                                                                               
                                    </Form>
                            )}

                            </Formik>
        </>

    )
}
export default FormWrap;