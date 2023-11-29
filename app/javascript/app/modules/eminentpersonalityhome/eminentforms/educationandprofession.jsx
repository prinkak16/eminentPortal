import {Typography, Stack, Box, Paper, Grid, FormLabel, TextField, Button, Popper, Fade} from '@mui/material';
import React, {useContext, useEffect, useState, useRef} from 'react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import {styled} from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Formheading from "../component/formheading/formheading";
import {v4 as uuidv4} from 'uuid';
import ComponentOfFields from './componentOfFields'
import {
    getEducationData,
    getFormData,
} from "../../../api/stepperApiEndpoints/stepperapiendpoints";
import * as Yup from "yup";

import MoreVertIcon from '@mui/icons-material/MoreVert';
import PopupState, {bindPopper, bindToggle} from "material-ui-popup-state";
import {Edit} from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    educationDetailsJson,
    ProfessionJson,
    isValuePresent,
    saveProgress,
    formFilledValues,
    saveProgressButton, showErrorToast
} from "../../utils";
import {ApiContext} from "../../ApiContext";
import AutoCompleteDropdown from "../simpleDropdown/autoCompleteDropdown";
import RadioButton from "./radioButton";

const Educationform = (props) => {
    const {config,isCandidateLogin, setBackDropToggle, backDropToggle} = useContext(ApiContext)
    const [educationEditField, setEducationEditField] = useState({})
    const [professionEditField, setProfessionEditField] = useState({})
    const [EducationData, setEducationData] = useState([])
    const [professionDetails, setProfessionDetails] = useState([]);
    const [educationDetails, setEducationDetails] = useState([]);
    const [educationsList, setEducationsList] = useState([]);
    const [professionDescription, setProfessionDescription] = useState(props?.formValues?.profession_description);
    const [educationLevel, setEducationLevel] = useState(props?.formValues?.education_level);
    const [showList, setShowList] = useState()
    const componentRef = useRef(null);

    useEffect(() => {
        const educations = props.formValues.educations
        if (educations.length > 0) {
            let Objects = []
            for (let i = 0; i < educations.length; i++) {
                Objects.push({id: uuidv4(),number: educations[i]})
            }
            setEducationDetails(Objects)
        }
    }, [])



    useEffect(() => {
        isValuePresent(props.formValues.educations) ? setEducationDetails(props.formValues.educations) : null
        isValuePresent(props.formValues.professions) ? setProfessionDetails(props.formValues.professions) : null
    }, []);

    const setHighestQualification = (id) => {
        setEducationDetails((prevFormValues) => {
            return prevFormValues.map((form) => {
                if (form.id === id) {
                    return {
                        ...form,
                        ['highest_qualification']: true,
                    };
                } else {
                    return {
                        ...form,
                        ['highest_qualification']: false,
                    };
                }
            });
        });
    };

    useEffect(() => {
        const filteredItems = EducationData.filter((item) => item === educationLevel);
        const filteredIndex = filteredItems.length > 0 ? EducationData.indexOf(filteredItems[0]) : -1;
        let filteredArray = EducationData.filter((item, index) => index <= filteredIndex);
        setEducationsList(filteredArray)
    },[educationLevel, EducationData])


    const Item = styled(Paper)(({theme}) => ({
        backgroundColor: 'transparent',
        boxShadow: 'none',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        flexGrow: 1,
    }));

    const getEducation = () => {
        getEducationData.then((response) => {
            const data = response.data.data.map(item => item.name)
            setEducationData(data)
        })
    }

    useEffect(() => {
        getEducation()
    },[])

    const handleSave = ( title, formData, id) => {
        setBackDropToggle(true)
        setTimeout(function() {
            if (title === 'Education Details') {
                educationSave(formData, id)
                setEducationEditField({})
            }

            if (title === 'Profession Profile') {
                professionSave(formData, id)
                setProfessionEditField({})
            }
        }, 50)

    };

    const educationSave = (formData, id) => {
        const newFormData = {
            id: uuidv4(),
            qualification: formData.qualification,
            college: formData.college,
            course: formData.course,
            university: formData.university,
            start_year: formData.start_year,
            end_year: formData.end_year,
            highest_qualification: formData.highest_qualification,
        };


        setEducationDetails((prevData) =>
            isValuePresent(id)
                ? prevData.map((form) => (form.id === id ? { ...form, ...newFormData } : form))
                : [...prevData, newFormData]
        );
        setBackDropToggle(false)
        if (formData.highest_qualification) {
            setHighestQualification(newFormData.id)
        }
    }

    const professionSave = (formData, id) => {
        const newFormData = {
            id: uuidv4(),
            profession: formData.profession,
            position: formData.position,
            organization: formData.organization,
            start_year: formData.start_year,
            end_year: formData.end_year,
        };

        setProfessionDetails((prevData) =>
            isValuePresent(id)
                ? prevData.map((form) => (form.id === id ? { ...form, ...newFormData } : form))
                : [...prevData, newFormData]
        );
        setBackDropToggle(false)
    }

    useEffect(() => {
        props.formValues.educations = educationDetails;
    }, [educationDetails]);

    useEffect(() => {
        props.formValues.professions = professionDetails;
    }, [professionDetails]);

    const editEducationForm = (type,id) => {
        setShowList('')
        if (type === 'education') {
            setEducationEditField({})
            const form = educationDetails.find((item) => item.id === id);
            if (form) {
                setEducationEditField(form)
            }
        } else {
            setProfessionEditField({})
            const form = professionDetails.find((item) => item.id === id);
            if (form) {
                setProfessionEditField(form)
            }
        }

    };

    const saveProgress = () => {
        setBackDropToggle(true)
        const fieldsWithValues = formFilledValues(props.formValues);
        getFormData(fieldsWithValues, props.activeStep + 1, config, true, isCandidateLogin, props.stateId, setBackDropToggle).then(response => {
        });
    }


    const deleteFields = (type, id) => {
        setShowList('')
        if (type === 'education') {
            const form = educationDetails.filter((item) => item.id !== id);
            if (form) {
                setEducationDetails(form)
            }
        } else {
            const form = professionDetails.filter((item) => item.id !== id);
            if (form) {
                setProfessionDetails(form)
            }
        }
    }

    const changeProfessionDescription = (event) => {
        const inputValue = event.target.value;
        if (inputValue.length <= 500) {
            setProfessionDescription(inputValue)
            props.formValues.profession_description = inputValue
        } else {
            showErrorToast('Description can not be greater than 500 character')
        }
    }

    const openList = (id) => {
        if (showList === id) {
            setShowList(null)
        } else {
            setShowList(id)
        }
    }

    return (
        <>
            <Box sx={{flexGrow: 1}}>
                <Stack className="mb-4" direction="row" useFlexGap flexWrap="wrap">
                    <Item><Formheading number="1" heading="Education Details"/></Item>
                    <Item sx={{textAlign: 'right'}}>
                        <div onClick={saveProgress}>
                            {saveProgressButton}
                        </div>
                    </Item>
                </Stack>
                <Grid container sx={{mb: 5}}>
                </Grid>
                {educationDetails.length > 0 && (
                    <div className="data-table">
                        <table className="w-100 table-responsive text-center">
                            <thead>
                            <tr>
                                <th>Qualification</th>
                                <th>Course/Branch/Subject</th>
                                <th>University/Board Name</th>
                                <th>College/ School Name</th>
                                <th>Start Year</th>
                                <th>End Year</th>
                            </tr>
                            </thead>
                            <tbody>
                            {educationDetails.map((data, index) => (
                                <tr>
                                    <td>
                                        <div className='qualification-name'>
                                            <span className='highest-qualification-radio'>
                                               <input type='radio' checked={data.highest_qualification}
                                                       onClick={(e) => setHighestQualification(data.id)}/>
                                             </span>
                                            {data.qualification}
                                        </div>
                                    </td>
                                    <td>{data.course}</td>
                                    <td>{data.university}</td>
                                    <td>{data.college}</td>
                                    <td>{data.start_year}</td>
                                    <td className='end-date-td'>{data.end_year}
                                        <div className='edit-button-logo' ref={componentRef}>
                                            <Button onClick={() => openList(data.id)} className="bg-transparent text-black display-contents">
                                                <MoreVertIcon/>
                                            </Button>
                                            {showList === data.id && (
                                                <Paper className='details-edit-list'>
                                                    <Typography className='edit-buttons' sx={{p: 2}}
                                                                onClick={() => editEducationForm('education', data.id)}><Edit/>Edit</Typography>
                                                    <Typography
                                                        className='edit-buttons'
                                                        onClick={() => deleteFields('education', data.id)}
                                                        sx={{p: 2}}><DeleteIcon/>Delete</Typography>
                                                </Paper>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {!backDropToggle &&
                    <ComponentOfFields jsonForm={educationDetailsJson} saveData={handleSave}
                                       isEditable={educationEditField} educationsList={EducationData}/>
                }

                <Grid item sx={{mb: 2}} xs={12} className='mt-4'>
                    <Typography variant="h5" content="h5">
                        <Box className="detailnumbers" component="div"
                             sx={{display: 'inline-block'}}>2</Box> Professional Profile
                    </Typography>
                </Grid>
                {professionDetails.length > 0 && (
                    <div className="data-table mt-5">
                        <table className="w-100 table-responsive text-center">
                            <thead>
                            <tr>
                                <th>Profession</th>
                                <th>Position</th>
                                <th>Organization Name</th>
                                <th>Start Year</th>
                                <th>End Year</th>
                            </tr>
                            </thead>
                            <tbody>
                            {professionDetails.map((data, index) => (
                                <tr key={index}>
                                    <td>{data.profession}</td>
                                    <td>{data.position}</td>
                                    <td>{data.organization}</td>
                                    <td>{data.start_year}</td>
                                    <td className='end-date-td'>{data.end_year}
                                        <div className='edit-button-logo'>
                                            <Button
                                                onClick={() => openList(data.id)}
                                                className="bg-transparent text-black display-contents">
                                                <MoreVertIcon/>
                                            </Button>
                                            {showList === data.id &&
                                                (
                                                    <Paper className='details-edit-list'>
                                                        <Typography className='edit-buttons' sx={{p: 2}}
                                                                    onClick={() => editEducationForm('profession', data.id)}><Edit/>Edit</Typography>
                                                        <Typography
                                                            className='edit-buttons'
                                                            onClick={() => deleteFields('profession', data.id)}
                                                            sx={{p: 2}}><DeleteIcon/>Delete</Typography>
                                                    </Paper>
                                                )
                                            }
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {!backDropToggle &&
                    <ComponentOfFields jsonForm={ProfessionJson} saveData={handleSave}
                                       isEditable={professionEditField}/>
                }
                {/*<Grid container sx={{my: 5}} className="grid-wrap">*/}
                {/*</Grid>*/}
                <Grid container sx={{spacing: 0}} className='mt-4'>
                    <Grid item xs={8}>
                        <div className=''>
                            <FormLabel>Description<InfoOutlinedIcon/></FormLabel>
                            <TextField
                                className="profession-description"
                                fullWidth
                                name="profession_description"
                                onChange={changeProfessionDescription}
                                value={professionDescription}
                                max
                                multiline
                                minRows={2}
                                maxRows={2}
                                placeholder="Please enter your professional description only, anything related to  Sangathan not to be entered here"
                            />
                        </div>

                    </Grid>
                </Grid>

            </Box>


        </>

    )
}
Educationform.label = 'Education and Profession'
Educationform.initialValues = {
    profession_description:"",
    educations: [],
    professions: [],
};
Educationform.validationSchema = Yup.object().shape({
});
export default Educationform