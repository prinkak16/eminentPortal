import React, {useContext, useEffect, useState} from "react"
import {Box, Button, FormLabel, Grid, Paper, Stack, TextField, Typography,} from '@mui/material';
import {ErrorMessage, Field, useFormikContext} from 'formik';
import {styled} from '@mui/material/styles';
import ImageUpload from '../component/imageupload/imageupload';
import './allfroms.scss'
import Age from '../../../../../../public/images/age.svg'
import Formheading from "../component/formheading/formheading";
import SelectField from "../component/selectfield/selectfield";
import Inputfield from "../component/inputfield/inputfield";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronDown, faInfoCircle, faTimes} from '@fortawesome/free-solid-svg-icons';
import {
    getFileUpload,
    getFormData,
    getGenderData,
    getReligionData,
    getStepCtgry
} from "../../../api/stepperApiEndpoints/stepperapiendpoints";
import NumberField from "../component/numberfield/numberfield";
import * as Yup from "yup";
import {
    calculateAge,
    dobFormat,
    formFilledValues,
    isValuePresent,
    languagesName, saveProgress,
    saveProgressButton, VisuallyHiddenInput
} from "../../utils";
import {ApiContext} from "../../ApiContext";
import dateFormat from "dateformat";
import dayjs from "dayjs";
import moment from "moment";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import Tooltip from '@mui/material/Tooltip';
import UserIcon from '../../../../../../public/images/userIcon.svg'
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
const PersonalDetails = (props) => {
    const {config,isCandidateLogin, setBackDropToggle} = useContext(ApiContext)
    useEffect(() => {
        for (const key in props.userData) {
                if (props.formValues.hasOwnProperty(key)) {
                    props.formValues[key] = props.userData[key]
                }
        }
        props.formValues.mobiles = props.userData.mobiles
    }, []);



    useEffect(() => {
    },[props.formValues.dob])
    const Item = styled(Paper)(({theme}) => ({
        backgroundColor: 'transparent',
        boxShadow: 'none',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        flexGrow: 1,
    }));
    const [selectedOption, setSelectedOption] = useState('');
    const [dropDownDataCategory, setDropDownDataCategory] = useState([]);
    const [ReligionData, setReligionData] = useState([]);
    const [GenderData, setGenderData] = useState([]);
    const [selectedLanguages, setSelectedLanguages] = useState(isValuePresent(props.formValues.languages) ? props.formValues.languages : []);
    const [customSelectedLanguages, setCustomSelectedLanguages] = useState([]);
    const [langDrawer, setLangDrawer] = useState(false);
    const [eminentAge, setEminentAge] = useState(props.formValues.dob)
    const [userPhoto, setUserPhoto] = useState(props.formValues.photo)

    useEffect(() => {
        setEminentAge(props.formValues.dob)
    },[props.formValues.dob])

    useEffect(() => {
        setUserPhoto(props.formValues.photo)
    }, [props.formValues.photo])

    useEffect(() => {
        setSelectedLanguages(props.formValues.languages)
    }, [props.formValues.languages]);

    const selectChange = (e) => {
        setSelectedOption(e.target.value);
    };
    useEffect(() => {
        getCategory()
        getReligion()
        getGenders()
    }, [])

    useEffect(() => {
        if (props?.stepDataFlag) {
            props.setStepData(props.formValues);
        }
    }, [props.stepDataFlag]);
    const getCategory = () => {
        getStepCtgry(config).then(
            (res) => {
                setDropDownDataCategory(res.data.data)
            }
        )
    }

    const getReligion = () => {
        getReligionData(config).then((response) => {
            setReligionData(response.data.data)
        })
    }
    const getGenders = () => {
        getGenderData(config    ).then((response) => {
            setGenderData(response.data.data)
        })
    }

    const saveProgress = () => {
        const fieldsWithValues = formFilledValues(props.formValues);
        getFormData(fieldsWithValues, props.activeStep + 1, config, true, isCandidateLogin, props.stateId).then(response => {
        });
    }


    const handleLanguageChanges = (lang) => {
        let languages = []
        if (customSelectedLanguages.includes(lang)) {
            languages = customSelectedLanguages.filter(item => item !== lang)
            setCustomSelectedLanguages(languages)
        } else {
            setCustomSelectedLanguages([...customSelectedLanguages, lang])
        }
    }

    const updatePhotoUrl = (event) => {
        setBackDropToggle(true)
        if (isValuePresent(event.target.files)) {
            getFileUpload(event.target.files[0], config, isCandidateLogin, setBackDropToggle).then(res => {
                setUserPhoto(res.data.file_path, 'res.data.file_path');
                props.formValues.photo = res.data.file_path;
            });
        }
    }

    const openLangDrawer = () => {
        setLangDrawer(!langDrawer)
        setCustomSelectedLanguages(selectedLanguages)
    }

    const saveLanguages = () => {
        setLangDrawer(false)
        setSelectedLanguages(customSelectedLanguages)
        props.formValues.languages = customSelectedLanguages
    }

    const removeLanguage = (selLang) => {
        let languages = selectedLanguages.filter(item => item !== selLang)
        setCustomSelectedLanguages(languages)
        setSelectedLanguages(languages)
        props.formValues.languages = languages
    }

    const handleDateChange = (event)    => {
        if (event.$d === null) return;
        setEminentAge(dateFormat(event.$d, 'yyyy-mm-dd'))
        props.formValues.dob = dateFormat(event.$d, 'yyyy-mm-dd')
    }

    const maxDate = () => {
        const today = new Date ()
        const date = new Date(today.getFullYear() -18 , today.getMonth(), today.getDate())
        return  dayjs(date)
    }

    return (
        <>
            <Box sx={{flexGrow: 1}}>
                <Stack className="mb-4" direction="row" useFlexGap flexWrap="wrap">
                    <Item><Formheading number="1" heading="Personal Details"/></Item>
                    <Item sx={{textAlign: 'right'}}>
                        <div onClick={saveProgress}>
                            {saveProgressButton}
                        </div>
                    </Item>
                </Stack>
                <Grid className='detailFrom' container spacing={2}>
                    <Grid item xs={8}>
                        <Grid className="grid-wrap" container spacing={2} sx={{mb: 5}}>
                            <Grid item xs={12}>
                                <FormLabel>Name <mark>*</mark></FormLabel>
                                <Inputfield type="text" name="name" placeholder="Enter Name"
                                            value={props.formValues.name} onKeyPress={(e) => {
                                    const key = e.key;
                                    if (!/^[A-Za-z\s]+$/.test(key)) {
                                        e.preventDefault();
                                    }
                                }}/>
                                <ErrorMessage name="name" component="div"/>
                            </Grid>
                            <Grid item xs={6}>
                                <FormLabel>Religion <mark>*</mark></FormLabel>
                                <SelectField name="religion" selectedvalues={selectedOption}
                                             value={props.formValues.religion}
                                             handleSelectChange={selectChange}
                                             defaultOption="Select Religion"
                                             optionList={ReligionData}
                                />
                                <ErrorMessage name="religion" component="div"/>
                            </Grid>
                            <Grid item xs={6}>
                                <FormLabel>Gender <mark>*</mark></FormLabel>
                                <SelectField name="gender" selectedvalues={selectedOption}
                                             value={props.formValues.gender}
                                             defaultOption="Select Gender"
                                             handleSelectChange={selectChange}
                                             optionList={GenderData}/>
                                <ErrorMessage name="gender" component="div"/>
                            </Grid>
                            <Grid item xs={6}>
                                <FormLabel>Category <mark>*</mark></FormLabel>
                                <SelectField name="category" selectedvalues={selectedOption}
                                             value={props.formValues.category}
                                             defaultOption="Select Category"
                                             handleSelectChange={selectChange}
                                             optionList={dropDownDataCategory}/>
                                <ErrorMessage name="category" component="div"/>
                            </Grid>
                            <Grid item xs={6}>
                                <FormLabel>Caste <mark>*</mark></FormLabel>
                                <Inputfield type="text" name="caste" value={props.formValues.caste} Z
                                            placeholder="Enter Caste" onKeyPress={(e) => {
                                    const key = e.key;
                                    if (!/^[A-Za-z]+$/.test(key)) {
                                        e.preventDefault();
                                    }
                                }}/>
                                <ErrorMessage name="caste" component="div"/>
                            </Grid>
                            <Grid item xs={6} className="mb-md-0">
                                <FormLabel>Sub Caste</FormLabel>
                                <Inputfield type="text" name="sub_caste" value={props.formValues.sub_caste} placeholder="Enter Sub Caste"
                                            onKeyPress={(e) => {
                                                const key = e.key;
                                                if (!/^[A-Za-z]+$/.test(key)) {
                                                    e.preventDefault();
                                                }
                                            }}/>
                                <ErrorMessage name="sub_caste" component="div"/>
                            </Grid>
                            <Grid item xs={6} className="mb-md-0">
                                <FormLabel>Date of birth <mark>*</mark></FormLabel>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DatePicker']}>
                                        <DatePicker
                                            maxDate={maxDate()}
                                            onChange={handleDateChange}
                                            className='report-date-picker-container'
                                            value={dobFormat(props.formValues.dob)}
                                            slotProps={{
                                                textField: {
                                                    readOnly: true,
                                                },
                                            }}
                                            format="DD/MM/YYYY"
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                                <Typography><Age alt='age'/> {eminentAge ? `${calculateAge(dobFormat(eminentAge))} Years` : ''}</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <FormLabel>Languages known <mark>*</mark></FormLabel>
                                <ErrorMessage name="languages" component="div" className="error"/>
                                <div className="language-container" onClick={() => openLangDrawer()}>
                                    <span>Select Languages</span>
                                    <span
                                        className={`arrow-down-icon ${langDrawer ? 'rotate-180' : ''}`}><FontAwesomeIcon
                                        icon={faChevronDown}/></span>
                                </div>
                                {!langDrawer && selectedLanguages.length > 0 ?
                                    <div className='selected-languages'>
                                        {selectedLanguages.map((selLang) => (
                                            <div className='selected-lang'>
                                                <span>{selLang}</span>
                                                <span onClick={() => removeLanguage(selLang)}><FontAwesomeIcon
                                                    icon={faTimes}/>
                                            </span>
                                            </div>
                                        ))}
                                    </div> : ''
                                }

                                {langDrawer &&
                                    <div className='language-selection-container'>
                                        <div className='languages-list'>
                                            {languagesName && languagesName.map((lang) => (
                                                <div className='language' onClick={() => handleLanguageChanges(lang)}>
                                                    <span>{lang}</span> <span><input className='lang-input-box'
                                                                                     type='checkbox'
                                                                                     checked={customSelectedLanguages.includes(lang)}/></span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className='language-selected-buttons'>
                                            <span className='lang-btn' onClick={openLangDrawer}>Cancel</span>
                                            <span className='lang-btn save-btn' onClick={saveLanguages}>Save</span>
                                        </div>
                                    </div>
                                }
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{mb: 5}}>
                            <Grid item xs={12}>
                                <Formheading number="2" heading="ID Proof"/>
                            </Grid>
                            <Grid item xs={6} className='d-grid'>
                                <FormLabel>Aadhaar No. (optional)</FormLabel>
                                <NumberField
                                    name="aadhaar"
                                    value={props.formValues.aadhaar}
                                    placeholder='Enter Aadhaar number'
                                    onInput={(event) => {
                                        event.target.value = event.target.value.replace(/\D/g, '').slice(0, 12);

                                    }}
                                />
                                <ErrorMessage name="aadhaar" component="div"/>

                            </Grid>
                            <Grid item xs={6} className='d-grid'>
                                <FormLabel>Voter Id. (optional)</FormLabel>
                                <Field
                                    value={props.formValues.voter_id}
                                    type="text"
                                    id="voter_id"
                                    name="voter_id"
                                    placeholder="XXYYZZ1234"
                                    as={TextField}
                                />
                                <ErrorMessage name="voter_id" component="div" className="error"/>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={4}>
                        <div className='image-container'>
                            <div className="user-photo-container" >
                                {isValuePresent(userPhoto) ?
                                    <img className="user-image" src={userPhoto} alt='eminent-profile'/>
                                    :  <UserIcon className="mt-2rem" />
                                }
                            </div>
                        </div>
                        <div className='photo-btn'>
                            <Button component="label" variant="contained" startIcon={<PhotoCameraIcon />} onChange={updatePhotoUrl} className="user-upload-photo" >
                                Add Photo
                                <VisuallyHiddenInput accept="image/*"  type="file"/>
                            </Button>
                        </div>

                        <div className="photo-error-container">
                            <p className='photo-error'>This field is mandatory <mark>*</mark></p>
                        </div>
                    </Grid>
                </Grid>

            </Box>
        </>

    );
}
PersonalDetails.label = "Personal Details"
PersonalDetails.initialValues = {
    name: "",
    mobiles: [],
    religion: "",
    gender: "",
    category: "",
    caste: "",
    sub_caste: "",
    dob: "",
    photo: "",
    languages: [],
    aadhaar: '',
    voter_id: "",
    id: "",
};
PersonalDetails.validationSchema = Yup.object().shape({
    name: Yup.string().required('Please enter your first name'),
    religion: Yup.string().required('Please select your Religion'),
    gender: Yup.string().required('Please select your Gender'),
    category: Yup.string().required('Please select your Category'),
    caste: Yup.string().required('Please Enter your Caste'),
    // dob: Yup.string().required('Please select your Date Of Birth'),
    aadhaar: Yup.string().matches(/^\d{12}$/, 'Aadhaar must be a 12-digit number'),
    voter_id: Yup.string().matches(/^[A-Za-z]{3}\d{7}$/, 'Voter ID format is not valid. It should start with 3 letters followed by 7 digits'),
    languages: Yup.array().of(Yup.string().min(1)).required(' languages minimum item should be of 1 count.'),
    photo:Yup.string().required('Please select your Photo'),
});
export default PersonalDetails;
