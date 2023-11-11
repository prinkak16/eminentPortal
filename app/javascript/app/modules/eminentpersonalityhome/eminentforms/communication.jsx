import {Box, FormLabel, Grid, Paper, Stack, TextField, Typography} from '@mui/material';
import React, {useContext, useEffect, useState} from 'react';
import {ErrorMessage, Field} from 'formik';
import {styled} from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Formheading from "../component/formheading/formheading";
import Savebtn from "../component/saveprogressbutton/button";
import Inputfield from "../component/inputfield/inputfield";
import SelectField from "../component/selectfield/selectfield";
import Primarybutton from '../component/primarybutton/primarybutton';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus, faTrash} from '@fortawesome/free-solid-svg-icons';
import {getFormData, getStateData} from "../../../api/stepperApiEndpoints/stepperapiendpoints";
import NumberField from "../component/numberfield/numberfield";
import * as Yup from "yup";
import axios from "axios";
import {formFilledValues, isValuePresent, saveProgress} from "../../utils";
import AutoCompleteDropdown from "../simpleDropdown/autoCompleteDropdown";
import { v4 as uuidv4 } from 'uuid';
import OtherInputField from "../component/otherFormFields/otherInputField";
import OtherNumberField from "../component/otherFormFields/otherNumberInput";
import {ApiContext} from "../../ApiContext";

