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
import React, {useContext, useEffect, useState} from 'react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import {styled} from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Formheading from "../component/formheading/formheading";
import Inputfield from "../component/inputfield/inputfield";
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import Primarybutton from '../component/primarybutton/primarybutton';
import {getFileUpload, getFormData} from "../../../api/stepperApiEndpoints/stepperapiendpoints";
import * as Yup from "yup";
import PdfIcon from '../../../../../../public/images/PdfIcon.svg';
import {
    disabledSaveProgressButton,
    formFilledValues, isMobileUser,
    isValuePresent, mobileView,
    saveProgress,
    saveProgressButton,
    showErrorToast,
    VisuallyHiddenInput
} from "../../utils";
import {ApiContext} from "../../ApiContext";

const Resumeform = (props) => {
    const {config,isCandidateLogin, setBackDropToggle} = useContext(ApiContext)
    const Item = styled(Paper)(({theme}) => ({
        backgroundColor: 'transparent',
        boxShadow: 'none',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        flexGrow: 1,
    }));
    const [children, setChildren] = useState(isValuePresent(props.formValues?.children) ? props.formValues?.children : [''])
    const [PdfFileName, setPdfFileName] = useState(props.formValues?.attachment_name)
    const [pdfFile, setPdfFile] = useState(props.formValues?.attachment);
    const [politicalLegacyProfile, sePoliticalLegacyProfile] = useState(props.formValues?.political_legacy[0]?.profile)
    const [isViewDisabled, setIsViewDisabled] = useState(false)

    useEffect(() => {
        if (props.viewMode === 'view') {
            setIsViewDisabled(true)
        }

    },[props.viewMode])
    const addChildren = () => {
        setChildren([...children, '']);
    };

    const deleteChild = (index, event) => {
        event.preventDefault();
        const updatedChildren = [...props.formValues.children];
        updatedChildren.splice(index, 1);
        setChildren(updatedChildren);
        props.formValues.children = updatedChildren;
    };



    const uploadResume = (event) => {
        const file = event.target.files[0]
        if (file.type.split('/').pop() === 'pdf') {
            handleImageUpload(file)
        } else {
            showErrorToast(`Please upload PDF file only.`)
        }
    }

    const handleImageUpload = (file) => {
        setBackDropToggle(true)
        getFileUpload(file,config,isCandidateLogin, setBackDropToggle).then(res => {
            setPdfFileName(file.name)
            props.formValues.attachment_name = file.name
            setPdfFile(res.data.file_path)
            props.formValues.attachment = res.data.file_path
        });
    };

    const openPdfInBrowser = (file) => {
            if (file) {
                window.open(file, '_blank');
            }
    };

    const saveProgress = () => {
        if (!isViewDisabled) {
            const fieldsWithValues = formFilledValues(props.formValues);
            getFormData(fieldsWithValues, props.activeStep + 1, config, true, isCandidateLogin, props.stateId, setBackDropToggle).then(response => {
            });
        }
    }

    const onChangePolLegProfile = (e) => {
        sePoliticalLegacyProfile(e.target.value)
        props.formValues.political_legacy[0].profile = e.target.value
    }



    return (
        <>

            <Box sx={{flexGrow: 1}} className={`${isMobileUser ? 'resume-mobile-view' : ''}`}>
                <Stack className="mb-4" direction="row" useFlexGap flexWrap="wrap">
                    <Item><Formheading number="1" heading="Political Legacy ( family in politics )"/></Item>
                    <Item sx={{textAlign: 'right'}}>
                        <div onClick={saveProgress}>
                            {
                                isViewDisabled ?
                                    disabledSaveProgressButton :
                                    saveProgressButton
                            }
                        </div>
                    </Item>
                </Stack>
                <Grid container spacing={2} className="grid-wrap">
                    <Grid item xs={mobileView()}>
                        <FormLabel>Name</FormLabel>
                        <Inputfield type="text"
                                    disabled={isViewDisabled}
                                    value={props.formValues.political_legacy[0].name}
                                    name={`political_legacy.${0}.name`}
                                    placeholder="Enter full name"/>
                    </Grid>
                    <Grid item xs={mobileView()}>
                        <FormLabel>Relationship </FormLabel>
                        <FormControl>
                            <Field
                                disabled={isViewDisabled}
                                as={Select}
                                name={`political_legacy.${0}.relationship`}
                                labelId="relationship"
                                className="custom-select"
                                fullWidth
                                inputProps={{'aria-label': 'Without label'}}
                            >
                                <MenuItem value="0" disabled={true}>
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
                    <Grid item xs={mobileView('profile')}>
                        <FormLabel>Profile <InfoOutlinedIcon/></FormLabel>
                        <TextField
                            disabled={isViewDisabled}
                            className='p-0'
                            fullWidth
                            name="political_legacy_profile"
                            onChange={onChangePolLegProfile}
                            value={politicalLegacyProfile}
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
                        <Grid item xs={mobileView()}>
                            <FormLabel>Father's Name</FormLabel>
                            <Inputfield type="text"
                                        disabled={isViewDisabled}
                                        name="father"
                                        value={props.formValues.father}
                                        placeholder="Enter name"
                            />
                        </Grid>
                        <Grid item xs={mobileView()}>
                            <FormLabel>Mother's Name</FormLabel>
                            <Inputfield type="text"
                                        disabled={isViewDisabled}
                                        name="mother"
                                        value={props.formValues.mother}
                                        placeholder="Enter name"
                            />
                        </Grid>
                        <Grid item xs={mobileView()}>
                            <FormLabel>Spouse Name</FormLabel>
                            <Inputfield type="text"
                                        disabled={isViewDisabled}
                                        name="spouse"
                                        value={props.formValues.spouse}
                                        placeholder="Enter name"
                            />

                        </Grid>
                        {children && children.map((field, index) => (
                            <Grid item xs={mobileView()}>
                                <FormLabel>Child Name</FormLabel>
                                <Inputfield type="text"
                                            disabled={isViewDisabled}
                                            name={`children.${index}`}
                                            value={props.formValues.children[index]}
                                            placeholder="Enter child name"
                                />
                                <ErrorMessage name={`child.${index}`} style={{color:'red'}} component="p" />
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Primarybutton disabled={isViewDisabled} addclass="addanotherfieldsbtn me-3" starticon={<AddIcon/>}
                                           buttonlabel="Add Child" handleclick={addChildren}/>
                            {children.length > 1 ? (
                                <Primarybutton disabled={isViewDisabled} addclass="deletebtn mt-3" buttonlabel={<DeleteIcon/>}
                                               handleclick={(e) => deleteChild(children.length - 1,e)}/>
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
                    <Grid className='websites-container' xs={12}>
                        <Grid className={`first-container websites${isMobileUser ? '-mobile' : ''}`} >
                            <Grid item xs={mobileView('social')} sx={{mb: 2}}>
                                <FormLabel>Website</FormLabel>
                                <Inputfield type="text"
                                            disabled={isViewDisabled}
                                            name="website"
                                            value={props.formValues.website}
                                            placeholder="Enter Your website Url"
                                            inputprop={{endAdornment: <InputAdornment position="end"><HelpOutlineOutlinedIcon/></InputAdornment>}}/>
                            </Grid>
                            <Grid item xs={mobileView('social')} sx={{mb: 2}}>
                                <FormLabel>Twitter</FormLabel>
                                <Inputfield type="text"
                                            disabled={isViewDisabled}
                                            name="twitter"
                                            value={props.formValues.twitter}
                                            placeholder="Enter your twitter Url"
                                            inputprop={{endAdornment: <InputAdornment position="end">
                                                    <HelpOutlineOutlinedIcon/>
                                                </InputAdornment>}}/>
                            </Grid>
                        </Grid>

                        <Grid className={`second-container websites${isMobileUser ? '-mobile' : ''}`}  >
                            <Grid item xs={mobileView('social')} sx={{mb: 2}}>
                                <FormLabel>Linkedin</FormLabel>
                                <Inputfield type="text"
                                            disabled={isViewDisabled}
                                            name="linkedin"
                                            value={props.formValues.linkedin}
                                            placeholder="Enter your linkedin Url"
                                            inputprop={{endAdornment: <InputAdornment position="end"><HelpOutlineOutlinedIcon/></InputAdornment>}}/>

                            </Grid>
                            <Grid item xs={mobileView('social')} sx={{mb: 2}}>
                                <FormLabel>Facebook</FormLabel>
                                <Inputfield type="text"
                                            disabled={isViewDisabled}
                                            name="facebook"
                                            value={props.formValues.facebook}
                                            placeholder="Enter your facebook Url"
                                            inputprop={{endAdornment: <InputAdornment position="end"><HelpOutlineOutlinedIcon/></InputAdornment>}}/>

                            </Grid>
                        </Grid>

                        <Grid className={`third-container websites${isMobileUser ? '-mobile' : ''}`}>
                            <Grid item xs={mobileView('social')} sx={{mb: 2}}>
                                <FormLabel>Instagram</FormLabel>
                                <Inputfield type="text"
                                            disabled={isViewDisabled}
                                            value={props.formValues.instagram}
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
                                     sx={{display: 'inline-block'}}>4</Box> Upload your Resume/Biodata <mark>*</mark>

                            </Typography>
                        </Grid>
                        {!isValuePresent(pdfFile) &&
                            < ErrorMessage name='attachment' style={{color:'red'}} component="p" />
                        }
                        <div>
                            <div className="pdf-upload-div d-flex align-items-center w-100">
                                <div className='pdf-icon-name'>
                                    <span className="material-icons"><PdfIcon/></span>
                                    <div id="pdf-file-name" onClick={() => openPdfInBrowser(pdfFile)}>{PdfFileName}</div>
                                </div>
                                <div className='upload-resume-button'>
                                    <Button   disabled={isViewDisabled} component="label" variant="contained" startIcon={<CloudUploadIcon/>}>
                                        Upload
                                        <VisuallyHiddenInput accept="application/pdf" onChange={uploadResume} type="file"/>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className='pdf-msg'>
                            <span className='pdf-msg-text'><mark>*</mark> Only PDF file allowed.</span>
                        </div>
                    </Grid>
                </Grid>
            </Box>
        </>

    )
}
Resumeform.label = 'Resume'
Resumeform.initialValues = {
    political_legacy: [
        {
            name: "",
            relationship: "",
            profile: ""
        }
    ],
    father:"",
    mother:"",
    spouse:"",
    children:[''],
    website:"",
    twitter:"",
    linkedin:"",
    facebook:"",
    instagram:"",
    attachment: "",
    attachment_name:"",
};
Resumeform.validationSchema = Yup.object().shape({
    attachment:Yup.string().required('Please Upload resume'),
});
export default Resumeform