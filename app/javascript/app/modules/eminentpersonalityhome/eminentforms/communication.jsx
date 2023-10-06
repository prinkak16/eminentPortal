import { Typography, Stack, Box, Paper, Grid, FormLabel} from '@mui/material';
import React, { useState } from 'react';
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
import {getFormData} from "../../../api/stepperApiEndpoints/stepperapiendpoints";
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

    return(
        <>
            
                        <Formik
                            initialValues={{whatsapp_number: "", std_code: "", landline: "", current_flat:"",current_pincode:"", current_street:"",current_district:"",current_state:"", home_flat:"",home_pincode:"", home_street:"", home_district:"", home_state:"", other_flat:"", check:"", type_of_other_address:"", other_district:"", other_state:"", other_pincode:"",   }}
                            validate={(values) => {
                                const errors = {};
                                if (!/^\d+$/.whatsapp_number(value)) {
                                    errors.whatsapp_number = "Required";
                                }
                                if (!values.email) {
                                    errors.email = "Required";
                                } else if (
                                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                                ) {
                                    errors.email = "Invalid email address";
                                }
                                if (!values.current_flat) {
                                    errors.current_flat = "Required";
                                }
                                if (!values.current_pincode) {
                                    errors.current_pincode = "Required";
                                }
                                if (!values.current_street) {
                                    errors.current_street = "Required";
                                }
                                if (!values.current_district) {
                                    errors.current_district = "Required";
                                }
                                if (!values.current_state) {
                                    errors.current_state = "Required";
                                }
                                if (!values.home_flat) {
                                    errors.home_flat = "Required";
                                }
                                if (!values.home_pincode) {
                                    errors.home_pincode = "Required";
                                }
                                if (!values.home_street) {
                                    errors.home_street = "Required";
                                }
                                if (!values.home_district) {
                                    errors.home_district = "Required";
                                }
                                if (!values.home_state) {
                                    errors.home_state = "Required";
                                }
                                if (!values.other_flat) {
                                    errors.other_flat = "Required";
                                }
                                if (!values.other_street) {
                                    errors.other_street = "Required";
                                }
                                if (!values.other_district) {
                                    errors.other_district = "Required";
                                }
                                if (!values.other_state) {
                                    errors.other_state = "Required";
                                }
                                if (!values.other_pincode) {
                                    errors.other_pincode = "Required";
                                }
                                props.enableProgressAction(Object.keys(errors).length === 1);
                                return errors;
                            }}
                            
                            onSubmit={(values, { setSubmitting }) => {
                                setTimeout(() => {
                                alert(JSON.stringify(values, null, 2));
                                setSubmitting(false);
                                    getFormData(values).then(response => {
                                        console.log('API response:', response.data);
                                    })
                                }, 400);
                            }}
                        >
                            {({isSubmitting})=>(
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
                                                                        <Inputfield type="text"
                                                                                    name="whatsapp_number"
                                                                                    placeholder="Enter Mobile No."/>

                                                                        <ErrorMessage name="whatsapp_number" component="div" />
                                                                    </Grid>
                                                                    
                                                                    {showFields && fields.map((field, index) => (
                                                                        <Grid item xs={4}>
                                                                            <div key={index}>
                                                                                <FormLabel>Another number</FormLabel>
                                                                                <Inputfield type="text"
                                                                                            name="mobile"
                                                                                            placeholder="Enter Mobile No."
                                                                                            handlechange={(e) => {
                                                                                                const updatedFields = [...fields];
                                                                                                updatedFields[index] = e.target.value;
                                                                                                setFields(updatedFields);
                                                                                            }}/>
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
                                                                {fields.length>=2 ?(
                                                                    null
                                                                ):<Primarybutton addclass="addanotherfieldsbtn me-2 mb-2" starticon={<AddIcon/>} buttonlabel="Add Another" handleclick={handleAddField}/>}
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
                                                                        <Inputfield type="text"
                                                                                    name="std_code"
                                                                                    placeholder="STD Code"/>
                                                                    </Grid>
                                                                    <Grid item xs={6}>
                                                                        <Inputfield type="text"
                                                                                    name="landline"
                                                                                    placeholder="Number"/>

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
                                                                        <Inputfield type="text"
                                                                                    name="current_pincode"
                                                                                    placeholder="Enter pin code"/>
                                                                        <ErrorMessage name="current_pincode" component="div" />
                                                                    </Grid>
                                                                    <Grid item xs={6}>
                                                                        <FormLabel>Area, Street, Sector, Village <sup>*</sup></FormLabel>
                                                                        <Inputfield type="text"
                                                                                    name="current_street"
                                                                                    placeholder="Enter Area, Street, Etc.s"/>
                                                                        <ErrorMessage name="current_street" component="div" />
                                                                    </Grid>
                                                                    <Grid item xs={6}>
                                                                        <FormLabel>Town/City <sup>*</sup></FormLabel>
                                                                        <Selectfield name="current_district"   optionList={['Select Town','Delhi','Gurugram']}/>
                                                                        <ErrorMessage name="current_district" component="div" />
                                                                    </Grid>
                                                                    <Grid item xs={6}>
                                                                        <FormLabel>State <sup>*</sup></FormLabel>
                                                                        <Selectfield name="current_state" optionList={['Select State','Delhi','Gurugram']}/>
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
                                                                        <Selectfield name="home_district"  optionList={['Select Town','Delhi','Gurugram']}/>
                                                                        <ErrorMessage name="home_district" component="div" />
                                                                    </Grid>
                                                                    <Grid item xs={6}>
                                                                        <FormLabel>State <sup>*</sup></FormLabel>
                                                                        <Selectfield name="home_state"  optionList={['Select State','Delhi','Gurugram']}/>
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

                                                                                    <ErrorMessage name="house" component="div" />
                                                                                </Grid>
                                                                                <Grid item xs={6}>
                                                                                    <FormLabel>PIN Code <sup>*</sup></FormLabel>
                                                                                    <Inputfield type="text"
                                                                                                name="other_pincode"
                                                                                                value={element.other_pincode || ""}
                                                                                                placeholder="Enter pin code"/>
                                                                                    <ErrorMessage name="other_pincode" component="div" />
                                                                                </Grid>
                                                                                <Grid item xs={6}>
                                                                                    <FormLabel>Area, Street, Sector, Village <sup>*</sup></FormLabel>
                                                                                    <Inputfield type="text"
                                                                                                name="other_street"
                                                                                                value={element.other_street || ""}
                                                                                                placeholder="Enter Area, Street, Etc.s"/>
                                                                                    <ErrorMessage name="other_street" component="div" />
                                                                                </Grid>
                                                                                <Grid item xs={6}>
                                                                                    <FormLabel>Town/City <sup>*</sup></FormLabel>
                                                                                    <Selectfield name="other_district"  optionList={['Select City','Delhi','Gurugram']}/>
                                                                                    <ErrorMessage name="other_district" component="div" />
                                                                                </Grid>
                                                                                <Grid item xs={6}>
                                                                                    <FormLabel>State <sup>*</sup></FormLabel>
                                                                                <Selectfield name="other_state"  optionList={['Select State','Delhi','Gurugram']}/>
                                                                                    <ErrorMessage name="other_state" component="div" />
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