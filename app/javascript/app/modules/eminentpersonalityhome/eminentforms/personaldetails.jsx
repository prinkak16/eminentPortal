import React, {useEffect, useState} from "react"
import {Stack, Typography, Box, Paper, Grid, FormLabel, TextField} from '@mui/material';
import {Formik, Field, Form, ErrorMessage} from 'formik';
import {styled} from '@mui/material/styles';
import ImageUpload from '../component/imageupload/imageupload';
import './allfroms.scss'
import Age from '../../../../../../public/images/age.svg'
import Formheading from "../component/formheading/formheading";
import Savebtn from "../component/saveprogressbutton/button";
import Selectfield from "../component/selectfield/selectfield";
import Inputfield from "../component/inputfield/inputfield";
import DeleteIcon from '@mui/icons-material/Delete';
import {getFormData, getReligionData, getStepCtgry} from "../../../api/stepperApiEndpoints/stepperapiendpoints";
import * as Yup from 'yup';
const Personaldetailsform = (props) => {
    const Item = styled(Paper)(({theme}) => ({
        backgroundColor: 'transparent',
        boxShadow: 'none',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        flexGrow: 1,
    }));
    const [selectedOption, setSelectedOption] = useState('');
    const [dropDownDataCategory, setDropDownDataCategory] = useState([]);
    const [ReligionData, setReligionData] = useState([]);
    const selectChange = (e) => {
        setSelectedOption(e.target.value);
    };
    useEffect(() => {
        getcatgry()
        getReligion()
    }, [])
    const getcatgry = () => {
        getStepCtgry.then(
            (res) => {
                setDropDownDataCategory(res.data.data)
            }
        )

    }
    const getReligion=()=>{
        getReligionData.then((response) => {
            setReligionData(response.data.data)
            console.log('API response:', response.data);
        })
    }

    function validateMobile(value) {
        const mobileRegex = /^[0-9]{10}$/; // Regex for 10-digit numeric mobile number
        if (!mobileRegex.test(value)) {
            return 'Mobile number must be exactly 10 digits';
        }
        return undefined; // Return undefined if the value is valid
    }
    return (
        <>
            <Formik
                initialValues={{
                    name: "",
                    mobile: "",
                    religion: "",
                    gender: "",
                    category: "",
                    caste: "",
                    sub_caste: "",
                    dob: "",
                    photo: "",
                    languages: "",
                    aadhar: "",
                    voter_id: "",
                }}
                validate={(values) => {
                    const errors = {};
                    if (!values.name) {
                        errors.name = "Please enter a name";
                    }
                    if (!values.mobile) {
                        errors.mobile = "Required"
                    } else if (
                        /^([0]{1}|\+?[234]{x`})([7-9]{1})([0|1]{1})([\d]{1})([\d]{7})$/g.test(values.mobile)
                    ) {
                        errors.mobile = "Please enter valid phone number"
                    }
                    if (!values.religion) {
                        errors.religion = "Please select religion";
                    }
                    if (!values.gender) {
                        errors.gender = "Required";
                    }
                    if (!values.category) {
                        errors.category = "Required";
                    }
                    if (!values.caste) {
                        errors.caste = "Required";
                    }
                    if (!values.sub_caste) {
                        errors.sub_caste = "Required";
                    }
                    if (!values.dob) {
                        errors.dob = "Required";
                    }
                    props.enableProgressAction(Object.keys(errors).length === 0);
                    return errors;
                }}
                onSubmit={(values, {setSubmitting}) => {
                    setTimeout(() => {
                        alert(JSON.stringify(values, null, 2));
                        setSubmitting(false);
                        getFormData(values).then(response => {
                                console.log('API response:', response.data);
                            })

                    }, 400);


                }}
            >
                {({isSubmitting}) => (
                    <Form>
                        <Box sx={{flexGrow: 1}}>
                            <Stack className="mb-4" direction="row" useFlexGap flexWrap="wrap">
                                <Item><Formheading number="1" heading="Personal Detail"/></Item>
                                <Item sx={{textAlign: 'right'}}>
                                    <Savebtn handleSave={isSubmitting}/>
                                </Item>
                            </Stack>
                            <Grid className='detailFrom' container spacing={2}>
                                <Grid item xs={8}>
                                    <Grid className="grid-wrap" container spacing={2} sx={{mb: 5}}>
                                        <Grid item xs={6}>

                                            <FormLabel>Fullname <sup>*</sup></FormLabel>
                                            <Inputfield endicon={<DeleteIcon/>} type="text" name="name"
                                                        placeholder="Fullname (As Per Pan Card)"/>
                                            <ErrorMessage name="name" component="div"/>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Mobile Number <sup>*</sup></FormLabel>
                                            <Inputfield type="number"
                                                        name="mobile"
                                                        placeholder="Enter Mobile No."
                                                        maxnumber="10"
                                                        validatefield="validateMobile"/>

                                            <ErrorMessage name="mobile" component="div"/>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Religion <sup>*</sup></FormLabel>
                                            <Selectfield name="religion" selectedvalues={selectedOption}
                                                         handleSelectChange={selectChange}
                                                         optionList={ReligionData}/>
                                            <ErrorMessage name="religion" component="div"/>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Gender <sup>*</sup></FormLabel>
                                            <Selectfield name="gender" selectedvalues={selectedOption}
                                                         handleSelectChange={selectChange}
                                                         optionList={['Female', 'Male', 'Other']}/>
                                            <ErrorMessage name="gender" component="div"/>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Category <sup>*</sup></FormLabel>
                                            <Selectfield name="category" selectedvalues={selectedOption}
                                                         handleSelectChange={selectChange}
                                                         optionList={dropDownDataCategory}/>
                                            <ErrorMessage name="category" component="div"/>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Caste <sup>*</sup></FormLabel>
                                            <Inputfield type="text" name="caste" placeholder="Enter Caste"/>
                                            <ErrorMessage name="caste" component="div"/>
                                        </Grid>
                                        <Grid item xs={6} className="mb-md-0">
                                            <FormLabel>Sub Caste <sup>*</sup></FormLabel>
                                            <Inputfield type="text" name="sub_caste" placeholder="Enter Sub Caste"/>
                                            <ErrorMessage name="sub_caste" component="div"/>
                                        </Grid>
                                        <Grid item xs={6} className="mb-md-0">
                                            <FormLabel>Date of birth <sup>*</sup></FormLabel>
                                            <Grid className='detailFrom' container spacing={2}>
                                                <Grid item xs={2}>
                                                    <Inputfield type="text"
                                                                name="dob"
                                                                placeholder="DD"/>

                                                    <ErrorMessage name="dob" component="div"/>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Inputfield type="text"
                                                                name="dob"
                                                                placeholder="MM"/>

                                                    <ErrorMessage name="dob" component="div" />
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Inputfield type="text"
                                                                name="dob"
                                                                placeholder="YYYY"/>

                                                    <ErrorMessage name="dob" component="div" />
                                                </Grid>
                                            </Grid>
                                            <Typography><Age alt='age'/> 44 Years</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Languages known</FormLabel>
                                            <Selectfield name="languages" selectedvalues={selectedOption}
                                                         handleSelectChange={selectChange}
                                                         optionList={['Select Languge']}/>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2} sx={{mb: 5}}>
                                        <Grid item xs={12}>
                                            <Formheading number="2" heading="ID Proof"/>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Aadhar No. (optional)</FormLabel>
                                            <Inputfield type="text"
                                                        name="aadhaar"
                                                        placeholder="XXXX-XXXX-XXXX"/>

                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Voter Id. (optional)</FormLabel>
                                            <Inputfield type="text"
                                                        name="voter_id"
                                                        placeholder="Voter Id. (optional)"/>

                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={4}>
                                    <Item>
                                        <ImageUpload cardName="Input Image"/>
                                    </Item>
                                </Grid>
                            </Grid>

                        </Box>

                    </Form>

                )}

            </Formik>
        </>

    )
}
export default Personaldetailsform;
