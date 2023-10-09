import React, {useEffect, useState} from "react"
import {Stack, Typography, Box, Paper, Grid, FormLabel, TextField} from '@mui/material';
import {Formik, Form, ErrorMessage, Field} from 'formik';
import {styled} from '@mui/material/styles';
import ImageUpload from '../component/imageupload/imageupload';
import './allfroms.scss'
import Age from '../../../../../../public/images/age.svg'
import Formheading from "../component/formheading/formheading";
import Savebtn from "../component/saveprogressbutton/button";
import Selectfield from "../component/selectfield/selectfield";
import Inputfield from "../component/inputfield/inputfield";
import {
    getFormData,
    getGenderData,
    getReligionData,
    getStepCtgry
} from "../../../api/stepperApiEndpoints/stepperapiendpoints";
import NumberField from "../component/numberfield/numberfield";

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
    const[GenderData, setGenderData]= useState([]);
    const [savedFormValues, setSavedFormValues] = useState(null);
    const selectChange = (e) => {
        setSelectedOption(e.target.value);
    };
    useEffect(() => {
        getcatgry()
        getReligion()
        getGenders()
        const savedValues = getSavedFormValues(); // Implement this function to retrieve saved values
        if (savedValues) {
            setSavedFormValues(savedValues);
        }
    }, [])

    const handleFieldChange = (fieldName, fieldValue) => {
        setSavedFormValues((prevValues) => ({
            ...prevValues,
            [fieldName]: fieldValue,
        }));
    };
    const getSavedFormValues = () => {
        try {
            const savedValuesString = localStorage.getItem('savedFormValues');
            if (savedValuesString) {
                return JSON.parse(savedValuesString);
            }
        } catch (error) {
            console.error('Error loading saved form values:', error);
        }
        return null; // Return null if there are no saved values or an error occurs
    };

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
        })
    }
    const getGenders=()=>{
        getGenderData.then((response)=>{
            setGenderData(response.data.data)})
    }

    const [activeField, setActiveField] = useState("day");

    // const handleFieldChange = (fieldName) => {
    //     setActiveField(fieldName);
    // };




    const [inputValues, setInputValues] = useState({
        day: '',
        month: '',
        year: '',
    });

    const handleInput = (fieldName, value) => {
        if (value.length === 2) {
            // Move to the next field
            const nextField = getNextField(fieldName);
            if (nextField) {
                document.getElementsByName(nextField)[0].focus();
            }
        }
        setInputValues({
            ...inputValues,
            [fieldName]: value,
        });
    };

    const getNextField = (currentField) => {
        const fieldNames = ['day', 'month', 'year'];
        const currentIndex = fieldNames.indexOf(currentField);
        if (currentIndex < 0 || currentIndex === fieldNames.length - 1) {
            return null; // No next field
        }
        return fieldNames[currentIndex + 1];
    };
    const validateAadhaar = (value) => {
        if (!value) {
            return null; // Field is empty, so no validation error
        }
        const aadhaarPattern = /^\d{12}$/;
        if (!aadhaarPattern.test(value)) {
            return 'Invalid Aadhaar number. It should be a 12-digit number.';
        }
        return null;
    };
    const validateVoterId = (value) => {
        if (!value) {
            return null; // Field is empty, so no validation error
        }
        const voterIdPattern = /^[A-Z]{3}[0-9]{7}$/;
       if (!voterIdPattern.test(value)) {
            return 'Invalid Voter ID format. It should be three uppercase letters followed by seven digits (e.g., ABC1234567)';
        }
        return null;
    };









    return (
        <>
            <Formik
                initialValues={savedFormValues ||{
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
                    aadhaar: "",
                    voter_id: "",
                    day: "",
                    month: "",
                    year: ""
                }}
                validate={(values) => {
                    const errors = {};
                    if (!/^[A-Za-z]+$/i.test(values.name)) {
                        errors.name = "Please enter a name containing only letters.";
                    }
                //     if (!values.mobile) {
                //         errors.mobile = "Required"
                //     }
                //     if (!values.religion) {
                //         errors.religion = "Please select religion";
                //     }
                //     if (!values.gender) {
                //         errors.gender = "Required";
                //     }
                //     if (!values.category) {
                //         errors.category = "Required";
                //     }
                //     if (!values.caste) {
                //         errors.caste = "Required";
                //     }
                //     if (!values.sub_caste) {
                //         errors.sub_caste = "Required";
                //     }
                //     if (!values.dob) {
                //         errors.dob = "Required";
                //     }

                    const aadhaarError = validateAadhaar(values.aadhaar);
                    if (aadhaarError) {
                        errors.aadhaar = aadhaarError;
                    }
                    // const voterIdError = validateVoterId(values.voter_id);
                    // if (voterIdError) {
                    //     errors.voter_id = voterIdError;
                    // }
                    props.onSubmit()
                    props.enableProgressAction(Object.keys(errors).length === 0);
                    return errors;
                }}
                onSubmit={(values, {setSubmitting}) => {
                    setTimeout(() => {
                        alert(JSON.stringify(values, null, 2));
                        setSubmitting(false);

                    }, 400);
                }}
            >
                {({  isSubmitting, values, handleChange, handleBlur}) => (
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
                                            <Inputfield type="text" name="name" placeholder="Enter Fullname"/>
                                            <ErrorMessage name="name" component="div"/>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Mobile Number <sup>*</sup></FormLabel>
                                            <NumberField
                                                id="outlined-number"
                                                name="mobile"
                                                placeholder='Search by phone no.'
                                                onInput={(event) => {
                                                    // Remove non-numeric characters and limit the length to 10 characters
                                                    event.target.value = event.target.value.replace(/\D/g, '').slice(0, 10);
                                                }}
                                                inputProps={{
                                                    maxLength: 10,
                                                }}
                                                />
                                            <ErrorMessage name="mobile" component="div"/>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Religion <sup>*</sup></FormLabel>
                                            <Selectfield name="religion" selectedvalues={selectedOption}

                                                         handleSelectChange={selectChange}
                                                         defaultOption="Select Religion"
                                                         optionList={ReligionData}/>
                                            <ErrorMessage name="religion" component="div"/>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Gender <sup>*</sup></FormLabel>
                                            <Selectfield name="gender" selectedvalues={selectedOption}
                                                         defaultOption="Select Gender"
                                                         handleSelectChange={selectChange}
                                                         optionList={GenderData}/>
                                            <ErrorMessage name="gender" component="div"/>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Category <sup>*</sup></FormLabel>
                                            <Selectfield name="category" selectedvalues={selectedOption}
                                                         defaultOption="Select Category"
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
                                                        <Field
                                                            type="number"
                                                            name="dob"
                                                            placeholder="DD"
                                                            as={TextField}
                                                            fullWidth
                                                            value={inputValues.day}
                                                            onInput={(e) => handleInput('day', e.target.value)}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        <Field
                                                            type="number"
                                                            name="month"
                                                            placeholder="MM"
                                                            as={TextField}
                                                            fullWidth
                                                            value={inputValues.month}
                                                            onInput={(e) => handleInput('month', e.target.value)}
                                                        />
                                                        <ErrorMessage name="month" component="div" />
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        <Field
                                                            type="number"
                                                            name="year"
                                                            placeholder="YYYY"
                                                            as={TextField}
                                                            fullWidth
                                                            value={inputValues.year}
                                                            onInput={(e) => handleInput('year', e.target.value)}
                                                        />
                                                        <ErrorMessage name="year" component="div" />
                                                    </Grid>
                                            </Grid>
                                            <Typography><Age alt='age'/> 44 Years</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Languages known</FormLabel>
                                            <Selectfield name="languages" selectedvalues={selectedOption}
                                                         defaultOption="Select Language"
                                                         handleSelectChange={selectChange}
                                                         optionList={dropDownDataCategory}/>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2} sx={{mb: 5}}>
                                        <Grid item xs={12}>
                                            <Formheading number="2" heading="ID Proof"/>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Aadhaar No. (optional)</FormLabel>
                                            <NumberField
                                                name="aadhaar"
                                                placeholder='Enter Addhar number'
                                                inputProps={{
                                                    maxLength: 12,
                                                }}
                                                />
                                            <ErrorMessage name="aadhaar" component="div" />

                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Voter Id. (optional)</FormLabel>
                                            <Field
                                                type="text"
                                                id="voter_id"
                                                name="voter_id"
                                                placeholder="Enter Voter ID"
                                                as={TextField}
                                            />
                                            <ErrorMessage name="voter_id" component="div" className="error"/>
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
