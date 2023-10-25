import {
    Typography,
    Stack,
    Box,
    Paper,
    Grid,
    FormLabel,
    TextField,
    Textarea,
    InputAdornment,
    Button
} from '@mui/material';
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { styled } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Formheading from "../component/formheading/formheading";
import Savebtn from "../component/saveprogressbutton/button";
import Inputfield from "../component/inputfield/inputfield";
import Selectfield from "../component/selectfield/selectfield";
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import Primarybutton from '../component/primarybutton/primarybutton';
import {getFileUpload, getFormData} from "../../../api/stepperApiEndpoints/stepperapiendpoints";
import * as Yup from "yup";
const Resumeform=(props)=>{
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
    const [selectedOption, setSelectedOption] = useState('');
    const selectChange = (e) => {
        setSelectedOption(e.target.value);
      };
    const [pdfUrl, setPdfUrl] = useState('');

    const handlePdfUpload = (event) => {
        const uploadedFile = event.currentTarget.files[0];
        if (uploadedFile) {
            getFileUpload(uploadedFile)
                .then((pdfUrl) => {
                    if (pdfUrl) {
                        setPdfUrl(pdfUrl); // Set the PDF URL in the state
                    } else {
                        console.error('File upload failed or URL not found');
                    }
                })
                .catch((error) => {
                    console.error('File upload failed', error);
                });
        }
    };

    const handleViewPdf = () => {
        window.open(pdfUrl, "_blank");
        console.log(pdfUrl);
    };
    return(
        <>

                                    <Box sx={{ flexGrow: 1 }}>
                                        <Stack className="mb-4" direction="row" useFlexGap flexWrap="wrap">
                                            <Item><Formheading number="1" heading="Political Legacy ( family in politics )" /></Item>
                                            <Item sx={{textAlign:'right'}}><Savebtn/></Item>
                                        </Stack>
                                    <Grid container spacing={2} className="grid-wrap">
                                        <Grid item xs={6}>
                                            <FormLabel>Name</FormLabel>
                                            <Inputfield type="text"
                                                        name="name"
                                                        placeholder="Enter full name"/>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormLabel>Relationship </FormLabel>
                                            <Selectfield name="relationship" selectedvalues={selectedOption} handleSelectChange={selectChange} optionList={['Select Relationship']}/>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormLabel>Profile <InfoOutlinedIcon/></FormLabel>
                                            <TextField
                                                className='p-0'
                                                fullWidth
                                                name="profile"
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
                                            <Grid item xs={6}>
                                                <FormLabel>Father's Name</FormLabel>
                                                <Inputfield type="text"
                                                            name="father"
                                                            placeholder="Enter name"
                                                            />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <FormLabel>Mother's Name</FormLabel>
                                                <Inputfield type="text"
                                                            name="mother"
                                                            placeholder="Enter name"
                                                            />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <FormLabel>Spouse Name</FormLabel>
                                                <Inputfield type="text"
                                                            name="spouse"
                                                            placeholder="Enter name"
                                                            />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <FormLabel>Children Name</FormLabel>
                                                <Inputfield type="text"
                                                            name="child"
                                                            placeholder="Enter name"/>
                                            </Grid>
                                            {showFields && fields.map((field, index) => (
                                                <Grid item xs={6}>
                                                    <FormLabel>Children Name</FormLabel>
                                                    <Inputfield type="text"
                                                                name="children"
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
                                    <Grid container spacing={2} className="grid-wrap">
                                        <Grid item sx={{mb:2}} xs={12}>
                                            <Typography variant="h5" content="h5">
                                                <Box className="detailnumbers" component="div" sx={{ display: 'inline-block' }}>3</Box> Links <InfoOutlinedIcon/>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} sx={{mb:2}}>
                                            <FormLabel>Website</FormLabel>
                                            <Inputfield type="text"
                                                        name="website"
                                                        placeholder="Enter Your website Url"
                                                        inputprop={{endAdornment: <InputAdornment position="end"><HelpOutlineOutlinedIcon/></InputAdornment>}}/>
                                        </Grid>
                                        <Grid item xs={6} sx={{mb:2}}>
                                            <FormLabel>Twitter</FormLabel>
                                            <Inputfield type="text"
                                                        name="website"
                                                        placeholder="Enter your twitter Url"
                                                        inputprop={{endAdornment: <InputAdornment position="end"><HelpOutlineOutlinedIcon/></InputAdornment>}}/>
                                        </Grid>
                                        <Grid item xs={6} sx={{mb:2}}>
                                            <FormLabel>Linkedin</FormLabel>
                                            <Inputfield type="text"
                                                        name="website"
                                                        placeholder="Enter your linkedin Url"
                                                        inputprop={{endAdornment: <InputAdornment position="end"><HelpOutlineOutlinedIcon/></InputAdornment>}}/>
                                        </Grid>
                                        <Grid item xs={6} sx={{mb:2}}>
                                            <FormLabel>Facebook</FormLabel>
                                            <Inputfield type="text"
                                                        name="website"
                                                        placeholder="Enter your facebook Url"
                                                        inputprop={{endAdornment: <InputAdornment position="end"><HelpOutlineOutlinedIcon/></InputAdornment>}}/>
                                        </Grid>
                                        <Grid item xs={6} sx={{mb:2}}>
                                            <FormLabel>Instagram</FormLabel>
                                            <Inputfield type="text"
                                                        name="website"
                                                        placeholder="Enter your instagram Url"
                                                        inputprop={{endAdornment: <InputAdornment position="end"><HelpOutlineOutlinedIcon/></InputAdornment>}}/>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Grid item sx={{mb:2}} xs={12}>
                                                <Typography variant="h5" content="h5">
                                                    <Box className="detailnumbers" component="div" sx={{ display: 'inline-block' }}>4</Box> Upload your Resume/Biodata <sup>*</sup>
                                                </Typography>
                                            </Grid>
                                            <Grid item sx={{mb:2}} xs={12}>
                                                <Field
                                                    type="file"
                                                    name="attachment"
                                                    accept=".pdf"
                                                    onChange={handlePdfUpload}
                                                    as={TextField}
                                                />

                                                {pdfUrl && (
                                                    <Grid item xs={6}>
                                                        <Button variant="contained" color="primary" onClick={handleViewPdf}>
                                                            View PDF
                                                        </Button>
                                                    </Grid>
                                                )}
                                            </Grid>

                                        </Grid>
                                    </Grid>
                                    </Box>
        </>

    )
}
Resumeform.label = 'Resume'
Resumeform.initialValues = {
    // name: "", relationship: "", profile:"", father:"", mother:"", spouse:"", child:"",children:"",website:"",twitter:"", linkedin:"", facebook:"", instagram:"", won:"", state:"",
};
Resumeform.validationSchema = Yup.object().shape({
    // whatsapp_number: Yup.number().required('Please enter your first name'),
    // std_code: Yup.number().required('Please enter your last name')
});
export default Resumeform