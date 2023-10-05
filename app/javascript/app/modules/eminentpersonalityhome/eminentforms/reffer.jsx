import React from "react"
import {Stack, Typography, Button, Box, Paper, Grid, FormLabel} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { styled } from '@mui/material/styles';
import Formheading from "../component/formheading/formheading";
import Savebtn from "../component/saveprogressbutton/button";
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
                            initialValues={{name: "", mobile: "", bjpid: "", grade:"", comments:""}}
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