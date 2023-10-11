import React from 'react';
import './stepper.scss'
import {
    Typography,
    Button,
    Stepper,
    Step,
    StepLabel,
    Box,
} from '@mui/material';
import PersonalDetails from "../../eminentforms/personaldetails";
import Communicationform from "../../eminentforms/communication";
import Educationform from "../../eminentforms/educationandprofession";
import PolticalandGovrnform from "../../eminentforms/politicalandgovernmant";
import Resumeform from "../../eminentforms/resume";
import Refferedform from "../../eminentforms/reffer"

const FormStepper = ({
                         activeStep,
                         handlePrev,
                         handleNext,
                         isSubmitting,
                         isLastStep,
                         steps,
                         values,
                         touched,
                         handleSubmit
                     }) => {


    return (
        <>
            <Stepper alternativeLabel activeStep={activeStep}>
                {steps.map((step, index) => (
                    <Step key={index}  sx={{
                        '& .MuiStepLabel-root .Mui-completed': {
                            color: '#FF9559',
                        },
                        '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel':
                            {
                                color: '#FF9559', // Just text label (COMPLETED)
                            },
                        '& .MuiStepLabel-root .Mui-active': {
                            color: '#FF9559', // circle color (ACTIVE)
                        },
                        '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel':
                            {
                                color: '#FF9559', // Just text label (ACTIVE)
                            },
                        '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
                            fill: '#fff', // circle's number (ACTIVE)
                        },
                        '& .MuiStepConnector-root': {
                            left: 'calc(-54% + 20px)',
                            right: 'calc(46% + 20px)',
                            zIndex: '-1',
                            height: '4px',
                        },
                        '& .MuiStepConnector-line': {
                            borderTopWidth: '4px',
                        },
                    }}>
                        <StepLabel>{steps[index].label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <div className="stepouter px-md-5 mt-5">
                {activeStep === 0 && (
                    <>
                        <PersonalDetails/>
                    </>
                )}
                {activeStep === 1 && (
                    <>
                        <Communicationform />
                    </>
                )}
                {activeStep === 2 && (
                    <>
                        <Educationform/>
                    </>
                )}
                {activeStep === 3 && (
                    <>
                        <PolticalandGovrnform/>
                    </>
                )}
                {activeStep === 4 && (
                    <>
                        <Resumeform/>
                    </>
                )}
                {activeStep === 5 && (
                    <>
                        <Refferedform />
                    </>
                )}

                <Box mt={2}  className="mb-5 d-flex align-items-center justify-content-between">
                    <Button
                        disabled={activeStep === 0 || isSubmitting}
                        onClick={handlePrev}
                        className="backbtn"
                    >
                        Previous
                    </Button>
                    <Typography variant="p" component="p" >
                        Step {activeStep + 1} of Step 6
                    </Typography>
                    <Button
                        disabled={isSubmitting}
                        type="submit"
                        onClick={isLastStep() ? handleSubmit : handleNext}
                        className="nextbtn"
                    >
                        {isLastStep() ? 'Submit' : 'Next'}
                    </Button>
                </Box>
            </div>
            {/*<pre>{JSON.stringify(values, null, 2)}</pre>*/}
            {/*<pre>{JSON.stringify(touched, null, 2)}</pre>*/}
        </>
    );
};

export default FormStepper;
