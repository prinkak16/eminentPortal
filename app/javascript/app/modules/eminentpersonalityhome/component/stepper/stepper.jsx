import React, {useEffect, useState} from 'react';
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
import DeviceInfo from "../../eminentforms/deviceinfo";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FormStepper = ({
                        userData,
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
                         setFieldValue,
                         onSubmit,
                         handleChange,
                         stepDataFlag,
                         setStepData,
                         handleSaveClick

                     }) => {
    const [cumulativeData, setCumulativeData] = useState({});
    const [completed, setCompleted] = React.useState({});
    const [notification, setNotification] = React.useState(true);


    // Function to update cumulative data
    const updateCumulativeData = (data) => {
        setCumulativeData((prevData) => ({ ...prevData, ...data }));
    };
    const ActiveStep = steps[activeStep];

    const closeNotiocation = () => {
        setNotification(false)
    }
    return (
        <>
            <div className="stepperwrap">
                <Stepper alternativeLabel activeStep={activeStep}>
                    {steps.map((step, index) => (
                        <Step key={index} completed={completed[index]}>
                            <StepButton onClick={() => handleStep(index)}  sx={{
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
                                {steps[index].label}
                            </StepButton>
                        </Step>
                    ))}
                </Stepper>
                <div className="stepouter px-md-5 mt-5">
                    {notification &&
                        <div className="notification-container">
                     <span>
                         Note:  <mark>*</mark>Marked field are mandatory.
                     </span>
                            <span className='close-icon' onClick={closeNotiocation}>
                            <FontAwesomeIcon icon={faTimes}/>
                        </span>
                        </div>
                    }
                    <DeviceInfo/>
                    <ActiveStep onSave={handleSaveClick} onChange={handleChange} stepDataFlag={stepDataFlag} setStepData={setStepData} activeStep={activeStep} userData={userData} formValues={values} onUpdate={updateCumulativeData} setFieldValue={setFieldValue} />
                    <Box mt={2} className="mb-5 d-flex align-items-center justify-content-between">
                        <Button
                            disabled={activeStep === 0 || isSubmitting}
                            onClick={handlePrev}
                            className="backbtn"
                        >
                            Previous
                        </Button>
                        <Typography variant="p" component="p">
                            Step {activeStep + 1} of Step {steps.length}
                        </Typography>
                        <Button className="nextbtn" type="submit"  >
                            {isLastStep() ? "Submit" : "Save & Next"}
                        </Button>
                    </Box>
                </div>
            </div>
        </>
    );
};

export default FormStepper;
