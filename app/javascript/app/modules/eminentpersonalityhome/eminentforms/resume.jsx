import { Typography, Stack, Box, Paper, Grid, FormLabel, TextField,Textarea} from '@mui/material';
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { styled } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import './allfroms.scss'
import Formheading from "../component/formheading/formheading";
import Savebtn from "../component/saveprogressbutton/button";
import Inputfield from "../component/inputfield/inputfield";
import Selectfield from "../component/selectfield/selectfield";
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import Primarybutton from '../component/primarybutton/primarybutton';
const Resumeform=()=>{
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor:'transparent',
        boxShadow:'none',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        flexGrow: 1,
    }));
    const [fields, setFields] = useState([""]);

    const [showFields, setShowFields] = useState(false);
    const [formValues, setFormValues] = useState([])
    const handleAddField = () => {
        setFields([...fields, ""]);
        setShowFields(true)
    };
    const handledelete=()=>{
        const allfields = [...fields];
        allfields.splice(-1, 1);
        setFields(allfields)
    }

    return(
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Stack className="mb-4" direction="row" useFlexGap flexWrap="wrap">
                    <Item><Formheading number="1" heading="Political Legacy ( family in politics )" /></Item>
                    <Item sx={{textAlign:'right'}}><Savebtn/></Item>
                </Stack>
                <Grid className='detailFrom' container spacing={2}>
                    <Grid item xs={8}>
                        <Formik
                            initialValues={{name: "", relationship: "", profile:""}}
                            validate={(values) => {
                                const errors = {};
                                if (!values.education) {
                                    errors.education = "Required";
                                }
                                if (!values.qualification) {
                                    errors.qualification = "Required";
                                }
                                if(!values.college){
                                    errors.college="Required"
                                }
                                if (!values.board) {
                                    errors.board = "Required";
                                }
                                if (!values.school) {
                                    errors.school = "Required";
                                }
                                if (!values.profession) {
                                    errors.profession = "Required";
                                }
                                return errors;
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
                                    <Grid container spacing={2} className="grid-wrap">
                                        <Grid item xs={6}>
                                            <FormLabel>Name</FormLabel>
                                            <Inputfield type="text"
                                                        name="name"
                                                        placeholder="Enter full name"/>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Relationship </FormLabel>
                                            <Selectfield name="relationship"/>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormLabel>Profile <InfoOutlinedIcon/></FormLabel>
                                            <TextField
                                                className='p-0'
                                                fullWidth
                                                name="desc"
                                                multiline
                                                minRows={3}
                                                maxRows={4}
                                                placeholder="Tell me about your profile..."
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container sx={{my:3}} className="grid-wrap">
                                        <Grid item sx={{mb:2}} xs={12}>
                                            <Typography variant="h5" content="h5">
                                                <Box className="detailnumbers" component="div" sx={{ display: 'inline-block' }}>2</Box> Family Relations
                                            </Typography>
                                        </Grid>
                                        <Grid container spacing={2} className="grid-wrap">
                                            <Grid item xs={12}>
                                                <FormLabel>Father's Name</FormLabel>
                                                <Inputfield type="text"
                                                            name="fathername"
                                                            placeholder="Enter name"/>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormLabel>Mother's Name</FormLabel>
                                                <Inputfield type="text"
                                                            name="mothername"
                                                            placeholder="Enter name"/>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormLabel>Spouse Name</FormLabel>
                                                <Inputfield type="text"
                                                            name="spousename"
                                                            placeholder="Enter name"/>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormLabel>Children Name</FormLabel>
                                                <Inputfield type="text"
                                                            name="childrenname"
                                                            placeholder="Enter name"/>
                                            </Grid>
                                            {showFields && fields.map((field, index) => (
                                                <Grid item xs={12}>
                                                    <FormLabel>Children Name</FormLabel>
                                                    <Inputfield type="text"
                                                                name="Add another detail"
                                                                placeholder="Enter detail"/>
                                                </Grid>
                                            ))}
                                            <Grid item xs={12}>
                                            <Primarybutton addclass="addanotherfieldsbtn me-3" starticon={<AddIcon/>} buttonlabel="Add another Field" handleclick={handleAddField}/>
                                                {fields.length>=1 ?(
                                                    <Primarybutton addclass="deletebtn mt-3" buttonlabel={<DeleteIcon/>} handleclick={handledelete}/>
                                                ):null}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid container sx={{spacing:0}} className="grid-wrap">
                                        <Grid item sx={{mb:2}} xs={12}>
                                            <Typography variant="h5" content="h5">
                                                <Box className="detailnumbers" component="div" sx={{ display: 'inline-block' }}>3</Box> Links <InfoOutlinedIcon/>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4} sx={{mb:2}}>
                                            <FormLabel>Website</FormLabel>
                                            <Inputfield type="text"
                                                        name="website"
                                                        placeholder="Enter Your website Url"
                                                        endIcon={<HelpOutlineOutlinedIcon/>}/>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormLabel>Description <InfoOutlinedIcon/></FormLabel>
                                            <TextField
                                                className='p-0'
                                                fullWidth
                                                name="desc"
                                                multiline
                                                minRows={3}
                                                maxRows={4}
                                                placeholder="Please enter your professional description only, anything related to  Sangathan not to be entered here"
                                            />
                                        </Grid>
                                    </Grid>

                                </Form>
                            )}
                        </Formik>
                    </Grid>
                    <Grid item xs={4}>
                        {/* <Button type="submit" className="savebtn" variant="contained" disabled={save}> Save Progress</Button> */}

                    </Grid>
                </Grid>

            </Box>
        </>

    )
}
export default Resumeform