const Communicationform =(props)=>{
    const {config} = useContext(ApiContext)
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor:'transparent',
        boxShadow:'none',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        flexGrow: 1,
    }));
    const [formValues, setFormValues] = useState([])
    const [curPinData, setCurPinData] = useState({district: [], state: []})
    const [homePinData, setHomePinData] = useState({district: [], state: []})
    const [otherPinData, setOtherPinData] = useState([])
    const [mobileFields, setMobileFields] =useState([])

    useEffect(() => {
        const mobiles = props.formValues.mobiles
        if (mobiles.length > 0) {
            let mobileObjects = []
            for (let i = 0; i < mobiles.length; i++) {
                mobileObjects.push({id: uuidv4(),number: mobiles[i]})
            }
            setMobileFields(mobileObjects)
        }
    }, [])

        useEffect(() => {
        const otherAddress = props.formValues.other_address
        if (isValuePresent(otherAddress)) {
            setFormValues(otherAddress)
        }
    }, [])



    let addFormFields = () => {
        setFormValues([...formValues, {
            id: uuidv4(),
            address_type: "",
            flat: "",
            pincode: "",
            street: "",
            district: "",
            state: ""
        }])
    }

    let removeFormFields = (formIndex) => {
        const newFormValues =  formValues.filter((field, index) => index !== formIndex)
        setFormValues(newFormValues);
    }


    const handlePinCodeChange = (pinCode, type, otherFromIndex) => {
        const  pinApi= `https://api.postalpincode.in/pincode/${pinCode}`
        if (pinCode.length > 5) {
            axios.get(pinApi)
                .then((response) => {
                    const responseData = response.data[0];
                    if (responseData.Status === 'Success') {
                        const district = [...new Set(responseData.PostOffice.map(item => item.District))];
                        const state = [...new Set(responseData.PostOffice.map(item => item.State))];
                        if (type === 'pincode') {
                           setCurPinData({district: district, state: state})
                            props.formValues.current_address[0].state = state[0]
                        } else if (type === 'home_pincode') {
                            setHomePinData({district: district, state: state})
                            props.formValues.home_address[0].state = state[0]
                        } else if (type === 'other_pincode') {
                            setOtherPinData([...otherPinData, {id: otherFromIndex, district: district, state: state}])
                            formValues[otherFromIndex].state = state[0]
                        }
                    }
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        }
    };

    const addMobileField = () => {
        setMobileFields([...mobileFields, {id:uuidv4(),number:'' }])
    }

    useEffect(() => {
        props.formValues.mobiles = mobileFields.map(item => item.number);
    }, [mobileFields]);

    const enterMobileNumber = (id) => (event) => {
        const phoneNumber = event.target.value.replace(/[^\d०१२३४५६७८९]/g, '');
        if (/^[5-9५६७८९]/.test(phoneNumber)) {
            event.target.value = phoneNumber;
        } else {
            event.target.value = ''; // Clear the input value if it doesn't start with 5-9 or a Hindi digit
        }

        setMobileFields((preMobileFields) => {
            return preMobileFields.map((form) => {
                if (form.id === id) {
                    return {
                        ...form,
                        ['number']: event.target.value,
                    };
                }
                return form;
            });
        });
    }

    const deleteMobileNumber = (id) => {
        const updatedMobileFields = mobileFields.filter((field) => field.id !== id)
        setMobileFields(updatedMobileFields)
    }


    useEffect(() => {
        if (props.formValues.current_address[0].pincode.length > 5) {
            handlePinCodeChange(props.formValues.current_address[0].pincode, 'pincode')
        }
    }, [props.formValues.current_address[0].pincode]);

    useEffect(() => {
        if (props.formValues.home_address[0].pincode.length > 5) {
            handlePinCodeChange(props.formValues.home_address[0].pincode, 'home_pincode')
        }

    }, [props.formValues.home_address[0].pincode]);

    const changeDistrictState = (value, name, type) => {
            if (name === 'District') {
                props.formValues[type][0].district = value
            } else {
                props.formValues[type][0].state = value
            }
    }

    const sameAddress = (event) => {
        if (event.target.checked) {
            setHomePinData(curPinData)
            props.formValues.home_flat = props.formValues.flat
            props.formValues.home_pincode = props.formValues.pincode
            props.formValues.home_street = props.formValues.street
            props.formValues.home_district = props.formValues.district
            props.formValues.home_state = props.formValues.state
        }
        if (!event.target.checked) {
            setHomePinData({district: [], state: []})
            props.formValues.home_flat = ''
            props.formValues.home_pincode = ''
            props.formValues.home_street = ''
            props.formValues.home_district = ''
            props.formValues.home_state = ''
        }
    }

    const otherAddressChange = (name, index) => (value) => {
        if (name === 'pincode') {
            handlePinCodeChange(value, 'other_pincode', index)
        }

        setFormValues((prevFormValues) => {
            return prevFormValues.map((form, i) => {
                if (i === index) {
                    return {
                        ...form,
                        [name]: value,
                    };
                }
                return form;
            });
        });
    };


    const fieldValue = (formIndex, name) => {
        const form = formValues.find((field, index) => index === formIndex)
        if (form) {
            return form[name]
        } else {
            ''
        }

    }


    const otherDistrictStateArray = (type, formIndex) => {
        const form = otherPinData.find((field, index) => index === formIndex)
       if (form) {
           return form[type]
       } else {
           return  []
       }
    }

    useEffect(() => {
        props.formValues.other_address = formValues
    },[formValues])


    const saveProgress = () => {
        const fieldsWithValues = formFilledValues(props.formValues);
        getFormData(fieldsWithValues, props.activeStep + 1, config).then(response => {
            console.log('API response:', response.data);
        });
    }

    const otherAddressError = (key, formIndex) => {
        const form = formValues.find((field, index) => index === formIndex)
        return  !isValuePresent(form[key])
    }
    return(
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Stack direction="row" useFlexGap flexWrap="wrap">
                    <Formheading number="1" heading="Communication" />
                    <Item sx={{textAlign:'right'}}>
                        <Savebtn onClick={saveProgress}/>
                    </Item>
                </Stack>
                <div className="detailFrom">
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <div className='mobiles-container'>
                                {mobileFields && mobileFields.map((field, i) =>(
                                    <div className='mobile-number-field'>
                                        <FormLabel className="mobile-label">{i+2}. Mobile Number <mark>*</mark></FormLabel>
                                        <input
                                            maxLength={10}
                                            disabled={i === 0}
                                            placeholder='Enter Mobile Number'
                                            value={field.number}
                                            onChange={enterMobileNumber(field.id)}
                                            className={`mobile-fields ${i === 0 &&
                                                                        mobileFields.length > 1 ?
                                                                        'mt--14rem' : ''}`} />
                                        <div className='add-delete-btns'>
                                            {mobileFields.length < 3 && mobileFields.length === i+1 ?
                                                <span className='add-btn' onClick={() => addMobileField()}>
                                                      <span>
                                                         <FontAwesomeIcon icon={faPlus}/>
                                                     </span>
                                                     Add Another
                                                </span> : null
                                            }
                                            {i > 0 &&
                                                <span className='delete-button'
                                                      onClick={() => deleteMobileNumber(field.id)}>
                                                     <FontAwesomeIcon icon={faTrash}/>
                                                 </span>
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Grid container spacing={2} className="grid-wrap mt-3">
                                <Grid item xs={6}>
                                    <FormLabel className='mobile-label'>Landline</FormLabel>
                                    <Grid className='detailFrom' container spacing={2}>
                                        <Grid item xs={3}>
                                            <NumberField
                                                className='std-code-input'
                                                value={props.formValues.std_code}
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
                                                value={props.formValues.landline}
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
                                    <FormLabel className='mobile-label'>Email Id  <mark>*</mark></FormLabel>
                                    <Inputfield type="text"
                                                name="email"
                                                value={props.formValues.email}
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
                                            <FormLabel className="light-circle"><Box className="addnumber" component="div" sx={{ display: 'inline-block' }}>{1}</Box> Current Address</FormLabel>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormLabel>Flat, House no., Building, Company, Apartment <mark>*</mark></FormLabel>
                                            <Inputfield type="text"
                                                        value={props.formValues.current_address[0].flat}
                                                        name={`current_address.${0}.flat`}
                                                        placeholder="Enter your address"/>
                                            <ErrorMessage name={`current_address.${0}.flat`} component="div" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>PIN Code <mark>*</mark></FormLabel>
                                            <NumberField
                                                className=''
                                                value={props.formValues.current_address[0].pincode}
                                                name={`current_address.${0}.pincode`}
                                                placeholder='Enter Pin Code'
                                                onInput={(event) => {
                                                    event.target.value = event.target.value.replace(/\D/g, '').slice(0, 6);

                                                }}
                                            />
                                            <ErrorMessage name={`current_address.${0}.pincode`} component="div" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Area, Street, Sector, Village <mark>*</mark></FormLabel>
                                            <Field type="text"
                                                   id="street"
                                                   selectedValue={props.formValues.current_address[0].street}
                                                   name={`current_address.${0}.street`}
                                                   as={TextField} />
                                            <ErrorMessage name={`current_address.${0}.street`} component="div" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Town/City <mark>*</mark></FormLabel>
                                            <AutoCompleteDropdown
                                                name={'District'}
                                                selectedValue={props.formValues.current_address[0].district}
                                                listArray={curPinData.district}
                                                onChangeValue={changeDistrictState}
                                                dropDownType={'current_address'} />
                                            <ErrorMessage name={`current_address.${0}.district`} component="div" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>State <mark>*</mark></FormLabel>
                                            <AutoCompleteDropdown
                                                name={'State'}
                                                selectedValue={props.formValues.current_address[0].state}
                                                listArray={curPinData.state}
                                                onChangeValue={changeDistrictState}
                                                dropDownType={'current_address'} />
                                            <ErrorMessage name={`current_address.${0}.state`} component="div" />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid className="addressfields grid-wrap"  container spacing={2} sx={{ pt:5,pb:5}}>
                                        <Grid item xs={5}>
                                            <FormLabel className="light-circle"><Box className="addnumber" component="div" sx={{ display: 'inline-block' }}>2</Box> Home Town Address</FormLabel>
                                        </Grid>
                                        <Grid className='testright' item xs={7}>
                                            <FormLabel>Home town address is same as current?  Yes<mark>*</mark></FormLabel>
                                            <Field onClick={ sameAddress} type="checkbox" name="check" />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <FormLabel>Flat, House no., Building, Company, Apartment <mark>*</mark></FormLabel>
                                            <Inputfield
                                                type="text"
                                                name={`home_address.${0}.flat`}
                                                value={props.formValues.home_address[0].flat}
                                                placeholder="Enter your address"
                                            />
                                            <ErrorMessage name={`home_address.${0}.flat`} component="div" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>PIN Code <mark>*</mark></FormLabel>
                                            <NumberField
                                                className=''
                                                name={`home_address.${0}.pincode`}
                                                value={props.formValues.home_address[0].pincode}
                                                placeholder='Enter Pin Code'
                                                onInput={(event) => {
                                                    event.target.value = event.target.value.replace(/\D/g, '').slice(0, 6);

                                                }}
                                            />
                                            <ErrorMessage name={`home_address.${0}.pincode`} component="div" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Area, Street, Sector, Village <mark>*</mark></FormLabel>
                                            <Inputfield type="text"
                                                        name={`home_address.${0}.street`}
                                                        value={props.formValues.home_address[0].street}
                                                        placeholder="Enter Area, Street, Etc.s"
                                            />
                                            <ErrorMessage name={`home_address.${0}.pincode`} component="div" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Town/City <mark>*</mark></FormLabel>
                                            <AutoCompleteDropdown
                                                name={'District'}
                                                selectedValue={props.formValues.home_address[0].district}
                                                listArray={homePinData.district}
                                                onChangeValue={changeDistrictState}
                                                dropDownType={'home_address'} />
                                            <ErrorMessage name={`home_address.${0}.district`} component="div" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>State <mark>*</mark></FormLabel>
                                            <AutoCompleteDropdown
                                                name={'State'}
                                                selectedValue={props.formValues.home_address[0].state}
                                                listArray={homePinData.state}
                                                onChangeValue={changeDistrictState}
                                                dropDownType={'home_address'} />
                                            <ErrorMessage name={`home_address.${0}.state`} component="div" />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} className="pt-0">
                                    <Grid className="addressfields" sx={{pb:5}}>
                                        {formValues && formValues.map((element, index) => (
                                            <div>
                                                <Grid className="addressfields grid-wrap"  container spacing={2} sx={{ pb:5, pt:5}}>
                                                    <Grid item xs={12}>
                                                        <FormLabel className="light-circle">
                                                            <Box
                                                                className="addnumber"
                                                                component="div" sx={{ display: 'inline-block' }}
                                                            >
                                                                {index +3}
                                                            </Box>
                                                            Other
                                                        </FormLabel>


                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <FormLabel>Type of Address<mark>*</mark></FormLabel>
                                                        <OtherInputField type="text"
                                                                    value={fieldValue(index,'address_type')}
                                                                    onChange={otherAddressChange('address_type', index)}
                                                                    placeholder="Example Offce Address Capital Address...Etc. "/>

                                                    </Grid>

                                                    <Grid item xs={12}>
                                                        <FormLabel>Flat, House no., Building, Company, Apartment <mark>*</mark></FormLabel>
                                                        <OtherInputField type="text"
                                                                    value={fieldValue(index,'flat')}
                                                                    onChange={otherAddressChange('flat', index)}
                                                                    placeholder="Example Offce Address Capital Address...Etc. "/>
                                                        {otherAddressError('flat', index) && <p>Please enter flat details</p>}
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <FormLabel>PIN Code <mark>*</mark></FormLabel>
                                                        <OtherNumberField
                                                            className=''
                                                            name="other_pincode"
                                                            value={fieldValue(index,'pincode')}
                                                            onChange={otherAddressChange('pincode', index)}
                                                            placeholder='Enter Pin Code'
                                                            onInput={(event) => {
                                                                event.target.value = event.target.value.replace(/\D/g, '').slice(0, 6);

                                                            }}
                                                        />
                                                        {otherAddressError('pincode', index) && <p>Please enter pincode</p>}
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <FormLabel>Area, Street, Sector, Village <mark>*</mark></FormLabel>
                                                        <OtherInputField type="text"
                                                                         value={fieldValue(index,'street')}
                                                                         onChange={otherAddressChange('street', index)}
                                                                         placeholder="Enter Area, Street, Etc.s"
                                                        />
                                                        {otherAddressError('street', index) && <p>Please enter street details </p>}
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <FormLabel>Town/City <mark>*</mark></FormLabel>
                                                        <AutoCompleteDropdown
                                                            name={'District'}
                                                            selectedValue={fieldValue(index,'district')}
                                                            listArray={otherDistrictStateArray('district', index)}
                                                            onChangeValue={otherAddressChange('district', index)}
                                                        />
                                                        {otherAddressError('district', index) && <p>Please select district</p>}
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <FormLabel>State <mark>*</mark></FormLabel>
                                                        <AutoCompleteDropdown
                                                            name={'State'}
                                                            selectedValue={fieldValue(index,'state')}
                                                            listArray={otherDistrictStateArray('state', index)}
                                                            onChangeValue={otherAddressChange('state', index)}
                                                        />
                                                        {otherAddressError('state', index) &&  <p>Please select state</p>}
                                                    </Grid>
                                                </Grid>
                                                    <Grid item xs={12} className="d-flex align-items-center">
                                                        {formValues.length === index + 1 &&
                                                            <div>
                                                                <Primarybutton addclass="addanotherfieldsbtn me-1 mb-1"
                                                                               starticon={<AddIcon/>}
                                                                               buttonlabel="Add another Address"
                                                                               handleclick={() => addFormFields()}/>
                                                                <Typography>( As Delhi Address, Office Address
                                                                    etc.)</Typography>
                                                            </div>
                                                        }
                                                        {formValues.length >= 1 ? (
                                                            <Primarybutton addclass="deletebtn"
                                                                           buttonlabel={<DeleteIcon/>}
                                                                           handleclick={() => removeFormFields(index)}/>

                                                        ) : null}
                                                    </Grid>
                                            </div>

                                        ))}

                                        {!isValuePresent(formValues) &&
                                            <Grid item xs={12} className="d-flex align-items-center">
                                                <div>
                                                    <Primarybutton addclass="addanotherfieldsbtn me-1 mb-1"
                                                                   starticon={<AddIcon/>}
                                                                   buttonlabel="Add another Address"
                                                                   handleclick={() => addFormFields()}/>
                                                    <Typography>( As Delhi Address, Office Address etc.)</Typography>
                                                </div>
                                            </Grid>
                                        }
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
    mobiles: [],
    std_code: "",
    landline: "",
    email:"",
    check:false,
    current_address:[{
        flat:"",
        pincode:"",
        street:"",
        district:"",
        state:"",
    }],
    home_address:[{
        flat:"",
        pincode:"",
        street:"",
        district:"",
        state:"",
    }],
    other_address:[],
};
Communicationform.validationSchema = Yup.object().shape({
    email:Yup.string()
        .required('Email is required')
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Invalid email format'
        ),

    current_address: Yup.array().of(
        Yup.object().shape({
            flat: Yup.string().required('Please enter your Address'),
            street: Yup.string().required('Please enter your Street'),
            district: Yup.string().required('Please Select your District'),
            state: Yup.string().required('Please Select your State'),
            pincode: Yup.string().required('Please enter your Pincode'),
        })
    ),

    home_address: Yup.array().of(
        Yup.object().shape({
            flat: Yup.string().required('Please enter your Address'),
            street: Yup.string().required('Please enter your Street'),
            district: Yup.string().required('Please Select your District'),
            state: Yup.string().required('Please Select your State'),
            pincode: Yup.string().required('Please enter your Pincode'),
        })
    ),

    other_address: Yup.array().of(
        Yup.object().when('length', {
            is: (length) => length > 0,
            then: Yup.object().shape({
                flat: Yup.string().required('Please enter your Address'),
                street: Yup.string().required('Please enter your Street'),
                district: Yup.string().required('Please Select your District'),
                state: Yup.string().required('Please Select your State'),
                pincode: Yup.string().required('Please enter your Pincode'),
            }),
        })
    ),

});
export default Communicationform