import {Typography, Stack, Box, Paper, Grid, FormLabel, TextField, Button, Popper, Fade} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import {styled} from '@mui/material/styles';
import Startdatepicker from '../component/startdatepicker/startdatepicker';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Formheading from "../component/formheading/formheading";
import Savebtn from "../component/saveprogressbutton/button";
import SelectField from "../component/selectfield/selectfield";
import Inputfield from "../component/inputfield/inputfield";
import Primarybutton from '../component/primarybutton/primarybutton';
import {v4 as uuidv4} from 'uuid';
import {
    getEducationData,
    getFormData,
    getGenderData,
    getReligionData
} from "../../../api/stepperApiEndpoints/stepperapiendpoints";
import * as Yup from "yup";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PopupState, {bindPopper, bindToggle} from "material-ui-popup-state";
import {Edit} from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import AutoCompleteDropdown from "../simpleDropdown/autoCompleteDropdown";
import OtherInputField from "../component/otherFormFields/otherInputField";
import {isValuePresent} from "../../utils";

const Educationform = (props) => {
    const [selectedOption, setSelectedOption] = useState('');
    const [eduStartYearCal, setEduStartYearCal] = useState(false);
    const [eduEndYearCal, setEduEndYearCal] = useState(false);
    const [educationState, setEducationState] = useState({
        id: '',
        qualification: '',
        course: '',
        university: '',
        college: '',
        start_year: '',
        end_year: '',
    });

    const clearFormValue = () => {
        setEducationState({
            id: '',
            qualification: '',
            course: '',
            university: '',
            collage: '',
            start_year: '',
            end_year: '',
        })
    }

    const handleFieldChange = (value, name, dropDownType) => {
        setEducationState({...educationState, [dropDownType]: value});
    };

    const selectChange = (e) => {
        setSelectedOption(e.target.value);
    };
    const Item = styled(Paper)(({theme}) => ({
        backgroundColor: 'transparent',
        boxShadow: 'none',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        flexGrow: 1,
    }));
    const [EducationData, setEducationData] = useState([])
    const getEducation = () => {
        getEducationData.then((response) => {
            setEducationData(response.data.data)
        })
    }

    const handleGridClick = (type) => {
        if (type === 'e_start') {
            setEduStartYearCal(true)
        } else if (type === 'e_end') {
            setEduEndYearCal(true);
        }

    };


    useEffect(() => {
        getEducation();
    }, []);

    const [savedData, setSavedData] = useState([]);

    const handleSave = (id) => {
        const createFormData = () => {
            return {
                id: uuidv4(),
                qualification: educationState.qualification,
                college: educationState.college,
                course: educationState.course,
                university: educationState.university,
                start_year: educationState.start_year,
                end_year: educationState.end_year,
            };
        };

        if (isValuePresent(id)) {
            setSavedData((prevData) =>
                prevData.map((form) => {
                    if (form.id === id) {
                        return {
                            ...form,
                            qualification: educationState.qualification,
                            college: educationState.college, // Corrected spelling
                            course: educationState.course,
                            university: educationState.university,
                            start_year: educationState.start_year,
                            end_year: educationState.end_year,
                        };
                    }
                    return form;
                })
            );
        } else {
            const formData = createFormData();
            setSavedData((prevData) => [...prevData, formData]);
        }

        clearFormValue();
    };


    console.log(savedData)
    const [saveParty, setSaveParty] = useState(null)
    const [tableData, setTableData] = useState([]);
    const handlepartysave = () => {
        const newRow = {
            profession: saveParty.profession,
            subject: saveParty.subject,
            position: saveParty.position,
            organization: saveParty.organization,
            start_year: saveParty.start_year,
            end_year: isCurrentlyWorking ? 'Currently Working' : saveParty.end_year,
        };
        setTableData([...tableData, newRow]);
        setSaveParty(props.formValues)
    }
    const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(false);


    const handleEduStartDateChange = (date) => {
        handleFieldChange(date.$y, '', 'start_year')
        setEduStartYearCal(false);
    };
    const handleEduEndDateChange = (date) => {
        handleFieldChange(date.$y, '', 'end_year')
        setEduEndYearCal(false);
    };

    const editEducationForm = (id) => {
        const form = savedData.find((item) => item.id === id);
        if (form) {
            setEducationState({
                ...educationState,
                id: form.id,
                qualification: form.qualification,
                college: form.college,
                course: form.course,
                university: form.university,
                start_year: form.start_year,
                end_year: form.end_year
            });
        }
    };

    const educationFieldDisable = (field) => {
        let disabledFields = ['Less than 10th', '10th Pass']
        if (field === 'start_year') {
            disabledFields.push('12th Pass')
        }
        return disabledFields.includes(educationState.qualification)
    }
    return (
        <>

            <Box sx={{flexGrow: 1}}>
                <Stack className="mb-4" direction="row" useFlexGap flexWrap="wrap">
                    <Item><Formheading number="1" heading="Education Details"/></Item>
                    <Item sx={{textAlign: 'right'}}><Savebtn/></Item>
                </Stack>
                <Grid container sx={{mb: 5}}>
                    <Grid item xs={6} className='education-field pb-3'>
                        <Grid item xs={7}>
                            <FormLabel>Education Level ( Highest ) <sup>*</sup></FormLabel>
                            <SelectField name="education_level" selectedvalues={selectedOption}
                                         defaultOption="Select Highest Education"
                                         handleSelectChange={selectChange}
                                         optionList={EducationData}/>

                            <ErrorMessage name="education_level" component="div"/>
                        </Grid>
                    </Grid>
                </Grid>
                {savedData.length > 0 && (
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
                            {savedData.map((data, index) => (
                                <tr>
                                    <td>{data.qualification}</td>
                                    <td>{data.course}</td>
                                    <td>{data.university}</td>
                                    <td>{data.college}</td>
                                    <td>{data.start_year}</td>
                                    <td className='end-date-td'>{data.end_year}
                                        <PopupState variant="popper" popupId="demo-popup-popper">
                                            {(popupState) => (
                                                <div className='edit-button-logo'>
                                                    <Button
                                                        variant="contained" {...bindToggle(popupState)}
                                                        className="bg-transparent text-black display-contents">
                                                        <MoreVertIcon/>
                                                    </Button>
                                                    <Popper {...bindPopper(popupState)} transition>
                                                        {({TransitionProps}) => (
                                                            <Fade {...TransitionProps}
                                                                  timeout={350}>
                                                                <Paper>
                                                                    <Typography sx={{p: 2}}
                                                                                onClick={() => editEducationForm(data.id)}><Edit/></Typography>
                                                                    <Typography
                                                                        sx={{p: 2}}><DeleteIcon/></Typography>
                                                                </Paper>
                                                            </Fade>
                                                        )}
                                                    </Popper>
                                                </div>
                                            )}
                                        </PopupState>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <Grid container className="educationforms grid-wrap">
                    <Grid item xs={12}>
                        <Typography variant="h5" content="h5">
                            Enter your educational detail ( All )
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <FormLabel>Qualification <sup>*</sup></FormLabel>
                        <AutoCompleteDropdown
                            name={'Qualification'}
                            selectedValue={educationState.qualification}
                            listArray={['Less than 10th', '10th Pass', 'Diploma/ITI', '12th Pass', 'Graduate', 'Post Graduate', 'PhD and Above']}
                            onChangeValue={handleFieldChange}
                            dropDownType={'qualification'}/>
                        <ErrorMessage name="qualification" component="div"/>
                    </Grid>
                    <Grid item xs={4}>
                        <FormLabel>Course / Branch / Subject</FormLabel>
                        <OtherInputField
                            disabled={educationFieldDisable('course')}
                            type="text"
                            value={educationState.course}
                            onChange={handleFieldChange}
                            textType="course"
                            placeholder="Enter Course / Branch / Subject"/>
                    </Grid>
                    <Grid item xs={4}>
                        <FormLabel>University / Board <sup>*</sup></FormLabel>
                        <OtherInputField
                            type="text"
                            value={educationState.university}
                            onChange={handleFieldChange}
                            textType="university"
                            placeholder="Enter University / Board"/>
                        <ErrorMessage name="board" component="div"/>
                    </Grid>
                    <Grid item xs={4}>
                        <FormLabel>College / School <sup>*</sup></FormLabel>
                        <OtherInputField
                            type="text"
                            value={educationState.collage}
                            onChange={handleFieldChange}
                            textType="collage"
                            placeholder="Enter College / School"/>
                        <ErrorMessage name="college" component="div"/>
                    </Grid>
                    <Grid item xs={4} onClick={() => handleGridClick('e_start')}
                          disabled={educationFieldDisable('start_year')}>
                        <FormLabel fullwidth>Start Year</FormLabel>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Field name="start_year" value={educationState.start_year} placeholder="Select start year"
                                   disabled={educationFieldDisable('start_year')}>
                                {({field}) => (
                                    <DatePicker
                                        disabled={educationFieldDisable('start_year')}
                                        disbled={true}
                                        label="Select Start year"
                                        value={field.value}
                                        onChange={handleEduStartDateChange}
                                        open={eduStartYearCal}
                                        onClose={() => setEduStartYearCal(false)}
                                        views={['year']}
                                    />
                                )}
                            </Field>
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={4} onClick={() => handleGridClick('e_end')}>
                        <FormLabel>End / Passing Year</FormLabel>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Field name="end_year" value={educationState.end_year} disable={true}>
                                {({field}) => (
                                    <DatePicker
                                        label="Select end year"
                                        value={field.value}
                                        onChange={handleEduEndDateChange}
                                        open={eduEndYearCal} // Show the calendar when eduEndYearCal is true
                                        onClose={() => setEduEndYearCal(false)} // Close the calendar when it's clicked away
                                        views={['year']}
                                    />
                                )}
                            </Field>
                        </LocalizationProvider>
                    </Grid>


                    <Grid item xs={12}>
                        <Primarybutton addclass="cancelbtn cancel" buttonlabel="Cancel"/>
                        <Primarybutton addclass="nextbtn" handleclick={() => handleSave(educationState.id)}
                                       buttonlabel="Save"/>
                    </Grid>
                </Grid>
                {tableData.length > 0 && (
                    <div className="data-table">
                        <table className="w-100 table-responsive">
                            <thead>
                            <tr>
                                <th>Profession</th>
                                <th>Course/Branch/Subject</th>
                                <th>Position</th>
                                <th>Organization Name</th>
                                <th>Start Year</th>
                                <th>End Year</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {tableData.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.profession}</td>
                                    <td>{row.subject}</td>
                                    <td>{row.position}</td>
                                    <td>{row.organization}</td>
                                    <td>{row.start_year}</td>
                                    <td>{row.end_year}</td>
                                    <td>
                                        <PopupState variant="popper" popupId="demo-popup-popper">
                                            {(popupState) => (
                                                <>
                                                    <Button variant="contained" {...bindToggle(popupState)}
                                                            className="bg-transparent text-black">
                                                        <MoreVertIcon/>
                                                    </Button>
                                                    <Popper {...bindPopper(popupState)} transition>
                                                        {({TransitionProps}) => (
                                                            <Fade {...TransitionProps} timeout={350}>
                                                                <Paper>
                                                                    <Typography sx={{p: 2}}><Edit/></Typography>
                                                                    <Typography sx={{p: 2}}><DeleteIcon/></Typography>
                                                                </Paper>
                                                            </Fade>
                                                        )}
                                                    </Popper>
                                                </>
                                            )}
                                        </PopupState>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <Grid container sx={{my: 5}} className="grid-wrap">
                    <Grid item sx={{mb: 2}} xs={12}>
                        <Typography variant="h5" content="h5">
                            <Box className="detailnumbers" component="div"
                                 sx={{display: 'inline-block'}}>2</Box> Professional Profile
                        </Typography>
                    </Grid>
                    <Grid container className="educationforms">
                        <Grid item xs={4}>
                            <FormLabel>Profession <sup>*</sup></FormLabel>
                            <Inputfield type="text"
                                        name="profession"
                                        placeholder="Enter profession"/>
                            <ErrorMessage name="profession" component="div"/>
                        </Grid>
                        <Grid item xs={4}>
                            <FormLabel>Course / Branch / Subject</FormLabel>
                            <Inputfield type="text"
                                        name="subject"
                                        placeholder="Enter Course / Branch / Subject"/>
                        </Grid>
                        <Grid item xs={4}>
                            <FormLabel>Position</FormLabel>
                            <Inputfield type="text"
                                        name="position"
                                        placeholder="Enter Position"/>
                        </Grid>
                        <Grid item xs={4}>
                            <FormLabel>Organization Name</FormLabel>
                            <Inputfield type="text"
                                        name="organization"
                                        placeholder="Enter Organization Name"/>
                        </Grid>
                        <Grid item xs={4}>
                            <FormLabel fullwidth>Start Year</FormLabel><br/>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Field name="start_year1">
                                    {({field, form}) => (
                                        <DatePicker
                                            {...field} // Pass the field's props to the DatePicker
                                            value={field.value} // Set the value explicitly if needed
                                            onChange={(year) => form.setFieldValue("start_year1", year)} // Handle date changes
                                            views={['year']}
                                        />
                                    )}
                                </Field>
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={4} textend>
                            <FormLabel>End / Passing Year</FormLabel><br/>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Field name="end_year1">
                                    {({field, form}) => (
                                        <DatePicker
                                            {...field} // Pass the field's props to the DatePicker
                                            value={field.value} // Set the value explicitly if needed
                                            onChange={(year) => {
                                                if (!isCurrentlyWorking) {
                                                    formikProps.setFieldValue('end_year1', year);
                                                }
                                            }}
                                            views={['year']}
                                            disabled={isCurrentlyWorking}
                                        />
                                    )}
                                </Field>
                            </LocalizationProvider>
                            <label>
                                <Field type="checkbox" name="checked" value="One" onChange={() => {
                                    setIsCurrentlyWorking(!isCurrentlyWorking);
                                    props.setFieldValue(
                                        'end_year1',
                                        isCurrentlyWorking ? '' : 'Currently Working'
                                    );
                                }}/>
                                Currently Working
                            </label>
                            {/*<FormLabel className="checkbox align-items-center d-flex">*/}
                            {/*    <Field type="checkbox" name="checked" value="One" onChange={() => {*/}
                            {/*        setIsCurrentlyWorking(!isCurrentlyWorking);*/}
                            {/*        props.setFieldValue(*/}
                            {/*            'end_year1',*/}
                            {/*            isCurrentlyWorking ? '' : 'Currently Working'*/}
                            {/*        );*/}
                            {/*    }}/>Currently Working </FormLabel>*/}
                        </Grid>
                        <Grid item xs={12}>
                            <Primarybutton addclass="cancelbtn cancel" buttonlabel="Cancel"/>
                            <Primarybutton addclass="nextbtn" handleclick={handlepartysave} buttonlabel="Save"/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container sx={{spacing: 0}}>
                    <Grid item xs={8}>
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

            </Box>


        </>

    )
}
Educationform.label = 'Education and Profession'
Educationform.initialValues = {
    education_level: "",
    // profession: "",
    qualification: "",
    subject: "",
    college: "",
    board: "",
    school: "",
    qualification2: "",
    department: "",
    year: "",
    stream: "",
    course: "",
    university: "",
    educations: [{
        start_year: "",
        end_year: "",
    }],
    // profession: "",
    organisation: "",
    position: "",
    profession: [{
        start_year: "",
        end_year: ""
    }],


};
Educationform.validationSchema = Yup.object().shape({
    // education_level: Yup.string().required('Please select your education'),
    // qualification: Yup.string().required('Please enter your qualification'),
    // board: Yup.string().required('Please enter your board'),
    // profession: Yup.string().required('Please enter your profession'),
    // college:Yup.string().required('Please enter your college')
});
export default Educationform