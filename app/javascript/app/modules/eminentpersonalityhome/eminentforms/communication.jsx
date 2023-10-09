import {Typography, Stack, Box, Paper, Grid, FormLabel, TextField} from '@mui/material';
import React, {useEffect, useState} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';
import Formheading from "../component/formheading/formheading";
import Savebtn from "../component/saveprogressbutton/button";
import Inputfield from "../component/inputfield/inputfield";
import Selectfield from "../component/selectfield/selectfield";
import Primarybutton from '../component/primarybutton/primarybutton';
import {getFormData, getPinCodeData, getStateData} from "../../../api/stepperApiEndpoints/stepperapiendpoints";
import NumberField from "../component/numberfield/numberfield";
const Communicationform =(props)=>{
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor:'transparent',
        boxShadow:'none',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        flexGrow: 1,
    }));
    const [fields, setFields] = useState([]);
    const [count, setcount]=useState(2)
    const [showFields, setShowFields] = useState(false);
    const [formValues, setFormValues] = useState([])
    const [StateData, setStateData]= useState([])
    const [PinCodeData, setPinCodeData] = useState(null);

    const handleAddField = () => {
        if(fields.length<2){
        setFields([...fields, ""]);
        setShowFields(true)
        console.log(fields.length)
        }
    };
    const handledelete=()=>{
        const allfields = [...fields];
        allfields.splice(-1, 1);
        setFields(allfields)
        console.log(allfields)
    }
    const label = { inputProps: { 'aria-label': 'Home town address is same as current? Yes' } };
    let addFormFields = () => {
        setFormValues([...formValues, { house: "", street: "", pincode:"", city:"", state:"" }])
        setShowFields(true)
        
    }

    let removeFormFields = () => {
        const newFormValues = [...formValues];
        newFormValues.splice(-1, 1);
        setFormValues(newFormValues);
    }
    const [selectedOption, setSelectedOption] = useState('');
    const selectChange = (e) => {
        setSelectedOption(e.target.value);
      };
    useEffect(() => {
        getState()
        if (PinCodeData) {
            // Update the "city" field with the retrieved city
            setFieldValue('city', PinCodeData.current_street);
        }
    }, [PinCodeData]);

    const validatePinCode = (value) => {
        const PinCodePattern = /^\d{6}$/;
        if (!value) {
            return 'Pin code is required';
        } else if (!PinCodePattern.test(value)) {
            return 'Invalid pin code format. It should be a 6-digit number.';
        }
        return null;
    };
    const getPinCode = async (value, setFieldValue) => {
        // Check if the pin code is valid
        const validationError = validatePinCode(value);
        if (validationError) {
            setFieldValue('city', ''); // Clear the city field if the pin code is invalid
            return;
        }
        getPinCodeData.then((res)=>{
            setPinCodeData(data);
        })

    };
    const getState =()=>{
        getStateData.then((res)=>{
            setStateData(res.data.data)
        })

    }
    const validateSTDCode = (value) => {
        if (!value) {
            return null; // Field is empty, so no validation error
        }
        const stdPattern = /^\d{3,5}$/;
        if (!stdPattern.test(value)) {
            return 'Enter a valid STD Code with 3 to 5 digits';
        }
        return null;
    };
    const validateLandline = (value) => {
        if (!value) {
            return null; // Field is empty, so no validation error
        }
        const stdPattern = /^\d{6,8}$/;
        if (!stdPattern.test(value)) {
            return 'Enter a valid landline number with 6 to 8 digits';
        }
        return null;
    };
    return(
        <>
            
                        <Formik
                            initialValues={{whatsapp_number: "", std_code: "", landline: "", current_flat:"",current_pincode:"", current_street:"",current_district:"",current_state:"", home_flat:"",home_pincode:"", home_street:"", home_district:"", home_state:"", other_flat:"", check:"", type_of_other_address:"", other_district:"", other_state:"", other_pincode:"",   }}
                            validate={(values) => {
                                const errors = {};
                            //     if (!/^\d+$/.test(values.whatsapp_number)) {
                            //         errors.whatsapp_number = "Required";
                            //     }
                                const stdError = validateSTDCode(values.std_code);
                                if (stdError) {
                                    errors.std_code = stdError;
                                }
                                const landlineError = validateLandline(values.landline);
                                if (landlineError) {
                                    errors.landline = landlineError;
                                }
                            //     if (!values.email) {
                            //         errors.email = "Required";
                            //     } else if (
                            //         !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                            //     ) {
                            //         errors.email = "Invalid email address";
                            //     }
                            //     if (!values.current_flat) {
                            //         errors.current_flat = "Required";
                            //     }
                            //     if (!values.current_pincode) {
                            //         errors.current_pincode = "Required";
                            //     }
                            //     if (!values.current_street) {
                            //         errors.current_street = "Required";
                            //     }
                            //     if (!values.current_district) {
                            //         errors.current_district = "Required";
                            //     }
                            //     if (!values.current_state) {
                            //         errors.current_state = "Required";
                            //     }
                            //     if (!values.home_flat) {
                            //         errors.home_flat = "Required";
                            //     }
                            //     if (!values.home_pincode) {
                            //         errors.home_pincode = "Required";
                            //     }
                            //     if (!values.home_street) {
                            //         errors.home_street = "Required";
                            //     }
                            //     if (!values.home_district) {
                            //         errors.home_district = "Required";
                            //     }
                            //     if (!values.home_state) {
                            //         errors.home_state = "Required";
                            //     }
                            //     if (!values.other_flat) {
                            //         errors.other_flat = "Required";
                            //     }
                            //     if (!values.other_street) {
                            //         errors.other_street = "Required";
                            //     }
                            //     if (!values.other_district) {
                            //         errors.other_district = "Required";
                            //     }
                            //     if (!values.other_state) {
                            //         errors.other_state = "Required";
                            //     }
                            //     if (!values.other_pincode) {
                            //         errors.other_pincode = "Required";
                            //     }
                                props.enableProgressAction(Object.keys(errors).length===0);
                                return errors;
                            }}
                            
                            onSubmit={(values, { setSubmitting }) => {
                                setTimeout(() => {
                                alert(JSON.stringify(values, null, 2));
                                setSubmitting(false);
                                    getFormData().then(response => {
                                        console.log('API response:', response.data);
                                    });
                                }, 400);
                            }}
                        >
                            {({isSubmitting, values, handleChange, handleBlur})=>(
                                <Form>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Stack direction="row" useFlexGap flexWrap="wrap">
                                            <Formheading number="1" heading="Communication" />
                                            <Item sx={{textAlign:'right'}}><Savebtn handleSave={isSubmitting}/>
                                            </Item>
                                        </Stack>
                                        <div className="detailFrom">
                                                <Grid  container spacing={2} sx={{mb:3}}>
                                                    <Grid item xs={12}>
                                                        <Grid  container spacing={2}>
                                                            <Grid item xs={12}>
                                                                <Grid  container spacing={2}>
                                                                    <Grid item xs={4}>
                                                                        <FormLabel>Mobile Number <sup>*</sup></FormLabel>
                                                                        <NumberField
                                                                            id="outlined-number"
                                                                            name="whatsapp_number"
                                                                            placeholder='Search by phone no.'
                                                                            onInput={(event) => {
                                                                                // Remove non-numeric characters and limit the length to 10 characters
                                                                                event.target.value = event.target.value.replace(/\D/g, '').slice(0, 10);
                                                                            }}
                                                                            inputProps={{
                                                                                maxLength: 10,
                                                                            }}
                                                                        />
                                                                        <ErrorMessage name="whatsapp_number" component="div" />
                                                                    </Grid>
                                                                    
                                                                    {showFields && fields.map((field, index) => (
                                                                        <Grid item xs={4}>
                                                                            <div key={index}>
                                                                                <FormLabel>Another number</FormLabel>
                                                                                <NumberField
                                                                                    name="whatsapp_number"
                                                                                    placeholder='Enter Mobile No.'
                                                                                    onInput={(event) => {
                                                                                        // Remove non-numeric characters and limit the length to 10 characters
                                                                                        event.target.value = event.target.value.replace(/\D/g, '').slice(0, 10);
                                                                                    }}
                                                                                    handlechange={(e) => {
                                                                                        const updatedFields = [...fields];
                                                                                        updatedFields[index] = e.target.value;
                                                                                        setFields(updatedFields);
                                                                                    }}
                                                                                    inputProps={{
                                                                                        maxLength: 10,
                                                                                    }}
                                                                                />
                                                                                <ErrorMessage name="whatsapp_number" component="div" />

                                                                                {/*<Inputfield type="text"*/}
                                                                                {/*            name="mobile"*/}
                                                                                {/*            placeholder="Enter Mobile No."*/}
                                                                                {/*            handlechange={(e) => {*/}
                                                                                {/*                const updatedFields = [...fields];*/}
                                                                                {/*                updatedFields[index] = e.target.value;*/}
                                                                                {/*                setFields(updatedFields);*/}
                                                                                {/*            }}/>*/}
                                                                                <div className="text-end">
                                                                                    {fields.length>=1 ?(
                                                                                        <Primarybutton addclass="deletebtn mt-3" buttonlabel={<DeleteIcon/>} handleclick={handledelete}/>
                                                                                    ):null}
                                                                                </div>
                                                                            </div>
                                                                        </Grid>
                                                                    ))}
                                                                
                                                                </Grid>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                {fields.length>=2 ? (null):<Primarybutton addclass="addanotherfieldsbtn me-2 mb-2" starticon={<AddIcon/>} buttonlabel="Add Another" handleclick={handleAddField}/>}
                                                                    </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={8}>
                                                        <Grid container spacing={2} className="grid-wrap">
                                                            <Grid item xs={6}>
                                                                <FormLabel>Landline</FormLabel>
                                                                <Grid className='detailFrom' container spacing={2}>
                                                                    <Grid item xs={6}>
                                                                        <NumberField
                                                                            name="std_code"
                                                                            placeholder='STD Code'
                                                                            inputProps={{
                                                                                maxLength: 5,
                                                                                minLength:3,
                                                                            }}
                                                                        />
                                                                        <ErrorMessage name="std_code" component="div" />
                                                                    </Grid>
                                                                    <Grid item xs={6}>
                                                                        <NumberField
                                                                            name="landline"
                                                                            placeholder='Landline Number'
                                                                            inputProps={{
                                                                                maxLength: 6,
                                                                                minLength:8,
                                                                            }}
                                                                        />
                                                                        <ErrorMessage name="landline" component="div" />

                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <FormLabel>Email Id  <sup>*</sup></FormLabel>
                                                                <Inputfield type="text"
                                                                            name="email"
                                                                            placeholder="XYZ@gmail.com"/>
                                                                <ErrorMessage name="email" component="div" />
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container spacing={2} sx={{mb:3}}>
                                                            <Grid item xs={12} >
                                                                <Grid className="addressfields grid-wrap" container spacing={2} sx={{ pt:2,pb:6}}>
                                                                    <Grid item xs={12}>
                                                                        <Formheading number="2" heading="Address" />
                                                                    </Grid>
                                                                    <Grid item xs={12}>
                                                                        <FormLabel className="light-circle"><Box className="addnumber" component="div" sx={{ display: 'inline-block' }}>{count}</Box> Current Address</FormLabel>
                                                                    </Grid>
                                                                    <Grid item xs={12}>
                                                                        <FormLabel>Flat, House no., Building, Company, Apartment <sup>*</sup></FormLabel>
                                                                        <Inputfield type="text"
                                                                                    name="current_flat"
                                                                                    placeholder="Enter your address"/>
                                                                        <ErrorMessage name="current_flat" component="div" />
                                                                    </Grid>
                                                                    <Grid item xs={6}>
                                                                        <FormLabel>PIN Code <sup>*</sup></FormLabel>
                                                                        {/*<Inputfield type="text"*/}
                                                                        {/*            name="current_pincode"*/}
                                                                        {/*            placeholder="Enter pin code"/>*/}
                                                                        <Field
                                                                            type="text"
                                                                            id="current_pincode"
                                                                            name="current_pincode"
                                                                            placeholder="Enter pin code"
                                                                            as={TextField}
                                                                            onChange={(e) => getPinCode(e.target.value, setFieldValue)}
                                                                        />
                                                                        <ErrorMessage name="current_pincode" component="div" />
                                                                    </Grid>
                                                                    <Grid item xs={6}>
                                                                        <FormLabel>Area, Street, Sector, Village <sup>*</sup></FormLabel>
                                                                        <Inputfield type="text"
                                                                                    name="current_street"
                                                                                    placeholder="Enter Area, Street, Etc.s" readOnly/>
                                                                        <ErrorMessage name="current_street" component="div" />
                                                                    </Grid>
                                                                    <Grid item xs={6}>
                                                                        <FormLabel>Town/City <sup>*</sup></FormLabel>
                                                                        <Selectfield name="current_district"   defaultOption="Select District" optionList={StateData}/>
                                                                        <ErrorMessage name="current_district" component="div" />
                                                                    </Grid>
                                                                    <Grid item xs={6}>
                                                                        <FormLabel>State <sup>*</sup></FormLabel>
                                                                        <Selectfield name="current_state" defaultOption="Select State" optionList={StateData}/>
                                                                        <ErrorMessage name="current_state" component="div" />
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <Grid className="addressfields grid-wrap"  container spacing={2} sx={{ pt:5,pb:5}}>
                                                                    <Grid item xs={5}>
                                                                        <FormLabel className="light-circle"><Box className="addnumber" component="div" sx={{ display: 'inline-block' }}>2</Box> Home Town Address</FormLabel>
                                                                    </Grid>
                                                                    <Grid className='testright' item xs={7}>
                                                                        <FormLabel >Home town address is same as current?  Yes <Checkbox {...label} /></FormLabel>
                                                                    </Grid>
                                                                    <Grid item xs={12}>
                                                                        <FormLabel>Flat, House no., Building, Company, Apartment <sup>*</sup></FormLabel>
                                                                        <Inputfield type="text"
                                                                                    name="home_flat"
                                                                                    placeholder="Enter your address"/>
                                                                        <ErrorMessage name="home_flat" component="div" />
                                                                    </Grid>
                                                                    <Grid item xs={6}>
                                                                        <FormLabel>PIN Code <sup>*</sup></FormLabel>
                                                                        <Inputfield type="text"
                                                                                    name="home_pincode"
                                                                                    placeholder="Enter pin code"/>
                                                                        <ErrorMessage name="home_pincode" component="div" />
                                                                    </Grid>
                                                                    <Grid item xs={6}>
                                                                        <FormLabel>Area, Street, Sector, Village <sup>*</sup></FormLabel>
                                                                        <Inputfield type="text"
                                                                                    name="home_street"
                                                                                    placeholder="Enter Area, Street, Etc.s"/>
                                                                        <ErrorMessage name="home_street" component="div" />
                                                                    </Grid>
                                                                    <Grid item xs={6}>
                                                                        <FormLabel>Town/City <sup>*</sup></FormLabel>
                                                                        <Selectfield name="home_district"  defaultOption="Select District" optionList={StateData}/>
                                                                        <ErrorMessage name="home_district" component="div" />
                                                                    </Grid>
                                                                    <Grid item xs={6}>
                                                                        <FormLabel>State <sup>*</sup></FormLabel>
                                                                        <Selectfield name="home_state"  defaultOption="Select State" optionList={StateData}/>
                                                                        <ErrorMessage name="home_state" component="div" />
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid item xs={12} className="pt-0">
                                                                <Grid className="addressfields" sx={{pb:5}}>
                                                                    {showFields && formValues.map((element, index) => (
                                                                        <div>
                                                                            <Grid className="addressfields grid-wrap"  container spacing={2} sx={{ pb:5, pt:5}}>
                                                                                <Grid item xs={12}>
                                                                                    <FormLabel><Box className="addnumber" component="div" sx={{ display: 'inline-block' }}></Box> Other</FormLabel>
                                                                                </Grid>
                                                                                <Grid item xs={12}>
                                                                                    <FormLabel>Flat, House no., Building, Company, Apartment <sup>*</sup></FormLabel>
                                                                                    <Inputfield type="text"
                                                                                                name="other_flat"
                                                                                                value={element.other_flat || ""}
                                                                                                placeholder="Enter Area, Street, Etc.s"/>
                                                                                </Grid>
                                                                                <Grid item xs={6}>
                                                                                    <FormLabel>PIN Code <sup>*</sup></FormLabel>
                                                                                    <Inputfield type="text"
                                                                                                name="other_pincode"
                                                                                                value={element.other_pincode || ""}
                                                                                                placeholder="Enter pin code"/>
                                                                                </Grid>
                                                                                <Grid item xs={6}>
                                                                                    <FormLabel>Area, Street, Sector, Village <sup>*</sup></FormLabel>
                                                                                    <Inputfield type="text"
                                                                                                name="other_street"
                                                                                                value={element.other_street || ""}
                                                                                                placeholder="Enter Area, Street, Etc.s"/>
                                                                                </Grid>
                                                                                <Grid item xs={6}>
                                                                                    <FormLabel>Town/City <sup>*</sup></FormLabel>
                                                                                    <Selectfield name="other_district"  defaultOption="Select District" optionList={StateData}/>
                                                                                </Grid>
                                                                                <Grid item xs={6}>
                                                                                    <FormLabel>State <sup>*</sup></FormLabel>
                                                                                <Selectfield name="other_state"  defaultOption="Select State" optionList={StateData}/>
                                                                                </Grid>
                                                                            </Grid>

                                                                        </div>

                                                                    ))}

                                                                    <Grid item xs={12} className="d-flex align-items-center">
                                                                        <div>
                                                                        <Primarybutton addclass="addanotherfieldsbtn me-1 mb-1" starticon={<AddIcon/>} buttonlabel="Add another Address" handleclick={()=> addFormFields()}/>
                                                                        <Typography>( As Delhi Address, Office Address etc.)</Typography>
                                                                        </div>
                                                                        {formValues.length>=1 ? (
                                                                            <Primarybutton addclass="deletebtn" buttonlabel={<DeleteIcon/>} handleclick={()=>removeFormFields(formValues.length-1)}/>
                                                        
                                                                        ) : null}
                                                                    </Grid>

                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                        </div>
                                    </Box>
                                </Form>
                            )}
                        </Formik>            
        </>

    )
}
export default Communicationform