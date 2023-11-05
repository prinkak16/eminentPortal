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
    Button, Select, MenuItem, FormControl
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React, {useState} from 'react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import {styled} from '@mui/material/styles';
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
import OtherInputField from "../component/otherFormFields/otherInputField";
import PdfIcon from '../../../../../../public/images/PdfIcon.svg';

const Resumeform = (props) => {
    const Item = styled(Paper)(({theme}) => ({
        backgroundColor: 'transparent',
        boxShadow: 'none',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        flexGrow: 1,
    }));
    const [fields, setFields] = useState([""]);
    const [children, setChildren] = useState([{name:''}])
    const [fileName, setFileName] = useState('')
    const [pdfFile, setPdfFile] = useState(null);
    const addChildren = () => {
        setChildren([...children, {name:''}]);
    };
    const deleteChild = (index) => {
        children.splice(index, 1);
    }
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

    const enterChildName = (value, index) => {
        setChildren((prevChildren) => {
            return prevChildren.map((form, i) => {
                if (i === index) {
                    return {
                        ...form,
                        ['name']: value,
                    };
                }
                return form;
            });
        });
    };


    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const uploadResume = (event) => {
        const file = event.target.files[0]
        if (file.type.split('/').pop() === 'pdf') {
            setFileName(file.name)
            setPdfFile(file)
        } else {
            alert('Please upload PDF file only.');
        }
    }

    const openPdfInBrowser = (file) => {
        if (file) {
            const pdfData = URL.createObjectURL(file);
            const newWindow = window.open(pdfData, '_blank');
            if (newWindow) {
                newWindow.focus();
            } else {
                alert('Your browser blocked the new tab. Please check your browser settings.');
            }
        }
    };

    return (
        <>

            <Box sx={{flexGrow: 1}}>
                <Stack className="mb-4" direction="row" useFlexGap flexWrap="wrap">
                    <Item><Formheading number="1" heading="Political Legacy ( family in politics )"/></Item>
                    <Item sx={{textAlign: 'right'}}><Savebtn/></Item>
                </Stack>
                <Grid container spacing={2} className="grid-wrap">
                    <Grid item xs={6}>
                        <FormLabel>Name</FormLabel>
                        <Inputfield type="text"
                                    name="political_legacy_name"
                                    placeholder="Enter full name"/>
                    </Grid>
                    <Grid item xs={6}>
                        <FormLabel>Relationship </FormLabel>
                        <FormControl>
                            <Field
                                as={Select}
                                name="political_legacy_relationship"
                                labelId="relationship"
                                className="custom-select"
                                fullWidth
                                displayEmpty
                                inputProps={{'aria-label': 'Without label'}}
                            >
                                <MenuItem value="0">
                                    <em>Select Relationship</em>
                                </MenuItem>
                                <MenuItem value="Father">
                                    <em>Father</em>
                                </MenuItem>
                                <MenuItem value="Mother">
                                    <em>Mother</em>
                                </MenuItem>
                                <MenuItem value="Sister">
                                    <em>Sister</em>
                                </MenuItem>
                                <MenuItem value="Brother">
                                    <em>Brother</em>
                                </MenuItem>
                            </Field>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormLabel>Profile <InfoOutlinedIcon/></FormLabel>
                        <TextField
                            className='p-0'
                            fullWidth
                            name="political_legacy_profile"
                            multiline
                            minRows={3}
                            maxRows={4}
                            placeholder="Tell me about your profile..."
                        />
                    </Grid>
                </Grid>
                <Grid container sx={{my: 3}} className="grid-wrap">
                    <Grid item sx={{mb: 2}} xs={12}>
                        <Typography variant="h5" content="h5">
                            <Box className="detailnumbers" component="div" sx={{display: 'inline-block'}}>2</Box> Family
                            Relations
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
                        {children && children.map((field, index) => (
                            <Grid item xs={6}>
                                <FormLabel>Children Name</FormLabel>
                                <OtherInputField
                                    type="text"
                                    value={field.name}
                                    onChange={enterChildName}
                                    fieldIndex={index}
                                    placeholder={'Enter name'}/>
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Primarybutton addclass="addanotherfieldsbtn me-3" starticon={<AddIcon/>}
                                           buttonlabel="Add another Field" handleclick={addChildren}/>
                            {fields.length >= 1 ? (
                                <Primarybutton addclass="deletebtn mt-3" buttonlabel={<DeleteIcon/>}
                                               handleclick={deleteChild}/>
                            ) : null}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container spacing={1} className="grid-wrap">
                    <Grid item sx={{mb: 2}} xs={12}>
                        <Typography variant="h5" content="h5">
                            <Box className="detailnumbers" component="div"
                                 sx={{display: 'inline-block'}}>3</Box> Links <InfoOutlinedIcon/>
                        </Typography>
                    </Grid>
                    <Grid className='websites-container'>
                        <Grid className='first-container websites'>
                            <Grid item xs={3} sx={{mb: 2}}>
                                <FormLabel>Website</FormLabel>
                                <Inputfield type="text"
                                            name="website"
                                            placeholder="Enter Your website Url"
                                            inputprop={{endAdornment: <InputAdornment position="end"><HelpOutlineOutlinedIcon/></InputAdornment>}}/>
                            </Grid>
                            <Grid item xs={3} sx={{mb: 2}}>
                                <FormLabel>Twitter</FormLabel>
                                <Inputfield type="text"
                                            name="twitter"
                                            placeholder="Enter your twitter Url"
                                            inputprop={{endAdornment: <InputAdornment position="end">
                                                    <HelpOutlineOutlinedIcon/>
                                                </InputAdornment>}}/>
                            </Grid>
                        </Grid>

                        <Grid className='second-container websites'>
                            <Grid item xs={3} sx={{mb: 2}}>
                                <FormLabel>Linkedin</FormLabel>
                                <Inputfield type="text"
                                            name="linkedin"
                                            placeholder="Enter your linkedin Url"
                                            inputprop={{endAdornment: <InputAdornment position="end"><HelpOutlineOutlinedIcon/></InputAdornment>}}/>
                            </Grid>
                            <Grid item xs={3} sx={{mb: 2}}>
                                <FormLabel>Facebook</FormLabel>
                                <Inputfield type="text"
                                            name="facebook"
                                            placeholder="Enter your facebook Url"
                                            inputprop={{endAdornment: <InputAdornment position="end"><HelpOutlineOutlinedIcon/></InputAdornment>}}/>
                            </Grid>
                        </Grid>

                        <Grid className='third-container websites'>
                            <Grid item xs={3} sx={{mb: 2}}>
                                <FormLabel>Instagram</FormLabel>
                                <Inputfield type="text"
                                            name="instagram"
                                            placeholder="Enter your instagram Url"
                                            inputprop={{endAdornment: <InputAdornment position="end"><HelpOutlineOutlinedIcon/></InputAdornment>}}/>
                            </Grid>
                        </Grid>
                    </Grid>


                    <Grid item xs={12}>
                        <Grid item sx={{mb: 2}} xs={12}>
                            <Typography variant="h5" content="h5">
                                <Box className="detailnumbers" component="div"
                                     sx={{display: 'inline-block'}}>4</Box> Upload your Resume/Biodata <sup>*</sup>
                            </Typography>
                        </Grid>

                        <div>
                            <div className="pdf-upload-div d-flex align-items-center w-100">
                                <div className='pdf-icon-name'>
                                    <span className="material-icons"><PdfIcon/></span>
                                    <div id="pdf-file-name" onClick={() => openPdfInBrowser(pdfFile)}>{fileName}</div>
                                </div>
                                <div className='upload-resume-button'>
                                    <Button component="label" variant="contained" startIcon={<CloudUploadIcon/>}>
                                        Upload APR
                                        <VisuallyHiddenInput accept="application/pdf" onChange={uploadResume} type="file"/>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </Box>
        </>

    )
}
Resumeform.label = 'Resume'
Resumeform.initialValues = {
    political_legacy_name: "",
    political_legacy_relationship: "",
    political_legacy_profile:"",
    father_name:"",
    mother_name:"",
    spouse_name:"",
    children:[],
    website:"",
    twitter:"",
    linkedin:"",
    facebook:"",
    instagram:"",
    won:"",
    state:"",
};
Resumeform.validationSchema = Yup.object().shape({
    // whatsapp_number: Yup.number().required('Please enter your first name'),
    // std_code: Yup.number().required('Please enter your last name')
});
export default Resumeform