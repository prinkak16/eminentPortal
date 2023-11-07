import {Typography, Stack, Box, Paper, Grid, FormLabel, TextField, Button, Popper, Fade} from '@mui/material';
import React, {useEffect, useState} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { styled } from '@mui/material/styles';
import Startdatepicker from '../component/startdatepicker/startdatepicker';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Formheading from "../component/formheading/formheading";
import Savebtn from "../component/saveprogressbutton/button";
import SelectField from "../component/selectfield/selectfield";
import Inputfield from "../component/inputfield/inputfield";
import Primarybutton from '../component/primarybutton/primarybutton';
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
const Educationform =(props)=>{
    const [selectedOption, setSelectedOption] = useState('');
    const selectChange = (e) => {
        setSelectedOption(e.target.value);
    };
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor:'transparent',
        boxShadow:'none',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        flexGrow: 1,
    }));
    const [EducationData, setEducationData]= useState([])
    const getEducation=()=>{
        getEducationData.then((response) => {
            setEducationData(response.data.data)
        })
    }
    useEffect(() => {
        getEducation();
    }, []);

    const [savedData, setSavedData] = useState(null);

    const handleSave = () => {
        // const savedValues = { ...props.formValues };
        //
        // // Convert start_year and end_year to Date objects if they exist
        // if (savedValues.education_start_year) {
        //     savedValues.start_year = new Date(savedValues.start_year);
        // }
        // if (savedValues.end_year) {
        //     savedValues.end_year = new Date(savedValues.end_year);
        // }
        setSavedData(props.formValues);
    };
    const [saveParty, setSaveParty]=useState(null)
    const [tableData, setTableData] = useState([]);
    const  handlepartysave=()=>{
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
        console.log('test', tableData)
    }
    const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(false);
    return(
        <>

                                <Box sx={{ flexGrow: 1 }}>
                                    <Stack className="mb-4" direction="row" useFlexGap flexWrap="wrap">
                                        <Item><Formheading number="1" heading="Education Details" /></Item>
                                        <Item sx={{textAlign:'right'}}><Savebtn/></Item>
                                    </Stack>
                                    <Grid container sx={{mb:5}} >
                                        <Grid item xs={6} className='education-field pb-3'>
                                            <Grid item xs={7}>
                                                <FormLabel>Education Level ( Highest ) <sup>*</sup></FormLabel>
                                                <SelectField name="education_level" selectedvalues={selectedOption}
                                                             defaultOption="Select Highest Education"
                                                             handleSelectChange={selectChange}
                                                             optionList={EducationData}/>

                                                <ErrorMessage name="education_level" component="div" />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    {savedData && (
                                                <div className="data-table">
                                                    <table className="w-100 table-responsive ">
                                                        <thead>
                                                        <tr>
                                                            <th>Qualification</th>
                                                            <th>Course/Branch/Subject</th>
                                                            <th>University/Board Name</th>
                                                            <th>College/ School Name</th>
                                                            <th>Start Year</th>
                                                            <th>End Year</th>
                                                            <th></th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {savedData.map((data, index) => (
                                                        <tr>
                                                            <td>{data.qualification}</td>
                                                            <td>{data.subject}</td>
                                                            <td>{data.university}</td>
                                                            <td>{data.college}</td>
                                                            <td>{data.start_year}</td>
                                                            <td></td>
                                                            <td>
                                                                <PopupState variant="popper" popupId="demo-popup-popper">
                                                                    {(popupState) => (
                                                                        <>
                                                                            <Button
                                                                                variant="contained" {...bindToggle(popupState)}
                                                                                className="bg-transparent text-black">
                                                                                <MoreVertIcon/>
                                                                            </Button>
                                                                            <Popper {...bindPopper(popupState)} transition>
                                                                                {({TransitionProps}) => (
                                                                                    <Fade {...TransitionProps}
                                                                                          timeout={350}>
                                                                                        <Paper>
                                                                                            <Typography sx={{p: 2}}><Edit/></Typography>
                                                                                            <Typography
                                                                                                sx={{p: 2}}><DeleteIcon/></Typography>
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
                                    <Grid container className="educationforms grid-wrap" >
                                        <Grid item xs={12}>
                                            <Typography variant="h5" content="h5">
                                                Enter your educational detail ( All )
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <FormLabel>Qualification <sup>*</sup></FormLabel>
                                            <SelectField
                                                name="qualification"
                                                defaultOption="Select Highest Qualification"
                                                optionList={EducationData}
                                            />
                                            <ErrorMessage name="qualification" component="div" />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <FormLabel>Course / Branch / Subject</FormLabel>
                                            <Inputfield type="text"
                                                        name="subject"
                                                        placeholder="Enter Course / Branch / Subject"/>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <FormLabel>University / Board <sup>*</sup></FormLabel>
                                            <Inputfield type="text"
                                                        name="board"
                                                        placeholder="Enter University / Board"/>
                                            <ErrorMessage name="board" component="div" />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <FormLabel>College / School <sup>*</sup></FormLabel>
                                            <Inputfield type="text"
                                                        name="college"
                                                        placeholder="Enter College / School"/>
                                            <ErrorMessage name="college" component="div" />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <FormLabel fullwidth>Start Year</FormLabel>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <Field name="start_year">
                                                    {({ field, form }) => (
                                                        <DatePicker
                                                            {...field}
                                                            value={field.value} // Use field.value to get the current value
                                                            onChange={(year) => form.setFieldValue("start_year", year)} // Update the value
                                                            views={['year']}
                                                        />
                                                        )}
                                                </Field>
                                            </LocalizationProvider>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <FormLabel>End / Passing Year</FormLabel>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <Field name="education_end_year">
                                                    {({ field, form }) => (
                                                        <DatePicker
                                                            {...field}
                                                            value={field.value} // Use field.value to get the current value
                                                            onChange={(year) => form.setFieldValue("education_end_year", year)} // Update the value
                                                            views={['year']}
                                                        />
                                                    )}
                                                </Field>
                                            </LocalizationProvider>
                                        </Grid>


                                        <Grid item xs={12}>
                                            <Primarybutton addclass="cancelbtn cancel" buttonlabel="Cancel"/>
                                            <Primarybutton addclass="nextbtn" handleclick={handleSave} buttonlabel="Save"/>
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
                                                                        <Button variant="contained" {...bindToggle(popupState)} className="bg-transparent text-black">
                                                                            <MoreVertIcon/>
                                                                        </Button>
                                                                        <Popper {...bindPopper(popupState)} transition>
                                                                            {({ TransitionProps }) => (
                                                                                <Fade {...TransitionProps} timeout={350}>
                                                                                    <Paper>
                                                                                        <Typography sx={{ p: 2 }}><Edit/></Typography>
                                                                                        <Typography sx={{ p: 2 }}><DeleteIcon/></Typography>
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
                                    <Grid container sx={{my:5}} className="grid-wrap">
                                        <Grid item sx={{mb:2}} xs={12}>
                                            <Typography variant="h5" content="h5">
                                                <Box className="detailnumbers" component="div" sx={{ display: 'inline-block' }}>2</Box> Professional Profile
                                            </Typography>
                                        </Grid>
                                        <Grid container className="educationforms">
                                            <Grid item xs={4}>
                                                <FormLabel>Profession <sup>*</sup></FormLabel>
                                                <Inputfield type="text"
                                                            name="profession"
                                                            placeholder="Enter profession"/>
                                                <ErrorMessage name="profession" component="div" />
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
                                                <FormLabel  fullwidth>Start Year</FormLabel><br/>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <Field name="start_year1">
                                                        {({ field, form }) => (
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
                                                        {({ field, form }) => (
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
                                                    <Field type="checkbox" name="checked" value="One"  onChange={() => {
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
                                    <Grid container sx={{spacing:0}}>
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
    education_level:"",
    // profession: "",
    qualification: "",
    subject: "",
    college: "",
    board: "",
    school: "",
    qualification2:"",
    department:"",
    year:"",
    stream:"",
    course:"",
    university:"",
    educations:[{
            start_year:"",
            end_year:"",
    }],
        // profession: "",
        organisation:"",
        position:"",
    profession:[{
        start_year:"",
        end_year:""
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