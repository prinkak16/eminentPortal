import { Typography, Stack, Box, Paper, Grid, FormLabel, TextField,Textarea} from '@mui/material';
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { styled } from '@mui/material/styles';
import Startdatepicker from '../component/startdatepicker/startdatepicker';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Formheading from "../component/formheading/formheading";
import Selectfield from "../component/selectfield/selectfield";
import Savebtn from "../component/saveprogressbutton/button";
import Inputfield from "../component/inputfield/inputfield";
import Stepfouraddmore from '../component/stepfouraddmore/selectlokshabha';
import Rajyasabhaform from '../component/stepfouraddmore/selectrajyasabha';
import Vidhansabhaform from '../component/stepfouraddmore/lagislativeassemblyform';
import Urbanlocalfrom from '../component/stepfouraddmore/urbanlocal';
import Primarybutton from '../component/primarybutton/primarybutton';
const PolticalandGovrnform =()=>{
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor:'transparent',
        boxShadow:'none',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        flexGrow: 1,
    }));
    const [showFields, setShowFields] = useState(false);
    const [formValues, setFormValues] = useState([])
    const [count, setcount]=useState(2)
    const handlesocialfield = () => {
        setFormValues([...formValues, { organization: "", description: "" }])
        setShowFields(true);
        setcount(count+1);
    }
   const handledelete = () => {
        const newFormValues = [...formValues];
        newFormValues.splice(-1, 1);
        setFormValues(newFormValues);
        setcount(count-1);
    }
