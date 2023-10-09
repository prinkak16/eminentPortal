import React, {useEffect, useState} from "react"
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
import {getGenderData, getReligionData, getStepCtgry} from "../../../api/stepperApiEndpoints/stepperapiendpoints";
const FormWrap=()=>{
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor:'transparent',
        boxShadow:'none',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        flexGrow: 1,
    }));
    const [selectedOption, setSelectedOption] = useState('');
    const [dropDownDataCategory, setDropDownDataCategory] = useState([]);
    const [ReligionData, setReligionData] = useState([]);
    const[GenderData, setGenderData]= useState([])
    const selectChange = (e) => {
        setSelectedOption(e.target.value);
    };
    useEffect(() => {
        getcatgry()
        getReligion()
        getGenders()
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

    const handleFieldChange = (fieldName) => {
        setActiveField(fieldName);
    };




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
    return(
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Grid className='detailFrom' container spacing={2}>
                    <Grid item xs={8}>
                        <Formik
                            initialValues={{name: "", mobilenumber:"", religion: "", gender: "", category:"",caste:"",subcaste:"",date:"", month:"", year:"", mobile: "", email: "", address: "", pincode:"",area:"",town:"",state:"" }}
                            validate={(values) => {
                                const errors = {};
                                if (!values.fullname) {
                                    errors.name = "Required";
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
                            onSubmit={(values, {setSubmitting}) => {
                                setTimeout(() => {
                                    alert(JSON.stringify(values, null, 2));
                                    setSubmitting(false);
                                    getFormData().then(response => {
                                        console.log('API response:', response.data);
                                    });
                                }, 400);
                            }}
                        >
                            {({isSubmitting})=>(
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