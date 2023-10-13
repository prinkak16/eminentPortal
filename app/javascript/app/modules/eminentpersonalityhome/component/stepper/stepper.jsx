import React, { useState } from 'react';
import './stepper.scss';
import {
    Typography,
    Button,
    Stepper,
    Step,
    StepLabel,
    Box,
    Grid,
    StepButton,
} from '@mui/material';

const FormStepper = ({
                         activeStep,
                         handlePrev,
                         handleNext,
                         isSubmitting,
                         isLastStep,
                         steps,
                         values,
                         touched,
                         handleSubmit,
                         handleStep,
                     }) => {
    const [cumulativeData, setCumulativeData] = useState({});
    const [completed, setCompleted] = React.useState({});

    // Function to update cumulative data
    const updateCumulativeData = (data) => {
        setCumulativeData((prevData) => ({ ...prevData, ...data }));
    };

    const ActiveStep = steps[activeStep];

    return (
        <>
            <div className="stepperwrap">
                <Stepper alternativeLabel activeStep={activeStep}>
                    {steps.map((step, index) => (
                        <Step key={index} completed={completed[index]}>
                            <StepButton onClick={() => handleStep(index)}>
                                {steps[index].label}
                            </StepButton>
                        </Step>
                    ))}
                </Stepper>
                <div className="stepouter px-md-5 mt-5">
                    <Grid className="notes my-5">
                        <Typography sx={{ padding: '1rem' }} variant="p" component="p">
                            Note: All Fields Marked with * (star) are compulsory without filling them you won't be
                            able to submit the form. Click Save and continue to save your progress.
                        </Typography>
                    </Grid>
                    <ActiveStep onUpdate={updateCumulativeData} />

                    <Box mt={2} className="mb-5 d-flex align-items-center justify-content-between">
                        <Button
                            disabled={activeStep === 0 || isSubmitting}
                            onClick={handlePrev}
                            className="backbtn"
                        >
                            Previous
                        </Button>
                        <Typography variant="p" component="p">
                            Step {activeStep + 1} of Step 6
                        </Typography>
                        <Button className="nextbtn" type="submit">
                            {isLastStep() ? "Submit" : "Save & Next"}
                        </Button>
                    </Box>
                </div>
                <pre>{JSON.stringify(values, null, 2)}</pre>
            </div>
        </>
    );
};

export default FormStepper;