const [electfiled, setElectfield]=useState(false)
const handleaddField = () => {
    setElectfield(true)
}
function handlremoveField(){
    setElectfield(false)
}
    return(
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Stack className="mb-4" direction="row" useFlexGap flexWrap="wrap">
                    <Item><Formheading number="1" heading="Political Profile" /></Item>
                    <Item sx={{textAlign:'right'}}><Savebtn/></Item>
                </Stack>
                <Grid className='detailFrom' container spacing={2}>
                    <Grid item xs={12}>
                        <Formik
                            initialValues={{party_level: "", unit: "", designation:"", startyear: "", endyear:"", party:"", position:"", organization:"", description:""}}
                            validate={(values) => {
                                const errors = {};
                                if (!values.party_level) {
                                    errors.party_level = "Required";
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
                                    <Grid container className="educationforms grid-wrap" >
                                        <Grid item xs={4}>
                                            <FormLabel>Party level <sup>*</sup></FormLabel>
                                            <Selectfield name="party_level" optionList={['Select Party Level']}/>
                                            <ErrorMessage name="party_level" component="div" />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <FormLabel>Unit</FormLabel>
                                            <Selectfield name="unit" optionList={['Select Unit']}/>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <FormLabel>Designation</FormLabel>
                                            <Selectfield name="designation" optionList={['Select Designation']}/>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <FormLabel  fullwidth>Start Year</FormLabel><br/>
                                            <Startdatepicker  year="start_year"/>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <FormLabel>End / Passing Year</FormLabel><br/>
                                            <Startdatepicker  year="end_year"/>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Primarybutton addclass="cancelbtn cancel" buttonlabel="Cancel"/>
                                            <Primarybutton addclass="nextbtn" buttonlabel="Save"/>
                                        </Grid>
                                    </Grid>
                                    <Grid container sx={{my:3}} spacing={2}>
                                        <Grid item xs={2}>
                                            <FormLabel>Years with BJP</FormLabel>
                                            <Inputfield type="number"
                                                        name="bjp"
                                                        placeholder="00"/>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <FormLabel>Years with RSS</FormLabel>
                                            <Inputfield type="number"
                                                        name="rss"
                                                        placeholder="00"/>
                                        </Grid>
                                    </Grid>
                                    <Grid container sx={{my:3}} className="grid-wrap">
                                        <Grid item sx={{mb:2}} xs={12}>
                                            <Typography variant="h5" content="h5">
                                                <Box className="detailnumbers" component="div" sx={{ display: 'inline-block' }}>2</Box> Other Party Profile ( If any )
                                            </Typography>
                                        </Grid>
                                        <Grid container className="educationforms">
                                            <Grid item xs={4}>
                                                <FormLabel>Party</FormLabel>
                                                <Inputfield type="text"
                                                            name="party"
                                                            placeholder="Enter Party"/>

                                            </Grid>
                                            <Grid item xs={4}>
                                                <FormLabel>Position</FormLabel>
                                                <Inputfield type="text"
                                                            name="position"
                                                            placeholder="Enter Position"/>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <FormLabel  fullwidth>Start Year</FormLabel><br/>
                                                <Startdatepicker  year="start_year"/>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <FormLabel>End Year</FormLabel><br/>
                                                <Startdatepicker  year="end_year"/>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Primarybutton addclass="cancelbtn cancel" buttonlabel="Cancel"/>
                                                <Primarybutton addclass="nextbtn" buttonlabel="Save"/>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid container className="grid-wrap">
                                        <Grid item sx={{mb:2}} xs={12}>
                                            <Typography variant="h5" content="h5">
                                                <Box className="detailnumbers" component="div" sx={{ display: 'inline-block' }}>3</Box> Social Affiliation <InfoOutlinedIcon/>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4} sx={{mb:2}}>
                                            <FormLabel>Organization </FormLabel>
                                            <Inputfield type="text"
                                                        name="organization"
                                                        placeholder="Enter Organization "/>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormLabel>Description <InfoOutlinedIcon/></FormLabel>
                                            <TextField
                                                className='p-0'
                                                fullWidth
                                                name="description"
                                                multiline
                                                minRows={3}
                                                maxRows={4}
                                                placeholder="Please enter your Organization description."
                                            />
                                        </Grid>
                                        <Grid item  xs={12}>
                                        {showFields && formValues.map((field, index) => (
                                         
                                                <Grid container>
                                                    <Grid item sx={{mb:2}} xs={12}>
                                                        <Typography variant="h5" content="h5">
                                                            <Box className="detailnumbers" component="div" sx={{ display: 'inline-block' }}>3{count}</Box> Social Affiliation <InfoOutlinedIcon/>
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={4} sx={{mb:2}}>
                                                        <FormLabel>Organization </FormLabel>
                                                        <Inputfield type="text"
                                                                    name="organization"
                                                                    placeholder="Enter Organization "/>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <FormLabel>Description <InfoOutlinedIcon/></FormLabel>
                                                        <TextField
                                                            className='p-0'
                                                            fullWidth
                                                            name="description"
                                                            multiline
                                                            minRows={3}
                                                            maxRows={4}
                                                            placeholder="Please enter your Organization description."
                                                        />
                                                    </Grid>
                                                </Grid>
                                            ))}
                                        </Grid>
                                        <Grid item  xs={12}>
                                        <Primarybutton addclass="addanotherfieldsbtn me-2" starticon={<AddIcon/>} buttonlabel="Add Another" handleclick={()=>handlesocialfield()}/>
                                            
                                            {formValues.length>=1 ?(
                                                 <Primarybutton addclass="deletebtn mt-3" starticon={<DeleteIcon/>} handleclick={()=>handledelete(formValues.length-1)}/>
                                            ):null}
                                        </Grid>
                                        
                                         
                                         </Grid>
                                    <Grid container className="grid-wrap">
                                        <Grid item sx={{mt:3}} xs={12}>
                                            <Typography variant="h5" content="h5">
                                                <Box className="detailnumbers" component="div" sx={{ display: 'inline-block' }}>4</Box> Electoral / Government <sup>*</sup>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4} sx={{mt:2, ml:3}}>
                                            <FormLabel fullwidth>Have you contested any election?</FormLabel>
                                            <div className='d-flex'>
                                                <label className='d-flex justify-content-start me-3 ' >
                                                    <Field onChange={handleaddField} className="w-auto me-2" type="radio" name="won" value="One" /> Yes
                                                </label>
                                                <label className='d-flex justify-content-start'>
                                                    <Field onChange={handlremoveField} type="radio" className="w-auto me-2" name="won" value="Two" /> No
                                                </label>
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} sx={{mb:2}}>
                                            <Grid container spacing={2} className='px-5 py-3'>
                                                <Grid item xs={4}>
                                                    {electfiled &&(
                                                        <Selectfield selectedvalues={selectedOption} handleSelectChange={selectChange} name="state"  optionList={['Select Type','Lok sabha','Rajya sabha', 'Legislative Assembly (vidhan sabha)', 'Legislative Council (vidhan sabha)', 'Urban Local body', 'Rural Local body', 'Other']}/>
                                                    )}
                                                </Grid>
                                                <Grid item xs={9}>
                                                {selectedOption === 'Lok sabha' && (
                                                        <Stepfouraddmore/>
                                                )}
                                                 {selectedOption === 'Rajya sabha' && (
                                                        <Rajyasabhaform/>
                                                )}
                                                 {selectedOption === 'Legislative Assembly (vidhan sabha)' && (
                                                        <Vidhansabhaform/>
                                                )}
                                                {selectedOption === 'Legislative Council (vidhan sabha)' && (
                                                        <Vidhanprishadform/>
                                                )}
                                                {selectedOption === 'Urban Local body' && (
                                                        <Urbanlocalfrom/>
                                                )}
                                                {selectedOption === 'Rural Local body' && (
                                                         <Urbanlocalfrom/>
                                                )}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} sx={{mb:2}}>
                                            <Primarybutton addclass="nextbtn mb-2" starticon={<AddIcon/>} buttonlabel="Add More"/>
                                            <Typography>( If fought any other election. )</Typography>
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
export default PolticalandGovrnform