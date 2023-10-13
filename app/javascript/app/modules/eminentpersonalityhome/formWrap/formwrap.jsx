import React, {useCallback, useEffect, useState} from "react"
import {Box, Paper, Grid, FormLabel} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { styled } from '@mui/material/styles';
import '../eminentforms/allfroms.scss'
import {getFormData} from "../../../api/stepperApiEndpoints/stepperapiendpoints";
import FormStepper from "../component/stepper/stepper";
import PersonalDetails from "../eminentforms/personaldetails";
import Communicationform from "../eminentforms/communication";
import Educationform from "../eminentforms/educationandprofession";
import PolticalandGovrnform from "../eminentforms/politicalandgovernmant";
import Resumeform from "../eminentforms/resume";
import Refferedform from "../eminentforms/reffer";
steps=[PersonalDetails, Communicationform, Educationform,PolticalandGovrnform, Resumeform, Refferedform]
newSteps=[PersonalDetails]
const FormWrap=(props)=>{

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor:'transparent',
        boxShadow:'none',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        flexGrow: 1,
    }));
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
        console.log("test")
    }, []);
    const onSubmit = (values, formikBag) => {
        const { setSubmitting } = formikBag;
        if (!isLastStep()) {
            setSubmitting(false);
            handleNext();
            return;
        }

        // console.log(values);

        setTimeout(() => {
            setSubmitting(false);
            getFormData().then(response => {
                console.log('API response:', response.data);
                // resetForm({ values: '' }); // Reset the form after successful submission
                // setCurrentStep(0); //
            });
        }, 1000);

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
                            {({isSubmitting, touched, values})=>(
                                <Form>
                                    <FormStepper
                                        activeStep={activeStep}
                                        handlePrev={handlePrev}
                                        handleNext={handleNext}
                                        isSubmitting={isSubmitting}
                                        isLastStep={isLastStep}
                                        steps={steps}
                                        values={values}
                                        touched={touched}
                                        handleStep={handleStep}
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