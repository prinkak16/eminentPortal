import React, {useEffect, useState} from "react"
import {FormControl, Stack, Typography, Box, Paper, Grid, FormLabel, TextField, Select, Button, MenuItem, Checkbox, ListItemText} from '@mui/material';
import {ErrorMessage, Field, useFormikContext} from 'formik';
import {styled} from '@mui/material/styles';
import ImageUpload from '../component/imageupload/imageupload';
import './allfroms.scss'
import Age from '../../../../../../public/images/age.svg'
import Formheading from "../component/formheading/formheading";
import Savebtn from "../component/saveprogressbutton/button";
import SelectField from "../component/selectfield/selectfield";
import Inputfield from "../component/inputfield/inputfield";
import { Formik, useFormik } from 'formik';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
    getFileUpload,
    getFormData,
    getGenderData,
    getReligionData,
    getStepCtgry
} from "../../../api/stepperApiEndpoints/stepperapiendpoints";
import NumberField from "../component/numberfield/numberfield";
import * as Yup from "yup";
import { useDeviceInfo } from '../context/deviceinfocontext';
import use from "use";
import {string} from "yup";
import Startdatepicker from "../component/startdatepicker/startdatepicker";
const PersonalDetails = (props) => {
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
    const[selectedLanguages, setSelectedLanguages]= useState([]);
    const selectChange = (e) => {
        setSelectedOption(e.target.value);
    };
    useEffect(() => {
        getcatgry()
        getReligion()
        getGenders()
    }, [])

    useEffect(() => {
        if (props?.stepDataFlag) {
            props.setStepData(props.formValues);
        }
    }, [props.stepDataFlag]);
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
    const handleViewPdf = () => {
        window.open(pdfUrl, "_blank");
    };
const saveProgress=()=>{
    const fieldsWithValues = {};
    for (const fieldName of Object.keys(props.formValues)) {
        const fieldValue = props.formValues[fieldName];
        if (fieldValue) {
            if (props.formValues[fieldName] === 'mobile') {
                fieldsWithValues[fieldName] = [fieldValue];
            }  else {
                fieldsWithValues[fieldName] = fieldValue;
            }
        }
    }
    getFormData(fieldsWithValues).then(response => {
        console.log('API response:', response.data);

    });
}
    const names = [
        'Hindi',
        'English',
        'French',
        'Punjabi',
    ];
    const handleLanguageChanges = (event) => {
        let selectedLang = []
        selectedLang = selectedLanguages
        const selcLang = event.target.textContent
        if (selectedLang.includes(selcLang)) {
            selectedLang = selectedLang.filter(item => item !== selcLang);
        } else {
            selectedLang.push(selcLang)
        }
        setSelectedLanguages(selectedLang)
    }

    const selectedLangSubmission = (type) => ()=>  {
        if (type === 'submit') {
            props.languages.value = selectedLanguages
        }
        if (type === 'cancel') {
            props.languages.value = ''
            setSelectedLanguages([])
        }
    }
    const [customDD, setCustomDD]=useState('')
    const [customMM, setCustomMM]=useState('')
    const [customYear, setCustomYear]=useState('')
    const dobCheck = (type) => (event) => {
        if (type === 'DD') {
            if(event.target.value.length === 1){
                if (event.target.value <= 3 ) {
                    setCustomDD(event.target.value)
                }
            }
            else if (event.target.value.length === 2 && event.target.value === '00') {
            }
            else{
                if (event.target.value <= 31 ) {
                    setCustomDD(event.target.value)
                }
            }
        }
        if(type==='MM'){
            if (event.target.value.length === 2 && event.target.value === '00' ) {

            } else if(event.target.value<=12){
                setCustomMM(event.target.value)
            }
        }
        if(type==='YYYY'){
            if (event.target.value.length === 2 && event.target.value === '00' ) {

            }else if (event.target.value.length === 0) {
                setCustomYear(event.target.value)
            }
            else if (event.target.value.length === 1 ) {
                if(event.target.value === '1' || event.target.value === '2'){
                    setCustomYear(event.target.value)
                }
            }
            else if (event.target.value.length === 2 ) {
                if(event.target.value === '19' || event.target.value === '20'){
                    setCustomYear(event.target.value)
                }
            }
            else if (event.target.value.length === 3 ) {
                if(parseInt(event.target.value) >= 199 && parseInt(event.target.value) <= 202){
                    setCustomYear(event.target.value)
                }
            }
            else if (event.target.value.length === 4 ) {
                if(parseInt(event.target.value) >= 1990 && parseInt(event.target.value) <= 2023){
                    setCustomYear(event.target.value)
                }
            }

        }
    }

    const updatePhotoUrl = (url) => {
        if(url && url.length > 0){
            props.formValues.photo = url;
        }
    }
    const calculateAge = (dob) => {
        if (!dob) return '';

        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();

        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    const {setFieldValue, values} = useFormikContext();
    const age = calculateAge(values.dob);

    useEffect(() => {
        if (customYear.length === 4) {
            props.formValues.dob = `${customYear}-${customMM}-${customDD}`
        }
        const newAge = calculateAge(values.dob);
        setFieldValue('age', newAge);
    }, [customYear, values.dob, setFieldValue]);


    return (
        <>
            <Box sx={{flexGrow: 1}}>
                <Stack className="mb-4" direction="row" useFlexGap flexWrap="wrap">
                    <Item><Formheading number="1" heading="Personal Detail"/></Item>
                    <Item sx={{textAlign: 'right'}}>
                        <Button onClick={saveProgress}>Save Progress</Button>
                    </Item>
                </Stack>
                <Grid className='detailFrom' container spacing={2}>
                    <Grid item xs={8}>
                        <Grid className="grid-wrap" container spacing={2} sx={{mb: 5}}>
                            <Grid item xs={6}>
                                <FormLabel>Fullname <sup>*</sup></FormLabel>
                                <Inputfield type="text" name="name" placeholder="Enter Fullname" onKeyPress={(e) => {
                                    const key = e.key;
                                    if (!/^[A-Za-z]+$/.test(key)) {
                                        e.preventDefault();
                                    }
                                }}/>
                                <ErrorMessage name="name" component="div"/>
                            </Grid>
                            <Grid item xs={6}>
                                <FormLabel>State ID</FormLabel>
                                <NumberField
                                    placeholder='Enter ID'
                                    fullWidth
                                    name="id"
                                    disabled
                                />
                                <ErrorMessage name="id" component="div"/>
                            </Grid>
                            <Grid item xs={6}>
                                <FormLabel>Mobile Number <sup>*</sup></FormLabel>
                                <Field
                                    placeholder='Please Seach by Phone no.'
                                    inputProps={{
                                        maxLength: 10,
                                    }}
                                    type="text"
                                    as={TextField}
                                    fullWidth
                                    onInput={(event) => {
                                        event.target.value = event.target.value.replace(/\D/g, '').slice(0, 10);

                                    }}
                                    name="mobiles.0"
                                />

                                <ErrorMessage name="mobiles" component="div" />
                            </Grid>
                            <Grid item xs={6}>
                                <FormLabel>Religion <sup>*</sup></FormLabel>
                                <SelectField name="religion" selectedvalues={selectedOption}
                                             handleSelectChange={selectChange}
                                             defaultOption="Select Religion"
                                             optionList={ReligionData}
                                />
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
                                <Inputfield type="text" name="caste" placeholder="Enter Caste" onKeyPress={(e) => {
                                    const key = e.key;
                                    if (!/^[A-Za-z]+$/.test(key)) {
                                        e.preventDefault();
                                    }
                                }}/>
                                <ErrorMessage name="caste" component="div"/>
                            </Grid>
                            <Grid item xs={6} className="mb-md-0">
                                <FormLabel>Sub Caste</FormLabel>
                                <Inputfield type="text" name="sub_caste" placeholder="Enter Sub Caste" onKeyPress={(e) => {
                                    const key = e.key;
                                    if (!/^[A-Za-z]+$/.test(key)) {
                                        e.preventDefault();
                                    }
                                }}/>
                                <ErrorMessage name="sub_caste" component="div"/>
                            </Grid>
                            <Grid item xs={6} className="mb-md-0">
                                <FormLabel>Date of birth <sup>*</sup></FormLabel>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Field name="dob">
                                        {({ field, form }) => (
                                            <DatePicker
                                                {...field} // Pass the field's props to the DatePicker
                                                value={field.value} // Set the value explicitly if needed
                                                onChange={(date) => form.setFieldValue("dob", date)} // Handle date changes
                                            />
                                        )}
                                    </Field>
                                </LocalizationProvider>
                                <Typography><Age alt='age'/> {age} Years</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <FormLabel>Languages known</FormLabel>
                                <FormControl className="custom-select">
                                    <Field
                                        as={Select}
                                        name="languages"
                                        multiple
                                        value={props.formValues.languages}
                                        onClick={handleLanguageChanges}
                                        displayEmpty
                                        setFieldValue={props.setFieldValue}
                                    >
                                        <MenuItem value="">Select Language</MenuItem>
                                        {names.map((name) => (
                                            <MenuItem key={name} value={name}>
                                                <Checkbox checked={selectedLanguages.includes(name)} />
                                                <ListItemText primary={name} />
                                            </MenuItem>
                                        ))}
                                        <div className="text-end me-2">
                                            <Button onClick={selectedLangSubmission('cancel')} className="">cancel</Button>
                                            <Button onClick={selectedLangSubmission('submit')}  className="save">Save</Button>
                                        </div>
                                    </Field>
                                    <ErrorMessage name="languages" component="div" />
                                </FormControl>
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
                                    placeholder='Enter Aadhaar number'
                                    onInput={(event) => {
                                        event.target.value = event.target.value.replace(/\D/g, '').slice(0, 12);

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
                                values={props.formValues}
                                updatePhotoUrl={updatePhotoUrl}
                                setFieldValue={props.setFieldValue}
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
    mobiles: [],
    religion: "",
    gender: "",
    category: "",
    caste: "",
    sub_caste: "",
    dob: "",
    photo: "",
    languages: [],
    aadhaar: '',
    voter_id: "",
    month: "",
    year: "",
    id: "",
};
PersonalDetails.validationSchema = Yup.object().shape({
    // name: Yup.string().required('Please enter your first name'),
    // mobiles: Yup.array().of(Yup.string().required('Mobile Number is required'))
    //     .of(Yup.string().min(1))
    //     .required('Field is required')
    //     .test('first-digit-greater-than-4', 'First digit must be greater or equal to 5', (value) => {
    //         if (!value) return true; // No validation if the field is empty
    //         const mobileNumbers = value.map((number) => number.trim());
    //         return mobileNumbers.every((number) => {
    //             const firstDigit = parseInt(number.charAt(0));
    //             return !isNaN(firstDigit) && firstDigit >= 5;
    //         });
    //     })
    //     .test('at-least-10-digits', 'Mobile numbers must be at least 10 digits long', (value) => {
    //         if (!value) return true; // No validation if the field is empty
    //         const mobileNumbers = value.map((number) => number.trim());
    //         return mobileNumbers.every((number) => number.length === 10);
    //     }),
    // religion: Yup.string().required('Please select your Religion'),
    // gender: Yup.string().required('Please select your Gender'),
    // category: Yup.string().required('Please select your Category'),
    // caste: Yup.string().required('Please select your Caste'),
    // dob: Yup.string().required('Please select your Caste'),
    // aadhaar: Yup.string().matches(/^\d{12}$/, 'Aadhaar must be a 12-digit number'),
    // voter_id: Yup.string().matches(/^[A-Za-z]{3}\d{7}$/, 'Voter ID format is not valid. It should start with 3 letters followed by 7 digits'),
    // languages: Yup.array().of(Yup.string().min(1)).required(' languages minimum item should be of 1 count.'),
    // photo:Yup.string().required('Please select your Photo'),
});
export default PersonalDetails;
