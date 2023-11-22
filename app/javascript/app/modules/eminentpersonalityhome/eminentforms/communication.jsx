import {Box, FormLabel, Grid, Paper, Stack, TextField, Typography} from '@mui/material';
import React, {useContext, useEffect, useState} from 'react';
import {ErrorMessage, Field} from 'formik';
import {styled} from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Formheading from "../component/formheading/formheading";
import Inputfield from "../component/inputfield/inputfield";
import Primarybutton from '../component/primarybutton/primarybutton';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus, faTrash} from '@fortawesome/free-solid-svg-icons';
import {getFormData, getStateData} from "../../../api/stepperApiEndpoints/stepperapiendpoints";
import NumberField from "../component/numberfield/numberfield";
import * as Yup from "yup";
import axios from "axios";
import {
    formFilledValues,
    isValuePresent,
    saveProgress,
    saveProgressButton,
    showErrorToast,
    showSuccessToast
} from "../../utils";
import AutoCompleteDropdown from "../simpleDropdown/autoCompleteDropdown";
import { v4 as uuidv4 } from 'uuid';
import OtherInputField from "../component/otherFormFields/otherInputField";
import OtherNumberField from "../component/otherFormFields/otherNumberInput";
import {ApiContext} from "../../ApiContext";

const Communicationform =(props)=>{
    const {config,isCandidateLogin} = useContext(ApiContext)
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor:'transparent',
        boxShadow:'none',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        flexGrow: 1,
    }));
    const [formValues, setFormValues] = useState(props.formValues.address)
    const [otherPinData, setOtherPinData] = useState([])
    const [mobileFields, setMobileFields] =useState([])
    const [sameAddress, setSameAddress] = useState(props.formValues.check || false)

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
            address_type: "Other",
            flat: "",
            pincode: "",
            street: "",
            district: "",
            state: ""
        }])
    }


    let removeFormFields = (formIndex) => {
        const newFormValues =  formValues.filter((field, index) => index !== formIndex)
        const pinData = otherPinData.filter((item) => item.id !== formIndex)
        setOtherPinData(pinData)
        setFormValues(newFormValues);
    }


    const handlePinCodeChange = (pinCode, pincodeType) => {
        const  pinApi= `https://api.postalpincode.in/pincode/${pinCode}`
        if (pinCode.length > 5) {
            axios.get(pinApi)
                .then((response) => {
                    const responseData = response.data[0];
                    if (responseData.Status === 'Success') {
                        showSuccessToast(responseData.Message)
                        const districts = [...new Set(responseData.PostOffice.map(item => item.District))];
                        const state = [...new Set(responseData.PostOffice.map(item => item.State))];
                        setPincodes(districts, state, pincodeType)
                    } else {
                        showErrorToast(responseData.Message)
                    }
                })
                .catch((error) => {

                    console.error('Error fetching data:', error);
                });
        }
    };

    const setPincodes = (districts, state, pincodeType) => {
        let totalData = otherPinData.filter((item) => item.id !== pincodeType);
        setOtherPinData(totalData.concat({ id: pincodeType, district: districts, state: state }));
    }

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
        if (sameAddress) {
            for (const key in formValues[0]) {
                if (key !== 'address_type') {
                    if (formValues[1].hasOwnProperty(key)) {
                        formValues[1][key] = formValues[0][key]
                    }
                }
            }
        }

    }, [sameAddress, formValues[0]]);


    const otherAddressChange = (name, index, formType) => (value) => {
        if (name === 'pincode') {
            otherAddressChange('district', index)('')
            otherAddressChange('state', index)('')
            handlePinCodeChange(value,  formType)
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


    const otherDistrictStateArray = (type, formType) => {
        const form = otherPinData.find((field) => field.id === formType)
       if (form) {
           return form[type]
       } else {
           return  []
       }
    }

    useEffect(() => {
        props.formValues.address = formValues
    },[formValues])


    const saveProgress = () => {
        const fieldsWithValues = formFilledValues(props.formValues);
        getFormData(fieldsWithValues, props.activeStep + 1, config, true, isCandidateLogin,props.stateId).then(response => {
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
                        <div onClick={saveProgress}>
                            {saveProgressButton}
                        </div>
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
                            <Grid container spacing={2} sx={{mb:3}} class='mt-4'>
                                <Grid item xs={12} className="pt-0">
                                    <Grid item xs={12}>
                                        <Formheading number="2" heading="Address" />
                                    </Grid>
                                    <Grid className="addressfields" sx={{pb:5}}>
                                        {formValues && formValues.map((element, index) => (
                                            <div>
                                                <Grid className="addressfields grid-wrap"  container spacing={2} sx={{ pb:5, pt:5}}>
                                                    <Grid item xs={12} className="d-flex">
                                                        <FormLabel className="light-circle">
                                                            <Box
                                                                className="addnumber"
                                                                component="div" sx={{ display: 'inline-block' }}
                                                            >
                                                                {index + 1}
                                                            </Box>
                                                            {element.address_type}
                                                        </FormLabel>
                                                        {element.address_type === 'Home Town Address' &&
                                                            <Grid className='testright ml-auto-important' item xs={7}>
                                                                <FormLabel>Home town address is same as current? Yes
                                                                    <mark>*</mark>
                                                                </FormLabel>
                                                                <Field onClick={() => setSameAddress(!sameAddress)} type="checkbox"
                                                                       name="check"/>
                                                            </Grid>
                                                        }
                                                    </Grid>

                                                    {element.address_type !== 'Home Town Address' &&  element.address_type !== 'Current Address' &&
                                                        <Grid item xs={6}>
                                                            <FormLabel>Type of Address
                                                                <mark>*</mark>
                                                            </FormLabel>
                                                            <OtherInputField type="text"
                                                                             disabled={element.address_type === 'Home Town Address' ? sameAddress : false}
                                                                             value={fieldValue(index, 'address_type')}
                                                                             onChange={otherAddressChange('address_type', index)}
                                                                             placeholder="Example Offce Address Capital Address...Etc. "/>
                                                            <ErrorMessage name={`address.${index}.address_type`} component="div"/>
                                                        </Grid>
                                                    }
                                                    <Grid item xs={12}>
                                                        <FormLabel>Flat, House no., Building, Company, Apartment <mark>*</mark></FormLabel>
                                                        <OtherInputField type="text"
                                                                    disabled={element.address_type === 'Home Town Address' ? sameAddress : false}
                                                                    value={fieldValue(index,'flat')}
                                                                    onChange={otherAddressChange('flat', index)}
                                                                    placeholder="Example Offce Address Capital Address...Etc. "/>
                                                        <ErrorMessage name={`address.${index}.flat`} component="div" />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <FormLabel>PIN Code <mark>*</mark></FormLabel>
                                                        <OtherNumberField
                                                            disabled={element.address_type === 'Home Town Address' ? sameAddress : false}
                                                            className=''
                                                            name="other_pincode"
                                                            value={fieldValue(index,'pincode')}
                                                            onChange={otherAddressChange('pincode', index, element.address_type)}
                                                            placeholder='Enter Pin Code'
                                                            onInput={(event) => {
                                                                event.target.value = event.target.value.replace(/\D/g, '').slice(0, 6);

                                                            }}
                                                        />
                                                        <ErrorMessage name={`address.${index}.pincode`} component="div" />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <FormLabel>Area, Street, Sector, Village <mark>*</mark></FormLabel>
                                                        <OtherInputField type="text"
                                                                         disabled={element.address_type === 'Home Town Address' ? sameAddress : false}
                                                                         value={fieldValue(index,'street')}
                                                                         onChange={otherAddressChange('street', index)}
                                                                         placeholder="Enter Area, Street, Etc.s"
                                                        />
                                                        <ErrorMessage name={`address.${index}.street`} component="div" />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <FormLabel>Town/City <mark>*</mark></FormLabel>
                                                        <AutoCompleteDropdown
                                                            disabled={element.address_type === 'Home Town Address' ? sameAddress : false}
                                                            name={'District'}
                                                            selectedValue={fieldValue(index,'district')}
                                                            listArray={otherDistrictStateArray('district', element.address_type)}
                                                            onChangeValue={otherAddressChange('district', index)}
                                                        />
                                                        <ErrorMessage name={`address.${index}.district`} component="div" />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <FormLabel>State <mark>*</mark></FormLabel>
                                                        <AutoCompleteDropdown
                                                            disabled={element.address_type === 'Home Town Address' ? sameAddress : false}
                                                            name={'State'}
                                                            selectedValue={fieldValue(index,'state')}
                                                            listArray={otherDistrictStateArray('state', element.address_type)}
                                                            onChangeValue={otherAddressChange('state', index)}
                                                        />
                                                        <ErrorMessage name={`address.${index}.state`} component="div" />
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
                                                        {index > 1 && formValues?.length === index + 1? (
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
    address:[
        {
            address_type: "Current Address",
            flat: "",
            pincode: "",
            street: "",
            district: "",
            state: "",
        },
        {
            address_type: "Home Town Address",
            flat: "",
            pincode: "",
            street: "",
            district: "",
            state: "",
        }
        ],
    other_address:[],
};
Communicationform.validationSchema = Yup.object().shape({
    email:Yup.string()
        .required('Email is required')
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Invalid email format'
        ),

    address: Yup.array().of(
        Yup.object().shape({
            flat: Yup.string().required('Please enter your Address'),
            street: Yup.string().required('Please enter your Street'),
            district: Yup.string().required('Please Select your District'),
            state: Yup.string().required('Please Select your State'),
            pincode: Yup.string().required('Please enter your Pincode'),
        })
    ),




});
export default Communicationform