import { Typography, Stack, Button, Box, Paper, Grid, FormLabel} from '@mui/material';
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';
import Formheading from "../component/formheading/formheading";
import Savebtn from "../component/button/button";
import './allfroms.scss'
import Inputfield from "../component/inputfield/inputfield";
import Selectfield from "../component/selectfield/selectfield";
const Communicationform =()=>{
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor:'transparent',
        boxShadow:'none',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        flexGrow: 1,
    }));
    const [fields, setFields] = useState([]);
    const [count, setcount]=useState(2)

    const handleAddField = () => {
        setFields([...fields, ""]);
        setShowFields(true)
    };
    const handledelete=()=>{
        const allfields = [...fields];
        allfields.splice(-1, 1);
        setFields(allfields)
    }
    const label = { inputProps: { 'aria-label': 'Home town address is same as current? Yes' } };
    const [showFields, setShowFields] = useState(false);
    const [formValues, setFormValues] = useState([])
    let addFormFields = () => {
        setFormValues([...formValues, { house: "", street: "", pincode:"", city:"", state:"" }])
        setShowFields(true)
        console.log(formValues);
        setcount(count + 1)
    }

    let removeFormFields = () => {
        const newFormValues = [...formValues];
        newFormValues.splice(-1, 1);
        setFormValues(newFormValues);
        setcount(count - 1)
    }


    return(
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Stack className="mb-4" direction="row" useFlexGap flexWrap="wrap">
                    <Formheading number="2" heading="Communication" />
                    <Item sx={{textAlign:'right'}}><Savebtn/>
                    </Item>
                </Stack>
                        <Formik
                            initialValues={{mobile: "", email: "", address: "", pincode:"",area:"",town:"",state:""}}
                            validate={(values) => {
                                const errors = {};
                                if (!values.mobile) {
                                    errors.mobile = "Required";
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
                            }}
                            onSubmit={(values, { setSubmitting }) => {
                                setTimeout(() => {
                                    alert(JSON.stringify(values, null, 2));
                                    setSubmitting(false);
                                }, 400);
                            }}
                        >
                            {({save})=>(
                                <Form>
                                    <Grid className="detailFrom">
                                        <Grid item xs={12}>
                                            <Grid  container spacing={2} sx={{mb:3}}>
                                                <Grid item xs={12}>
                                                    <Grid  container spacing={2}>
                                                        <Grid item xs={12}>
                                                            <Grid  container spacing={2}>
                                                                <Grid item xs={4}>
                                                                    <FormLabel>Mobile Number <sup>*</sup></FormLabel>
                                                                    <Inputfield type="text"
                                                                                name="mobile"
                                                                                placeholder="Enter Mobile No."/>

                                                                    <ErrorMessage name="mobile" component="div" />
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
                                                                                    <Button className="deletebtn mt-3" variant="contained" onClick={handledelete}>
                                                                                        <DeleteIcon/>
                                                                                    </Button>
                                                                                ):null}
                                                                            </div>
                                                                        </div>
                                                                    </Grid>

                                                                ))}
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Button  className="addanotherfieldsbtn me-2" onClick={handleAddField} sx={{ mb: 2 }} startIcon={<AddIcon/>}>
                                                                Add Another
                                                            </Button>


                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <FormLabel>Landline</FormLabel>
                                                <Grid className='detailFrom' container spacing={2}>
                                                    <Grid item xs={6}>
                                                        <Inputfield type="text"
                                                                    name="stdcode"
                                                                    placeholder="STD Code"/>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Inputfield type="text"
                                                                    name="number"
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
                                            <Grid container spacing={2} sx={{mb:3}}>
                                                <Grid item xs={12}>
                                                    <Grid className="addressfields" container spacing={2} sx={{ pt:2,pb:6}}>
                                                        <Grid item xs={12}>
                                                            <Formheading number="2" heading="Address" />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <FormLabel><Box className="addnumber" component="div" sx={{ display: 'inline-block' }}>{count}</Box> Current Address</FormLabel>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <FormLabel>Flat, House no., Building, Company, Apartment <sup>*</sup></FormLabel>
                                                            <Inputfield type="text"
                                                                        name="address"
                                                                        placeholder="Enter your address"/>
                                                            <ErrorMessage name="address" component="div" />
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <FormLabel>PIN Code <sup>*</sup></FormLabel>
                                                            <Inputfield type="text"
                                                                        name="pincode"
                                                                        placeholder="Enter pin code"/>
                                                            <ErrorMessage name="pincode" component="div" />
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <FormLabel>Area, Street, Sector, Village <sup>*</sup></FormLabel>
                                                            <Inputfield type="text"
                                                                        name="street"
                                                                        placeholder="Enter Area, Street, Etc.s"/>
                                                            <ErrorMessage name="street" component="div" />
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <FormLabel>Town/City <sup>*</sup></FormLabel>
                                                            <Selectfield name="city"/>
                                                            <ErrorMessage name="city" component="div" />
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <FormLabel>State <sup>*</sup></FormLabel>
                                                            <Selectfield name="state"/>
                                                            <ErrorMessage name="state" component="div" />
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Grid className="addressfields" container spacing={2} sx={{ pt:5,pb:5}}>
                                                        <Grid item xs={5}>
                                                            <FormLabel><Box className="addnumber" component="div" sx={{ display: 'inline-block' }}>2</Box> Home Town Address</FormLabel>
                                                        </Grid>
                                                        <Grid className='testright' item xs={7}>
                                                            <FormLabel >Home town address is same as current?  Yes <Checkbox {...label} /></FormLabel>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <FormLabel>Flat, House no., Building, Company, Apartment <sup>*</sup></FormLabel>
                                                            <Inputfield type="text"
                                                                        name="house"
                                                                        placeholder="Enter your address"/>
                                                            <ErrorMessage name="house" component="div" />
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <FormLabel>PIN Code <sup>*</sup></FormLabel>
                                                            <Inputfield type="text"
                                                                        name="pincode"
                                                                        placeholder="Enter pin code"/>
                                                            <ErrorMessage name="pincode" component="div" />
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <FormLabel>Area, Street, Sector, Village <sup>*</sup></FormLabel>
                                                            <Inputfield type="text"
                                                                        name="street"
                                                                        placeholder="Enter Area, Street, Etc.s"/>
                                                            <ErrorMessage name="street" component="div" />
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <FormLabel>Town/City <sup>*</sup></FormLabel>
                                                            <Selectfield name="city"/>
                                                            <ErrorMessage name="city" component="div" />
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <FormLabel>State <sup>*</sup></FormLabel>
                                                            <Selectfield name="state"/>
                                                            <ErrorMessage name="state" component="div" />
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Grid className="addressfields" container spacing={2} sx={{ pt:5,pb:5}}>
                                                        {showFields && formValues.map((element, index) => (
                                                            <div>
                                                                <Grid className="addressfields" container spacing={2} sx={{ pt:5,pb:5}}>
                                                                    <Grid item xs={12}>
                                                                        <FormLabel><Box className="addnumber" component="div" sx={{ display: 'inline-block' }}>{count}</Box> Other</FormLabel>
                                                                    </Grid>
                                                                    <Grid item xs={12}>
                                                                        <FormLabel>Flat, House no., Building, Company, Apartment <sup>*</sup></FormLabel>
                                                                        <Inputfield type="text"
                                                                                    name="house"
                                                                                    value={element.house || ""}
                                                                                    placeholder="Enter Area, Street, Etc.s"/>

                                                                        <ErrorMessage name="house" component="div" />
                                                                    </Grid>
                                                                    <Grid item xs={6}>
                                                                        <FormLabel>PIN Code <sup>*</sup></FormLabel>
                                                                        <Inputfield type="text"
                                                                                    name="pincode"
                                                                                    value={element.pincode || ""}
                                                                                    placeholder="Enter pin code"/>
                                                                        <ErrorMessage name="pincode" component="div" />
                                                                    </Grid>
                                                                    <Grid item xs={6}>
                                                                        <FormLabel>Area, Street, Sector, Village <sup>*</sup></FormLabel>
                                                                        <Inputfield type="text"
                                                                                    name="street"
                                                                                    value={element.street || ""}
                                                                                    placeholder="Enter Area, Street, Etc.s"/>
                                                                        <ErrorMessage name="street" component="div" />
                                                                    </Grid>
                                                                    <Grid item xs={6}>
                                                                        <FormLabel>Town/City <sup>*</sup></FormLabel>
                                                                        <Selectfield name="city"/>
                                                                        <ErrorMessage name="city" component="div" />
                                                                    </Grid>
                                                                    <Grid item xs={6}>
                                                                        <FormLabel>State <sup>*</sup></FormLabel>
                                                                        <Selectfield name="state"/>
                                                                        <ErrorMessage name="state" component="div" />
                                                                    </Grid>
                                                                </Grid>

                                                            </div>

                                                        ))}

                                                        <div>
                                                            <Button className="addanotherfieldsbtn" variant="outlined" type="button" onClick={()=> addFormFields()} startIcon={<AddIcon/>}>Add another Address</Button>
                                                            <Typography>( As Delhi Address, Office Address etc.)</Typography>
                                                            {formValues.length>=1 ? (
                                                                <Button
                                                                    type="button"
                                                                    variant="contained"
                                                                    className="backbtn"
                                                                    sx={{mt:3}}
                                                                    onClick={()=>removeFormFields(formValues.length-1)}
                                                                >
                                                                    <DeleteIcon/>
                                                                </Button>
                                                            ) : null}
                                                        </div>

                                                    </Grid>
                                                </Grid>
                                            </Grid>


                                            <Grid container spacing={2} sx={{mb:3}}>
                                                <Grid item xs={12}>
                                                    <Formheading number="3" heading="Referred by" />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <FormLabel>Name</FormLabel>
                                                    <Inputfield type="text"
                                                                name="entername"
                                                                placeholder="Enter Name"/>

                                                </Grid>
                                                <Grid item xs={6}>
                                                    <FormLabel>Phone no.</FormLabel>
                                                    <Inputfield type="text"
                                                                name="phoneno"
                                                                placeholder="Enter phone no."/>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <FormLabel>BJP ID</FormLabel>
                                                    <Inputfield type="text"
                                                                name="bjpid"
                                                                placeholder="BJP ID"/>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <FormLabel>BJP ID</FormLabel>
                                                    <Inputfield type="text"
                                                                name="write"
                                                                placeholder="Write something "/>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>


                                </Form>
                            )}
                        </Formik>


            </Box>
        </>

    )
}
export default Communicationform