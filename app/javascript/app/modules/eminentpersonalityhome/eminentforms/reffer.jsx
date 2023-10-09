import React from "react"
import {Stack, Typography, Button, Box, Paper, Grid, FormLabel, TextField} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { styled } from '@mui/material/styles';
import Formheading from "../component/formheading/formheading";
import Savebtn from "../component/saveprogressbutton/button";
import Inputfield from "../component/inputfield/inputfield";
import {getFormData} from "../../../api/stepperApiEndpoints/stepperapiendpoints";
const Refferedform=(props)=>{
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor:'transparent',
        boxShadow:'none',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        flexGrow: 1,
    }));
    return(
        <>

                <Grid className='detailFrom' container spacing={2}>
                    <Grid item xs={12}>
                        <Formik
                            initialValues={{name: "", mobile: "", bjpid: "", grade:"", comments:""}}
                            validate={(values) => {
                                const errors = {};

                                props.enableProgressAction(Object.keys(errors).length === 0);
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
                            {({isSubmitting})=>(
                                <Form>
                                    <Box sx={{ flexGrow: 1 }}>

                                        <Stack className="mb-4" direction="row" useFlexGap flexWrap="wrap">
                                            <Item><Formheading number="1" heading="Referred by" /></Item>
                                            <Item sx={{textAlign:'right'}}><Savebtn/></Item>
                                        </Stack>
                                    <Grid container spacing={2} sx={{mb:3}} className="grid-wrap"> 
                                        <Grid item xs={6}>
                                            <FormLabel>Name</FormLabel>
                                            <Inputfield type="text"
                                                        name="name"
                                                        placeholder="Enter Name"/>

                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Phone no.</FormLabel>
                                            <Inputfield type="text"
                                                        name="mobile"
                                                        placeholder="Enter phone no."/>

                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>BJP ID</FormLabel>
                                            <Inputfield type="text"
                                                        name="bjpid"
                                                        placeholder="BJP ID"/>

                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Remark</FormLabel>
                                            <TextField
                                                className='p-0'
                                                fullWidth
                                                name="comments"
                                                multiline
                                                minRows={3}
                                                maxRows={4}
                                                placeholder="Write something"
                                            />
                                        </Grid>
                                    </Grid>
                                    </Box>
                                </Form>

                            )}

                        </Formik>
                    </Grid>

                </Grid>

        </>

    )
}
export default Refferedform;