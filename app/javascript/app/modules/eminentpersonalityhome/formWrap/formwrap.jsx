import React, {useState} from "react"
import {Stack, Typography, Button, Box, Paper, Grid, FormLabel} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { styled } from '@mui/material/styles';
import ImageUpload from '../component/imageupload/imageupload';
import Age from '../../../../../../public/images/age.svg'
import Formheading from "../component/formheading/formheading";
import Savebtn from "../component/saveprogressbutton/button";
import Selectfield from "../component/selectfield/selectfield";
import Inputfield from "../component/inputfield/inputfield";
import Personaldetailsform from "../eminentforms/personaldetails";
import Communicationform from "../eminentforms/communication";
import Educationform from "../eminentforms/educationandprofession";
import PolticalandGovrnform from "../eminentforms/politicalandgovernmant";
import Resumeform from "../eminentforms/resume";
import Refferedform from "../eminentforms/reffer";
import '../eminentforms/allfroms.scss'
const FormWrap=()=>{
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor:'transparent',
        boxShadow:'none',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        flexGrow: 1,
    }));
    const [activeStep, setActiveStep] = React.useState(0);
    const [formData, setFormData] = useState({});
    return(
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Grid className='detailFrom' container spacing={2}>
                    <Grid item xs={8}>
                        <Formik
                            initialValues={{fullname: "", mobilenumber:"", religion: "", gender: "", category:"",caste:"",subcaste:"",date:"", month:"", year:"", mobile: "", email: "", address: "", pincode:"",area:"",town:"",state:"" }}
                            validate={(values) => {
                                const errors = {};
                                if (!values.fullname) {
                                    errors.fullname = "Required";
                                }
                                if (!values.mobilenumber) {
                                    errors.mobilenumber = "Required";
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
                                if (!values.email) {
                                    errors.email = "Required";
                                } else if (
                                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                                ) {
                                    errors.email = "Invalid email address";
                                }
                                if (!values.address) {
                                    errors.address = "Required";
                                }
                                if (!values.pincode) {
                                    errors.pincode = "Required";
                                }
                                if (!values.area) {
                                    errors.area = "Required";
                                }
                                if (!values.town) {
                                    errors.town = "Required";
                                }
                                if (!values.state) {
                                    errors.state = "Required";
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
                                   
                                   {activeStep === 0 && (
                                        <>
                                            <Personaldetailsform  data={formData[0]}/>
                                        </>
                                        )}
                                            {activeStep === 1 && (
                                                <>
                                                    <Communicationform/>
                                                </>
                                            )}
                                            {activeStep === 2 && (
                                                <>
                                                    <Educationform/>
                                                </>
                                            )}
                                            {activeStep === 3 && (
                                                <>
                                                    <PolticalandGovrnform/>
                                                </>
                                            )}
                                            {activeStep === 4 && (
                                                <>
                                                    <Resumeform/>
                                                </>
                                            )}
                                            {activeStep === 5 && (
                                                <>
                                                    <Refferedform/>
                                                </>
                                            )}

                                    </Form>
                            )}
                        </Formik>
                    </Grid>
                </Grid>
            </Box>
                    
        </>

    )
}
export default FormWrap;