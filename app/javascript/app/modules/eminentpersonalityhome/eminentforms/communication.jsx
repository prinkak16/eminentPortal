import {Box, FormLabel, Grid, Paper, Stack, TextField, Typography} from '@mui/material';
import React, {useEffect, useState} from 'react';
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
import {getStateData} from "../../../api/stepperApiEndpoints/stepperapiendpoints";
import NumberField from "../component/numberfield/numberfield";
import * as Yup from "yup";
import axios from "axios";
import {isValuePresent} from "../../utils";
import AutoCompleteDropdown from "../simpleDropdown/autoCompleteDropdown";
import { v4 as uuidv4 } from 'uuid';
import OtherInputField from "../component/otherFormFields/otherInputField";
import OtherNumberField from "../component/otherFormFields/otherNumberInput";

const Communicationform =(props)=>{
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
    const [otherPinData, setOtherPinData] = useState([{id: '', district: [], state: []}])
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
            other_type: "",
            other_flat: "",
            other_street: "",
            other_pincode: "",
            other_district: "",
            other_state: ""
        }])
    }
    let removeFormFields = (id) => {
        const newFormValues =  formValues.filter((field) => field.id !== id)
        setFormValues(newFormValues);
    }


    const handlePinCodeChange = (pinCode, type, id) => {
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
                        } else if (type === 'home_pincode') {
                            setHomePinData({district: district, state: state})
                        } else if (type === 'other_pincode') {
                            setOtherPinData([...otherPinData, {id: id, district: district, state: state}])
                        }
                    }
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        }
    };



    const userMobileNumber = 9999223772

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
        if (props.formValues.pincode.length > 5) {
            handlePinCodeChange(props.formValues.pincode, 'pincode')
        }
    }, [props.formValues.pincode]);

    useEffect(() => {
        if (props.formValues.home_pincode.length > 5) {
            handlePinCodeChange(props.formValues.home_pincode, 'home_pincode')
        }

    }, [props.formValues.home_pincode]);

    const changeDistrictState = (value, name, type) => {
        if (type === 'current_address') {
            if (name === 'District') {
                props.formValues.district = value
            } else {
                props.formValues.state = value
            }
        }

        if (type === 'home_address') {
            if (name === 'District') {
                props.formValues.home_district = value
            } else {
                props.formValues.home_state = value
            }
        }
        if (type === 'other_address') {
            if (name === 'District') {
                props.formValues.home_district = value
            } else {
                props.formValues.home_state = value
            }
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

    const otherAddressChange = (name, id) => (value) => {
        if (name === 'other_pincode') {
            handlePinCodeChange(value, 'other_pincode', id)
        }

        setFormValues((prevFormValues) => {
            return prevFormValues.map((form) => {
                if (form.id === id) {
                    return {
                        ...form,
                        [name]: value,
                    };
                }
                return form;
            });
        });
    };


    const fieldValue = (id, name) => {
        const form = formValues.find((field) => field.id === id)
        if (form) {
            return form[name]
        } else {
            ''
        }

    }


    const otherDistrictStateArray = (type, id) => {
        const form = otherPinData.find((field) => field.id === id)
       if (form) {
           return form[type]
       } else {
           return  []
       }
    }

    useEffect(() => {
        props.formValues.other_address = formValues
    },[formValues])


    return(
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Stack direction="row" useFlexGap flexWrap="wrap">
                    <Formheading number="1" heading="Communication" />
                    <Item sx={{textAlign:'right'}}>
                        <Savebtn/>
                    </Item>
                </Stack>
                <div className="detailFrom">
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <div className='mobiles-container'>
                                <div className='mobile-number-field'>
                                    <FormLabel className="mobile-label">1. Mobile Number <mark>*</mark></FormLabel>
                                    <input value={userMobileNumber} maxLength={10} className="primary-number mobile-fields" disabled={true}/>
                                    <div className='add-delete-btns'>
                                        {mobileFields.length === 0 &&
                                            <span className='add-btn' onClick={() => addMobileField()}>
                                                <span>
                                                     <FontAwesomeIcon icon={faPlus}/>
                                                 </span>
                                                 Add Another
                                            </span>
                                        }
                                    </div>
                                </div>

                                {mobileFields && mobileFields.map((field, i) =>(
                                    <div className='mobile-number-field'>
                                        <FormLabel className="mobile-label">{i+2}. Mobile Number <mark>*</mark></FormLabel>
                                        <input
                                            maxLength={10}
                                            placeholder='Enter Mobile Number'
                                            value={field.number}
                                            onChange={enterMobileNumber(field.id)}
                                            className="mobile-fields" />
                                        <div className='add-delete-btns'>
                                            {mobileFields.length < 2 &&
                                                <span className='add-btn' onClick={() => addMobileField()}>
                                                      <span>
                                                         <FontAwesomeIcon icon={faPlus}/>
                                                     </span>
                                                     Add Another
                                                </span>
                                            }
                                            <span className='delete-button' onClick={() => deleteMobileNumber(field.id)}>
                                                <FontAwesomeIcon icon={faTrash}/>
                                            </span>
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
                                                        value={props.formValues.flat}
                                                        name="flat"
                                                        placeholder="Enter your address"/>
                                            <ErrorMessage name="flat" component="div" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>PIN Code <mark>*</mark></FormLabel>
                                            <NumberField
                                                className=''
                                                value={props.formValues.pincode}
                                                name="pincode"
                                                placeholder='Enter Pin Code'
                                                onInput={(event) => {
                                                    event.target.value = event.target.value.replace(/\D/g, '').slice(0, 6);

                                                }}
                                            />
                                            <ErrorMessage name="pincode" component="div" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Area, Street, Sector, Village <mark>*</mark></FormLabel>
                                            <Field type="text" id="street"  as={TextField} name="street" />
                                            <ErrorMessage name="street" component="div" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Town/City <mark>*</mark></FormLabel>
                                            <AutoCompleteDropdown
                                                name={'District'}
                                                selectedValue={props.formValues.district}
                                                listArray={curPinData.district}
                                                onChangeValue={changeDistrictState}
                                                dropDownType={'current_address'} />
                                            <ErrorMessage name="district" component="div" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>State <mark>*</mark></FormLabel>
                                            <AutoCompleteDropdown
                                                name={'State'}
                                                selectedValue={props.formValues.state}
                                                listArray={curPinData.state}
                                                onChangeValue={changeDistrictState}
                                                dropDownType={'current_address'} />
                                            <ErrorMessage name="state" component="div" />
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
                                                name="home_flat"
                                                value={props.formValues.home_flat}
                                                placeholder="Enter your address"
                                            />
                                            <ErrorMessage name="home_flat" component="div" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>PIN Code <mark>*</mark></FormLabel>
                                            <NumberField
                                                className=''
                                                name="home_pincode"
                                                value={props.formValues.pincode}
                                                placeholder='Enter Pin Code'
                                                onInput={(event) => {
                                                    event.target.value = event.target.value.replace(/\D/g, '').slice(0, 6);

                                                }}
                                            />
                                            <ErrorMessage name="home_pincode" component="div" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Area, Street, Sector, Village <mark>*</mark></FormLabel>
                                            <Inputfield type="text"
                                                        name="home_street"
                                                        placeholder="Enter Area, Street, Etc.s"
                                                        value={props.formValues.home_street}
                                            />
                                            <ErrorMessage name="home_street" component="div" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Town/City <mark>*</mark></FormLabel>
                                            <AutoCompleteDropdown
                                                name={'District'}
                                                selectedValue={props.formValues.home_district}
                                                listArray={homePinData.district}
                                                onChangeValue={changeDistrictState}
                                                dropDownType={'home_address'} />
                                            <ErrorMessage name="home_district" component="div" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>State <mark>*</mark></FormLabel>
                                            <AutoCompleteDropdown
                                                name={'State'}
                                                selectedValue={props.formValues.home_state}
                                                listArray={homePinData.state}
                                                onChangeValue={changeDistrictState}
                                                dropDownType={'home_address'} />
                                            <ErrorMessage name="home_state" component="div" />
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
                                                                    value={fieldValue(element.id,'other_type')}
                                                                    onChange={otherAddressChange('other_type', element.id)}
                                                                    placeholder="Example Offce Address Capital Address...Etc. "/>
                                                    </Grid>

                                                    <Grid item xs={12}>
                                                        <FormLabel>Flat, House no., Building, Company, Apartment <mark>*</mark></FormLabel>
                                                        <OtherInputField type="text"
                                                                    value={fieldValue(element.id,'other_flat')}
                                                                    onChange={otherAddressChange('other_flat', element.id)}
                                                                    placeholder="Example Offce Address Capital Address...Etc. "/>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <FormLabel>PIN Code <mark>*</mark></FormLabel>
                                                        <OtherNumberField
                                                            className=''
                                                            name="other_pincode"
                                                            value={fieldValue(element.id,'other_pincode')}
                                                            onChange={otherAddressChange('other_pincode', element.id)}
                                                            placeholder='Enter Pin Code'
                                                            onInput={(event) => {
                                                                event.target.value = event.target.value.replace(/\D/g, '').slice(0, 6);

                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <FormLabel>Area, Street, Sector, Village <mark>*</mark></FormLabel>
                                                        <OtherInputField type="text"
                                                                         value={fieldValue(element.id,'other_street')}
                                                                         onChange={otherAddressChange('other_street', element.id)}
                                                                         placeholder="Enter Area, Street, Etc.s"
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <FormLabel>Town/City <mark>*</mark></FormLabel>
                                                        <AutoCompleteDropdown
                                                            name={'District'}
                                                            selectedValue={fieldValue(element.id,'other_district')}
                                                            listArray={otherDistrictStateArray('district', element.id)}
                                                            onChangeValue={otherAddressChange('other_district', element.id)}
                                                        />
                                                        {/*<SelectField name="other_district"  defaultOption="Select District" optionList={StateData}/>*/}
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <FormLabel>State <mark>*</mark></FormLabel>
                                                        <AutoCompleteDropdown
                                                            name={'State'}
                                                            selectedValue={fieldValue(element.id,'other_state')}
                                                            listArray={otherDistrictStateArray('state', element.id)}
                                                            onChangeValue={otherAddressChange('other_state', element.id)}
                                                        />
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
                                                                           handleclick={() => removeFormFields(element.id)}/>

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
    flat:"",
    pincode:"",
    street:"",
    district:"",
    state:"",
    check:false,
    home_flat:"",
    home_pincode:"",
    home_street:"",
    home_district:"",
    home_state:"",
    other_address:[],
    other_flat:"",
    other_district:"",
    other_state:"",
    other_pincode:"",
};
Communicationform.validationSchema = Yup.object().shape({
    // email:Yup.string()
    //     .required('Email is required')
    //     .matches(
    //         /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    //         'Invalid email format'
    //     ),
    // flat: Yup.string().required('Please enter your Address'),
    // street: Yup.string().required('Please enter your Street'),
    // district: Yup.string().required('Please enter your District'),
    // state: Yup.string().required('Please enter your State'),
    // pincode: Yup.string().required('Please enter your Pincode'),
    // home_flat: Yup.string().required('Please enter your Address'),
    // home_street: Yup.string().required('Please enter your Street'),
    // home_district: Yup.string().required('Please enter your District'),
    // home_state: Yup.string().required('Please enter your State'),
    // home_pincode: Yup.string().required('Please enter your Pincode')

});
export default Communicationform