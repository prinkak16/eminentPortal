import React, {useContext, useEffect, useState} from 'react';
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
import {ApiContext} from "../../../ApiContext";
import {isMobileUser} from "../../../utils";

const FormStepper = ({
                         viewMode,
                        stateId,
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
    const {isCandidateLogin} = useContext(ApiContext)
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

    useEffect(() => {
        for (const key in userData) {
            if (values.hasOwnProperty(key)) {
                    values[key] = userData[key]
            }
        }
        values.mobiles = userData.mobiles
    }, []);

    const buttonText = isLastStep()
        ? viewMode === 'view'
            ? isCandidateLogin
                ? 'Go Back'
                : 'Back to Home'
            : 'Submit'
        : viewMode === 'view'
            ? 'Next'
            : 'Save & Next';

    const muiDisabledHeight = {height: '2rem'}

    const getStepStyles = () => {
        const styles = {
            '& .MuiStepLabel-root .Mui-completed': {
                color: '#FF9559',
            },
            '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel': {
                color: '#FF9559',
            },
            '& .MuiStepLabel-root .Mui-active' : { color: '#FF9559',},
            '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel': {
                color: '#FF9559',
            },
            '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
                fill: '#fff',
            },
            '& .MuiStepConnector-root': {
                left: 'calc(-54% + 20px)',
                right: 'calc(46% + 20px)',
                zIndex: '-1',
                height: '4px',
            },
            '& .MuiStepConnector-line': {
                // borderTopWidth: '4px',
            },
        };

        // Conditionally add styles for mobile users
        if (isMobileUser) {
            styles['& .MuiStepLabel-root .Mui-disabled'] = {
                fontSize: '0.7rem',
                height: '2rem' ,
                width:  '2rem' ,
            };
            styles['& .MuiStepLabel-root .Mui-active'] = {
                fontSize: '0.7rem' ,
                height:  '2rem' ,
                color: '#FF9559',
            };
        }

        return styles;
    };

    return (
        <>
            <div className={`stepperwrap ${isMobileUser ? 'stepperwrap-mobile' :''}`}>
                <Stepper alternativeLabel activeStep={activeStep}>
                    {steps.map((step, index) => (
                        <Step key={index} completed={completed[index]}>
                            <StepButton onClick={() => handleStep(index)}  sx={getStepStyles()}>
                               <span> {isMobileUser ? activeStep === index ? steps[index].label : null : steps[index].label} </span>
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
                    <ActiveStep onSave={handleSaveClick} onChange={handleChange} stepDataFlag={stepDataFlag} setStepData={setStepData}
                                activeStep={activeStep}
                                userData={userData} stateId={stateId}
                                formValues={values}
                                viewMode={viewMode}
                                onUpdate={updateCumulativeData} setFieldValue={setFieldValue} />
                    <Box mt={2} className="mb-5 d-flex align-items-center justify-content-between p-2">
                        <Button
                            disabled={activeStep === 0 || isSubmitting}
                            onClick={handlePrev}
                            className={`backbtn ${isMobileUser ? ' mobile-next-btn' : ''}`}
                        >
                            Previous
                        </Button>
                        <Typography variant="p" component="p">
                            Step {activeStep + 1} of {steps.length}
                        </Typography>
                        <Button className={`nextbtn ${isMobileUser ? ' mobile-next-btn' : ''}`} type="submit"  >
                            {buttonText}
                        </Button>
                    </Box>
                </div>
            </div>
        </>
    );
};

export default FormStepper;
