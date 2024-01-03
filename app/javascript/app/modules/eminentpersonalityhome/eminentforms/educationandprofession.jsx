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
    getFormData, getProfessionData,
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
    saveProgressButton, showErrorToast, disabledSaveProgressButton, isMobileUser
} from "../../utils";
import {ApiContext} from "../../ApiContext";
import AutoCompleteDropdown from "../simpleDropdown/autoCompleteDropdown";
import RadioButton from "./radioButton";
import ComponentFieldDetails from "./componentFieldDetails";
import Primarybutton from "../component/primarybutton/primarybutton";
import AddIcon from "@mui/icons-material/Add";

const Educationform = (props) => {
    const {config,isCandidateLogin, setBackDropToggle, backDropToggle} = useContext(ApiContext)
    const [educationEditField, setEducationEditField] = useState({})
    const [professionEditField, setProfessionEditField] = useState({})
    const [EducationData, setEducationData] = useState([])
    const [professionData, setProfessionData] = useState([])
    const [professionDetails, setProfessionDetails] = useState([]);
    const [educationDetails, setEducationDetails] = useState([]);
    const [professionDescription, setProfessionDescription] = useState(props?.formValues?.profession_description);
    const [showList, setShowList] = useState()
    const [isViewDisabled, setIsViewDisabled] = useState(false)
    const [showEducationForm, setShowEducationForm] = useState(props.formValues.educations.length === 0)
    const [showProfessionForm, setShowProfessionForm] = useState(props.formValues.professions.length === 0)

    useEffect(() => {
        if (props.viewMode === 'view') {
            setIsViewDisabled(true)
        }

    },[props.viewMode])


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (event.target.id !== 'list-container' && event.target.id !== 'list-icon-button' && event.target.id !== 'list-icon') {
                setShowList(null)
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

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

    const setMainProfession = (id) => {
        setProfessionDetails((prevFormValues) => {
            return prevFormValues.map((form) => {
                if (form.id === id) {
                    return {
                        ...form,
                        ['main_profession']: true,
                    };
                } else {
                    return {
                        ...form,
                        ['main_profession']: false,
                    };
                }
            });
        });
    };

    const setCurrentWorking = (id) => {
        setProfessionDetails((prevFormValues) => {
            return prevFormValues.map((form) => {
                if (form.id === id) {
                    return {
                        ...form,
                        ['end_year']: 'Current Working',
                    };
                } else {
                    return {
                        ...form,
                        ['end_year']: '',
                    };
                }
            });
        });
    }


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

      const getProfession = () => {
        getProfessionData.then((response) => {
            const data = response.data.data.map(item => item.name)
            setProfessionData(data)
        })
    }

    useEffect(() => {
        getEducation()
        getProfession()
    },[])

    const handleSave = ( title, formData, id) => {
        setTimeout(function() {
            if (title === 'Education Details') {
                setShowEducationForm(false)
                educationSave(formData, id)
                setEducationEditField({})
            }

            if (title === 'Profession Profile') {
                setShowProfessionForm(false)
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
            course: isValuePresent(formData.course) ? formData.course : '-',
            university: formData.university,
            start_year: isValuePresent(formData.start_year) ? formData.start_year : '-',
            end_year: isValuePresent(formData.end_year) ? formData.end_year : '-',
            highest_qualification: formData.highest_qualification,
        };


        setEducationDetails((prevData) =>
            isValuePresent(id)
                ? prevData.map((form) => (form.id === id ? { ...form, ...newFormData } : form))
                : [...prevData, newFormData]
        );
        if (formData.highest_qualification) {
            setHighestQualification(newFormData.id)
        }
        setBackDropToggle(false)
    }

    const professionSave = (formData, id) => {
        const newFormData = {
            id: uuidv4(),
            profession: formData.profession,
            position: isValuePresent(formData.position) ? formData.position : '-',
            organization: isValuePresent(formData.organization) ? formData.organization : '-',
            start_year: isValuePresent(formData.start_year) ? formData.start_year : '-',
            end_year: isValuePresent(formData.end_year) ? formData.end_year : '-',
            main_profession: isValuePresent(formData.main_profession) ? formData.main_profession : false
        };

        setProfessionDetails((prevData) =>
            isValuePresent(id)
                ? prevData.map((form) => (form.id === id ? { ...form, ...newFormData } : form))
                : [...prevData, newFormData]
        );
        if (formData.end_year === 'Current Working') {
            setCurrentWorking(newFormData.id)
        }

        if (formData.main_profession) {
            setMainProfession(newFormData.id)
        }
        setBackDropToggle(false)
    }

    useEffect(() => {
        props.formValues.educations = educationDetails;
    }, [educationDetails]);

    useEffect(() => {
        props.formValues.professions = professionDetails;
    }, [professionDetails]);

    const editForm = (type,id) => {
        showFormFields(type)
        setShowList(null)
        if (type === 'educations') {
            scrollToBottom(500)
            setEducationEditField({})
            const form = educationDetails.find((item) => item.id === id);
            if (form) {
                setEducationEditField(form)
            }
        } else {
            scrollToBottom(1300)
            setProfessionEditField({})
            const form = professionDetails.find((item) => item.id === id);
            if (form) {
                setProfessionEditField(form)
            }
        }

    };

    const saveProgress = () => {

        if (!isViewDisabled) {
            const fieldsWithValues = formFilledValues(props.formValues);
            getFormData(fieldsWithValues, props.activeStep + 1, config, true, isCandidateLogin, props.stateId, setBackDropToggle).then(response => {
            });
        }
    }


    const deleteFields = (type, id) => {
        setShowList(null)
        if (type === 'educations') {
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

    const scrollToBottom = (scroll) => {
        window.scrollTo({
            top: scroll, // Scroll to the bottom
            behavior: 'smooth', // Optional: Add smooth scrolling animation
        });
    };

    const showFormFields = (type) => {
        if (type === 'educations') {
            setShowEducationForm(true)
        }else {
            setShowProfessionForm(true)
        }
    }


    return (
        <>
            <Box sx={{flexGrow: 1}} className={`${isMobileUser ? 'edu-prof-mobile-view' : ''}`}>
                <Stack className="mb-4" direction="row" useFlexGap flexWrap="wrap">
                    <Item><Formheading number="1" heading="Education Details"/></Item>
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
                <Grid container sx={{mb: 5}}>
                </Grid>
                {isMobileUser ?
                    <> {educationDetails.length > 0 &&
                        <ComponentFieldDetails data={educationDetails} type={'educations'} disabled={isViewDisabled}
                                               openList={openList} editForm={editForm} deleteFields={deleteFields}/>
                    }
                    </>
                    :
                    <>
                        {
                            educationDetails.length > 0 && (
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
                                               <input disabled={isViewDisabled} type='radio'
                                                      checked={data.highest_qualification}
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
                                                    <div className='edit-button-logo' id='list-container'>
                                                        <Button id='list-icon-button' disabled={isViewDisabled}
                                                                onClick={() => openList(data.id)}
                                                                className="bg-transparent text-black display-contents">
                                                            <MoreVertIcon id='list-icon'/>
                                                        </Button>
                                                        {showList === data.id && (
                                                            <Paper className='details-edit-list'>
                                                                <Typography sx={{p: 2}} className='edit-buttons'
                                                                            onClick={() => editForm('educations', data.id)}><Edit/>Edit</Typography>
                                                                <Typography
                                                                    onClick={() => deleteFields('educations', data.id)}
                                                                    className='edit-buttons' sx={{p: 2}}><DeleteIcon/>Delete</Typography>
                                                            </Paper>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )
                        }
                    </>
                }

                {showEducationForm ?
                    <ComponentOfFields jsonForm={educationDetailsJson} saveData={handleSave}
                                       isEditable={educationEditField} educationsList={EducationData} isViewDisabled={isViewDisabled}/>:
                    <Grid item xs={12} className="d-flex align-items-center">
                        <div>
                            <Primarybutton addclass="addanotherfieldsbtn me-1 mb-1"
                                           starticon={<AddIcon/>}
                                           buttonlabel="Add Aducation"
                                           handleclick={() => showFormFields('educations')}
                            />
                        </div>
                    </Grid>
                }

                <Grid item sx={{mb: 2}} xs={12} className='mt-4'>
                    <Typography variant="h5" content="h5">
                        <Box className="detailnumbers" component="div"
                             sx={{display: 'inline-block'}}>2</Box> Professional Profile
                    </Typography>
                </Grid>
                {isMobileUser ?
                    <> {professionDetails.length > 0 &&
                        <ComponentFieldDetails data={professionDetails} type={'professions'} disabled={isViewDisabled}
                                               openList={openList} editForm={editForm} deleteFields={deleteFields}/>
                    }
                    </>
                    : <>
                        {
                            professionDetails.length > 0 && (
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
                                            <td>
                                                <div className='qualification-name'>
                                            <span className='highest-qualification-radio'>
                                               <input disabled={isViewDisabled} type='radio'
                                                      checked={data.main_profession}
                                                      onClick={(e) => setMainProfession(data.id)}/>
                                             </span>
                                                    {data.profession}
                                                </div>
                                            </td>
                                            <td>{data.position}</td>
                                            <td>{data.organization}</td>
                                            <td>{data.start_year}</td>
                                            <td className='end-date-td'>{data.end_year}
                                                <div className='edit-button-logo' id='list-container'>
                                                    <Button id='list-icon-button' disabled={isViewDisabled} onClick={() => openList(data.id)} className="bg-transparent text-black display-contents">
                                                        <MoreVertIcon id='list-icon'/>
                                                    </Button>
                                                    {showList === data.id && (
                                                        <Paper className='details-edit-list'>
                                                            <Typography className='edit-buttons' sx={{p: 2}} onClick={() => editForm('profession', data.id)}><Edit/>Edit</Typography>
                                                            <Typography className='edit-buttons' onClick={() => deleteFields('profession', data.id)} sx={{p: 2}}><DeleteIcon/>Delete</Typography>
                                                        </Paper>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>)
                        }
                    </>
                }

                { showProfessionForm ?
                    <ComponentOfFields jsonForm={ProfessionJson} saveData={handleSave}
                                       isEditable={professionEditField} isViewDisabled={isViewDisabled} professionList={professionData}/> :
                        <Grid item xs={12} className="d-flex align-items-center">
                            <div>
                                <Primarybutton addclass="addanotherfieldsbtn me-1 mb-1"
                                               starticon={<AddIcon/>}
                                               buttonlabel="Add Profession"
                                               handleclick={() => showFormFields('professions')}
                                />
                                {/*<Typography>( As Delhi Address, Office Address etc.)</Typography>*/}
                            </div>
                        </Grid>

                }
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
                                disabled={isViewDisabled}
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