import React, {useCallback, useContext, useEffect, useState} from "react"
import {Box, Grid, Paper} from '@mui/material';
import {Form, Formik} from 'formik';
import {styled} from '@mui/material/styles';
import '../eminentforms/allfroms.scss'
import {getFormData} from "../../../api/stepperApiEndpoints/stepperapiendpoints";
import FormStepper from "../component/stepper/stepper";
import PersonalDetails from "../eminentforms/personaldetails";
import Communicationform from "../eminentforms/communication";
import Educationform from "../eminentforms/educationandprofession";
import PolticalandGovrnform from "../eminentforms/politicalandgovernmant";
import Resumeform from "../eminentforms/resume";
import Refferedform from "../eminentforms/reffer";
import {electionWiseJson, isValuePresent, showErrorToast, showNotification, toSnakeCase} from "../../utils";
import {ApiContext} from "../../ApiContext";
import {useNavigate} from "react-router-dom";

// newSteps=[PersonalDetails]
const FormWrap = ({userData, stateId, viewMode}) => {
    const {config, isCandidateLogin, setAuthToken, setBackDropToggle, setEminentData} = useContext(ApiContext)
    const Item = styled(Paper)(({theme}) => ({
        backgroundColor: 'transparent',
        boxShadow: 'none',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        flexGrow: 1,
    }));
    const navigate = useNavigate();
    const [steps, setSteps] = useState([PersonalDetails, Communicationform, Educationform, PolticalandGovrnform, Resumeform, Refferedform])
    const [isViewDisabled, setIsViewDisabled] = useState(false)

    useEffect(() => {
        if (viewMode === 'view') {
            setIsViewDisabled(true)
        }
    }, [viewMode])

    useEffect(() => {
        if (isValuePresent(isCandidateLogin)) {
            const updatedSteps = steps.filter(step => step.label !== 'Referred By');
            setSteps(updatedSteps)
        }
    }, []);


    const [stepValues, setStepValues] = useState([])
    const [activeStep, setActiveStep] = useState(0);

    const isLastStep = () => {
        return activeStep === steps.length - 1;
    };
    const handlePrev = () => {
        setActiveStep(Math.max(activeStep - 1, 0));
    };
    const handleNext = () => {
        setActiveStep(Math.min(activeStep + 1, steps.length - 1));

    };

    const handleStep = useCallback((step) => {
        setActiveStep(step);
    }, []);

    function mergeObjectsUpToIndex(arr, index) {
        if (index < 0 || index >= arr.length) {
            return
        }

        return arr.slice(0, index + 1).reduce((acc, obj) => {
            return {...acc, ...obj};
        }, {});
    }


    const onSubmit = (values, formikBag) => {
        const {setSubmitting} = formikBag;
        if (!isViewDisabled) {
            setBackDropToggle(true)
            const newStepValues = [...stepValues];
            newStepValues[activeStep] = values;
            setStepValues(newStepValues)
            const activeStepData = mergeObjectsUpToIndex(newStepValues, activeStep);
            setSubmitting(false);
            let isError = false
            if (activeStep + 1 === 3) {
                const fieldsToValidate = ['educations', 'professions'];
                isError = validateFields(activeStepData, fieldsToValidate);
            }
            if (activeStep + 1 === 4) {
                if (activeStepData.election_contested) {
                    isError = checkValidationsElectoral(activeStepData.election_fought)
                }
            }
            if (!isError) {
                getFormData(activeStepData, activeStep + 1, config, false, isCandidateLogin, stateId, setBackDropToggle).then(response => {
                    if (response) {
                        if (isCandidateLogin) {
                            if (activeStep + 1 === 5) {
                                values = {}
                                setEminentData({})
                                navigate({
                                    pathname: '/form_submitted'
                                });
                            }
                        } else if (activeStep + 1 === 6) {
                            values = {}
                            setEminentData({})
                            navigate({
                                pathname: '/form_submitted'
                            });
                        }
                        handleNext();
                        scrollToTop()
                    }
                });
            } else {
                setBackDropFalse()
            }
        } else {
            setSubmitting(false)
            handleNext();
            scrollToTop()
            if (isCandidateLogin) {
                if (activeStep + 1 === 5) {
                    values = {}
                    setEminentData({})
                    navigate({
                        pathname: '/'
                    });
                    localStorage.setItem('auth_token', '')
                    localStorage.setItem('eminent_number', '')
                    localStorage.setItem('view_mode', '')
                    setAuthToken('')
                    setEminentData({})
                }
            } else if (activeStep + 1 === 6) {
                values = {}
                setEminentData({})
                navigate({
                    pathname: '/'
                });
            }
        }
    };

    const initialValues = steps.reduce(
        (values, {initialValues}) => ({
            ...values,
            ...initialValues,
        }),
        {}
    );


    const ActiveStep = steps[activeStep];
    const validationSchema = ActiveStep.validationSchema;

    const validateFields = (stepData, fields) => {
        let isError = false;

        fields.forEach(field => {
            const data = stepData[field];
            if (!isError) {
                if (requiredFieldError(data, field)) {
                    isError = true;
                }
            }
        });

        return isError;
    };

    const requiredFieldError = (data, fieldName) => {
        if (!isValuePresent(data)) {
            showErrorToast(`Please enter minimum 1 ${fieldName} details`);
            return true;
        }
        return false;
    };

    const checkValidationsElectoral = (electoralDetails) => {
        let isError = false;
        if (isValuePresent(electoralDetails)) {
            for (const item in electoralDetails) {
                if (!isError) {
                    if (isValuePresent(electoralDetails[item].election_type || electoralDetails[item].election_type === false)) {
                        if (isValuePresent(electoralDetails[item].election_details)) {
                            const fields = electionWiseJson[toSnakeCase(electoralDetails[item].election_type)].fields
                            const ministriesKey = ['designation', 'ministry_name', 'ministry_duration']
                            for (const index in fields) {
                                if (ministriesKey.includes(fields[index].key)) {
                                    if (electoralDetails[item].election_details.minister_portfolio === 'Yes') {
                                        const portfolio = electoralDetails[item].election_details.minister_portfolio_array
                                        for (const pI in portfolio) {
                                            if (!isValuePresent(portfolio[pI][fields[index].key])) {
                                                isError = true
                                                showErrorToast(`Please fill ${fields[index].name} Details`);
                                            }

                                            if (!isError) {
                                                if (fields[index].hasOwnProperty('combo_fields')) {
                                                    if (!isValuePresent(portfolio[pI][fields[index].combo_fields[0].key])) {
                                                        showErrorToast(`Please fill ${fields[index].combo_fields[0].name} Details`);
                                                        isError = true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    if (!isValuePresent(electoralDetails[item].election_details[fields[index].key])) {
                                        if (!isError) {
                                            if (isValuePresent(electoralDetails[item].election_details[fields[index].condition_key])) {
                                                if (electoralDetails[item].election_details[fields[index]?.condition_key] === 'Yes') {
                                                    showErrorToast(`Please fill ${fields[index].name} Details`);
                                                    isError = true
                                                } else {
                                                    isError = false
                                                }
                                            } else if (fields[index].hasOwnProperty('condition_key')) {
                                                if (!isValuePresent(electoralDetails[item].election_details[fields[index].condition_key])) {
                                                    isError = false
                                                } else {
                                                    showErrorToast(`Please fill ${fields[index].name} Details`);
                                                }
                                            } else {
                                                showErrorToast(`Please fill ${fields[index].name} Details`);
                                                isError = true
                                            }
                                        }
                                    } else if (fields[index].hasOwnProperty('combo_fields') && !isValuePresent(electoralDetails[item].election_details[fields[index].combo_fields[0].key])) {
                                        showErrorToast(`Please fill ${fields[index].combo_fields[0].name} Details`);
                                        isError = true
                                    }
                                }

                            }
                        } else {
                            showErrorToast(`Please fill election Details`);
                            isError = true;
                        }
                    } else {
                        showErrorToast(`Please select election type`);
                        isError = true;
                    }
                }
            }
        } else {
            showErrorToast(`Please select election type`);
            isError = true;
        }
        return isError
    }


    const setBackDropFalse = () => {
        setBackDropToggle(false)
    }

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // Optional: Add smooth scrolling animation
        });
    };


    return (
        <>
            <Box sx={{flexGrow: 1}}>
                <Grid className='detailFrom' container spacing={2}>
                    <Grid item xs={12}>
                        <Formik
                            initialValues={initialValues}
                            onSubmit={onSubmit}
                            validationSchema={isViewDisabled ? null : validationSchema}
                        >
                            {({isSubmitting, handleSaveClick, touched, values, handleChange, setFieldValue}) => (
                                <Form>
                                    <FormStepper
                                        stateId={stateId}
                                        userData={userData}
                                        viewMode={viewMode}
                                        activeStep={activeStep}
                                        handlePrev={handlePrev}
                                        handleNext={handleNext}
                                        isSubmitting={isSubmitting}
                                        isLastStep={isLastStep}
                                        steps={steps}
                                        values={values}
                                        touched={touched}
                                        handleStep={handleStep}
                                        onChange={handleChange}
                                        setFieldValue={setFieldValue}

                                    />

                                </Form>
                            )}
                        </Formik>
                    </Grid>
                </Grid>
            </Box>

        </>

    )
}
export default FormWrap;