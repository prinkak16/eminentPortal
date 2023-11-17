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
import {isValuePresent, showErrorToast} from "../../utils";
import {ApiContext} from "../../ApiContext";

// newSteps=[PersonalDetails]
const FormWrap=({userData})=>{
    const {config, isCandidateLogin} = useContext(ApiContext)
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor:'transparent',
        boxShadow:'none',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        flexGrow: 1,
    }));

    const [steps, setSteps] = useState([PersonalDetails, Communicationform, Educationform, PolticalandGovrnform, Resumeform, Refferedform])

    useEffect(() => {
        if (isValuePresent(isCandidateLogin)) {
            const updatedSteps = steps.filter(step => step.label !== 'Referred By');
                  setSteps(updatedSteps)
        }
    }, []);

    const [stepValues, setStepValues]=useState([])
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
            return { ...acc, ...obj };
        }, {});
    }


    const onSubmit = (values, formikBag) => {
        const {setSubmitting} = formikBag;
        const newStepValues = [...stepValues];
        newStepValues[activeStep] = values;
        setStepValues(newStepValues)
        const activeStepData = mergeObjectsUpToIndex(newStepValues, activeStep);
        setSubmitting(false);
        let isError = false
        if (activeStep + 1 === 4) {
            const fieldsToValidate = ['educations', 'professions'];
            isError = validateFields(activeStepData, fieldsToValidate);
        }

        if (activeStep + 1 === 4) {
            if (activeStepData.election_contested) {

            }
        }
        if (!isError) {
            getFormData(activeStepData, activeStep + 1, config, false, isCandidateLogin).then(response => {
                if (response) {
                    handleNext();
                }
            });
        }
    };

    const initialValues = steps.reduce(
        (values, { initialValues }) => ({
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

    return(
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Grid className='detailFrom' container spacing={2}>
                    <Grid item xs={12}>
                        <Formik
                            initialValues={initialValues}
                            onSubmit={onSubmit}
                            validationSchema={validationSchema}
                        >
                            {({isSubmitting, handleSaveClick, touched, values, handleChange, setFieldValue})=>(
                                <Form>
                                    <FormStepper
                                        userData={userData}
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