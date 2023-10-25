import {Typography, Stack, Box, Paper, Grid, FormLabel, TextField} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {Field, ErrorMessage } from 'formik';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';
import Formheading from "../component/formheading/formheading";
import Savebtn from "../component/saveprogressbutton/button";
import Inputfield from "../component/inputfield/inputfield";
import SelectField from "../component/selectfield/selectfield";
import Primarybutton from '../component/primarybutton/primarybutton';
import {getPinCodeData, getStateData} from "../../../api/stepperApiEndpoints/stepperapiendpoints";
import NumberField from "../component/numberfield/numberfield";
import * as Yup from "yup";
import {boolean} from "yup";
const Communicationform =(props)=>{
    console.log(props.formValues)
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
    return(
        <>


            <Box sx={{ flexGrow: 1 }}>
                <Stack direction="row" useFlexGap flexWrap="wrap">
                    <Formheading number="1" heading="Communication" />
                    <Item sx={{textAlign:'right'}}><Savebtn/>
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
                                                name="mobiles.1"
                                            />
                                            <ErrorMessage name="mobiles" component="div" />
                                        </Grid>

                                        {showFields && fields.map((field, index) => (
                                            <Grid item xs={4}>
                                                <div key={index}>
                                                    <FormLabel>Another number</FormLabel>
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
                                                        name="mobiles.2"
                                                    />
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
                                                onInput={(event) => {
                                                    event.target.value = event.target.value.replace(/\D/g, '').slice(0, 5);

                                                }}
                                            />
                                            <ErrorMessage name="std_code" component="div" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <NumberField
                                                name="landline"
                                                placeholder='Landline Number'
                                                onInput={(event) => {
                                                    event.target.value = event.target.value.replace(/\D/g, '').slice(0, 8);

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
                                            <Field
                                                placeholder='Enter pin code'
                                                inputProps={{
                                                    maxLength: 6,
                                                }}
                                                type="text"
                                                as={TextField}
                                                fullWidth
                                                onInput={(event) => {
                                                    event.target.value = event.target.value.replace(/\D/g, '').slice(0, 6);

                                                }}
                                                name="current_pincode"
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
                                            <Inputfield type="text"
                                                        name="current_district"
                                                        placeholder="Enter Area, Street, Etc."
                                            />
                                            <ErrorMessage name="current_district" component="div" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>State <sup>*</sup></FormLabel>
                                            <SelectField name="current_state" defaultOption="Select State" optionList={StateData}/>
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
                                            {/*<FormLabel >Home town address is same as current?  Yes <Checkbox name="currentAddress" {...label} /></FormLabel>*/}
                                            <FormLabel>Home town address is same as current?  Yes<sup>*</sup></FormLabel>
                                            <Field type="checkbox" name="check" />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <FormLabel>Flat, House no., Building, Company, Apartment <sup>*</sup></FormLabel>
                                            <Inputfield
                                                type="text"
                                                name="home_flat"
                                                placeholder="Enter your address"
                                                value={props.formValues.check ? props.formValues.current_flat: props.formValues.home_flat}
                                            />
                                            {props.formValues.check ? '' : <ErrorMessage name="home_flat" component="div" /> }

                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>PIN Code <sup>*</sup></FormLabel>
                                            <Field
                                                placeholder='Enter pin code'
                                                inputProps={{
                                                    maxLength: 6,
                                                }}
                                                type="text"
                                                as={TextField}
                                                fullWidth
                                                onInput={(event) => {
                                                    event.target.value = event.target.value.replace(/\D/g, '').slice(0, 6);

                                                }}
                                                value={props.formValues.check ? props.formValues.current_pincode: props.formValues.home_pincode}
                                                name="home_pincode"
                                            />
                                            {props.formValues.check ?  '' : <ErrorMessage name="home_pincode" component="div" /> }

                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Area, Street, Sector, Village <sup>*</sup></FormLabel>
                                            <Inputfield type="text"
                                                        name="home_street"
                                                        placeholder="Enter Area, Street, Etc.s"
                                                        value={props.formValues.check ? props.formValues.current_street: props.formValues.home_street}
                                            />
                                            {props.formValues.check ? '' : <ErrorMessage name="home_street" component="div" /> }

                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Town/City <sup>*</sup></FormLabel>
                                            <Inputfield type="text"
                                                        name="home_district"
                                                        placeholder="Enter Area, Street, Etc."
                                                        value={props.formValues.check ? props.formValues.current_district: props.formValues.home_district}
                                            />
                                            {props.formValues.check ? '' : <ErrorMessage name="home_district" component="div" /> }
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>State <sup>*</sup></FormLabel>
                                            <SelectField name="home_state" defaultOption="Select State" optionList={StateData}
                                                         value={props.formValues.check ? props.formValues.current_state: props.formValues.home_state}
                                            />
                                            {props.formValues.check ? '' : <ErrorMessage name="home_state" component="div" /> }
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
                                                                    // value={element.other_flat || ""}
                                                                    placeholder="Enter Area, Street, Etc.s"/>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <FormLabel>PIN Code <sup>*</sup></FormLabel>
                                                        <Field
                                                            placeholder='Enter pin code'
                                                            inputProps={{
                                                                maxLength: 6,
                                                            }}
                                                            type="text"
                                                            as={TextField}
                                                            fullWidth
                                                            onInput={(event) => {
                                                                event.target.value = event.target.value.replace(/\D/g, '').slice(0, 6);

                                                            }}
                                                            value={element.other_pincode || ""}
                                                            name="other_pincode"
                                                        />
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
                                                        <SelectField name="other_district"  defaultOption="Select District" optionList={StateData}/>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <FormLabel>State <sup>*</sup></FormLabel>
                                                        <SelectField name="other_state"  defaultOption="Select State" optionList={StateData}/>
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

        </>

    )
}
Communicationform.label = 'Communication Details'
Communicationform.initialValues = {
    mobiles: "",
    std_code: "",
    landline: "",
    email:"",
    current_flat:"",
    current_pincode:"",
    current_street:"",
    current_district:"",
    current_state:"",
    home_flat:"",
    home_pincode:"",
    home_street:"",
    home_district:"",
    home_state:"",
    // other_flat:"",
    // check:false,
    // other_district:"",
    // other_state:"",
    // other_pincode:"",
};
Communicationform.validationSchema = Yup.object().shape({
    email:Yup.string()
        .required('Email is required')
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Invalid email format'
        ),
    current_flat: Yup.string().required('Please enter your Address'),
    current_street: Yup.string().required('Please enter your Street'),
    current_district: Yup.string().required('Please enter your District'),
    current_state: Yup.string().required('Please enter your State'),
    current_pincode: Yup.string().required('Please enter your Pincode'),
    home_flat: Yup.string().required('Please enter your Address'),
    home_street: Yup.string().required('Please enter your Street'),
    home_district: Yup.string().required('Please enter your District'),
    home_state: Yup.string().required('Please enter your State'),
    home_pincode: Yup.string().required('Please enter your Pincode'),
    // check: Yup.boolean(),
    // other_flat: Yup.string().when('check', {
    //     is: true,
    //     then: Yup.string().required('Please enter your Street'),
    // }),
    // other_street: Yup.string().when('check', {
    //     is: true,
    //     then: Yup.string().required('Please enter your District'),
    // }),
    // other_state: Yup.string().when('check', {
    //     is: true,
    //     then: Yup.string().required('Please enter your State'),
    // }),
    // other_pincode: Yup.string().when('check', {
    //     is: true,
    //     then: Yup.string().required('Please enter your Pincode'),
    // }),
    // type_of_other_address: Yup.string().when('check', {
    //     is: true,
    //     then: Yup.string().required('Please enter your type of Address'),
    // }),
});
export default Communicationform