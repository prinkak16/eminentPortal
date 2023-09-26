import React from "react"
import {Stack, Typography, Button, Box, Paper, Grid, FormLabel} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { styled } from '@mui/material/styles';
import './allfroms.scss'
import Formheading from "../component/formheading/formheading";
import Savebtn from "../component/button/button";
import Inputfield from "../component/inputfield/inputfield";
const Refferedform=()=>{
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor:'transparent',
        boxShadow:'none',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        flexGrow: 1,
    }));
    return(
        <>
            <Box sx={{ flexGrow: 1 }}>

                <Stack className="mb-4" direction="row" useFlexGap flexWrap="wrap">
                    <Item><Formheading number="1" heading="Referred by" /></Item>
                    <Item sx={{textAlign:'right'}}><Savebtn/></Item>
                </Stack>
                <Grid className='detailFrom' container spacing={2}>
                    <Grid item xs={8}>
                        <Formik
                            initialValues={{name: "", phoneno: "", bjpid: "", write:""}}
                            validate={(values) => {
                                const errors = {};

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
                                    <Button type="submit" className="savebtn" variant="contained" disabled={save} onClick={() => {save.submitForm()}}> Save Progress</Button>
                                </Form>

                            )}

                        </Formik>
                    </Grid>

                </Grid>
            </Box>
        </>

    )
}
export default Refferedform;