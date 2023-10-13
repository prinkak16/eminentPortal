import React, {useEffect, useState} from "react"
import {Stack, Typography, Box, Paper, Grid, FormLabel, TextField, Select} from '@mui/material';
import {ErrorMessage, Field} from 'formik';
import {styled} from '@mui/material/styles';
import ImageUpload from '../component/imageupload/imageupload';
import './allfroms.scss'
import Age from '../../../../../../public/images/age.svg'
import Formheading from "../component/formheading/formheading";
import Savebtn from "../component/saveprogressbutton/button";
import SelectField from "../component/selectfield/selectfield";
import Inputfield from "../component/inputfield/inputfield";
import {
    getFormData,
    getGenderData,
    getReligionData,
    getStepCtgry
} from "../../../api/stepperApiEndpoints/stepperapiendpoints";
import NumberField from "../component/numberfield/numberfield";
import * as Yup from "yup";

const PersonalDetails = props => {
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
    const selectChange = (e) => {
        console.log(`e`, e);
        setSelectedOption(e.target.value);
    };
    useEffect(() => {
        getcatgry()
        getReligion()
        getGenders() // Implement this function to retrieve saved values
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
        })
    }
    const getGenders=()=>{
        getGenderData.then((response)=>{
            setGenderData(response.data.data)})
    }
    const [activeField, setActiveField] = useState("day");
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
    const nameOptions = [
        { text: "Services", value: "Services" },
        { text: "Retail", value: "Retail" }
    ];
    return (
        <>
            <Box sx={{flexGrow: 1}}>
                <Stack className="mb-4" direction="row" useFlexGap flexWrap="wrap">
                    <Item><Formheading number="1" heading="Personal Detail"/></Item>
                    <Item sx={{textAlign: 'right'}}>
                        <Savebtn />
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
                                    name="mobile"
                                    placeholder='Search by phone no.'

                                />
                                <ErrorMessage name="mobile" component="div" as={TextField} />
                            </Grid>
                            <Grid item xs={6}>
                                <FormLabel>Religion <sup>*</sup></FormLabel>
                                <SelectField name="religion" selectedvalues={selectedOption}
                                             handleSelectChange={selectChange}
                                             defaultOption="Select Religion"
                                             optionList={ReligionData}/>
                                <ErrorMessage name="religion" component="div"/>
                            </Grid>
                            <Grid item xs={6}>
                                <FormLabel>Gender <sup>*</sup></FormLabel>
                                <SelectField name="gender" selectedvalues={selectedOption}
                                             defaultOption="Select Gender"
                                             handleSelectChange={selectChange}
                                             optionList={GenderData}/>
                                <ErrorMessage name="gender" component="div"/>
                            </Grid>
                            <Grid item xs={6}>
                                <FormLabel>Category <sup>*</sup></FormLabel>
                                <SelectField name="category" selectedvalues={selectedOption}
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
                                            value={inputValues.dob}
                                            onInput={(e) => handleInput('dob', e.target.value)}
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
                                <SelectField name="languages" selectedvalues={selectedOption}
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
                            <ImageUpload
                                validationSchema={props.validationSchema}
                                isSubmitting={props.isSubmitting}
                                cardName="Input Image"/>
                        </Item>
                    </Grid>
                </Grid>

            </Box>
        </>

    );
}
PersonalDetails.label="Personal Details"
PersonalDetails.initialValues = {
    name: "",
    mobile: "",
    religion: "",
    gender: "",
    category: "",
    caste: "",
    sub_caste: "",
    dob: "",
    // photo: "",
    languages: "",
    aadhaar: "",
    voter_id: "",
    // day: "",
    month: "",
    year: ""
};
PersonalDetails.validationSchema = Yup.object().shape({
    name: Yup.string().required('Please enter your first name'),
    mobile: Yup.string()
        .test('first-digit-greater-than-4', 'First digit must be greater or equal to 5', (value) => {
            if (!value) return true; // No validation if the field is empty
            const mobileNumbers = value.split(',').map((number) => number.trim());
            return mobileNumbers.every((number) => {
                const firstDigit = parseInt(number.charAt(0));
                return !isNaN(firstDigit) && firstDigit > 4;
            });
        })
        .test('at-least-10-digits', 'Mobile numbers must be at least 10 digits long', (value) => {
            if (!value) return true; // No validation if the field is empty
            const mobileNumbers = value.split(',').map((number) => number.trim());
            return mobileNumbers.every((number) => number.length === 10);
        })
        .required('Please enter at least one contact number'),
    religion: Yup.string().required('Please select your Religion'),
    gender: Yup.string().required('Please select your Gender'),
    category: Yup.string().required('Please select your Category'),
    caste: Yup.string().required('Please select your Caste'),
    dob: Yup.string().required('Please enter your Date of Birth'),
    // photo: Yup.mixed().required('Please upload your photo'),
    languages: Yup.string().required('Please select your Category'),

});
export default PersonalDetails;
