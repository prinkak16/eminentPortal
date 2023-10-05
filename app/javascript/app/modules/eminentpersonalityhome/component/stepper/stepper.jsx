import React, { useContext } from 'react';
import { useState } from 'react';
import Personaldetailsform from '../../eminentforms/personaldetails';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import './stepper.scss';
import {
    Typography,
    Button,
    TextField,
    Stepper,
    Step,
    StepLabel,
    Box,
} from '@mui/material';
import Communicationform from '../../eminentforms/communication';
import Educationform from '../../eminentforms/educationandprofession';
import PolticalandGovrnform from '../../eminentforms/politicalandgovernmant';
import Resumeform from '../../eminentforms/resume';
import Refferedform from '../../eminentforms/reffer';
import Primarybutton from '../primarybutton/primarybutton';

const steps = [
    'Personal Details',
    'Communication Details',
    'Education and Profession',
    'Political and Government',
    'Resume',
    'Referred By',
];

const FormStepper = () => {
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());
    const [formData, setFormData] = useState({});
    const [ nextEnable, setNextEnable ] = useState(false);
    const myForm = React.useRef(null);
    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {

        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const saveProgressAction = (e) => {
        const currentStepData = formData[activeStep];
        //todo api calling with current step data
    };

    const enableProgressAction = (isPassed) => {
      setNextEnable(isPassed);
    }

    return (
        <Box className="stepouter" sx={{ width: '100%' }}>
    <div className="container-fluid px-md-5">
    <Stepper
        className="stepperwrap"
    activeStep={activeStep}
    alternativeLabel
    >
    {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            if (isStepSkipped(index)) {
                stepProps.completed = false;
            }
            return (
                <Step
                    key={label}
            {...stepProps}
            sx={{
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
            }}
        >
            <StepLabel sx={{ colo: '#FF9559' }} {...labelProps}>
            {label}
            </StepLabel>
            </Step>
        );
        })}
    </Stepper>
    {activeStep === steps.length ? (
        <React.Fragment>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Box sx={{ flex: '1 1 auto' }} />
    <Button onClick={handleReset}>Reset</Button>
        </Box>
        </React.Fragment>
    ) : (
        <React.Fragment>
            <div className="my-5">
            {activeStep === 0 && (
                <>
                    <Personaldetailsform  enableProgressAction={enableProgressAction}/>
                </>
            )}
        {activeStep === 1 && (
            <>
                <Communicationform enableProgressAction={enableProgressAction}/>
            </>
        )}
        {activeStep === 2 && (
            <>
                <Educationform />
            </>
        )}
        {activeStep === 3 && (
            <>
                <PolticalandGovrnform enableProgressAction={enableProgressAction} />
        </>
        )}
        {activeStep === 4 && (
            <>
                <Resumeform enableProgressAction={enableProgressAction}/>
            </>
        )}
        {activeStep === 5 && (
            <>
                <Refferedform enableProgressAction={enableProgressAction}/>
            </>
        )}
        </div>
        <Box
        className="mb-5 d-flex align-items-center justify-content-between"
    >
        <Primarybutton
            addclass="backbtn "
        disabled={activeStep === 0}
        type="submit"
        handleclick={handleBack}
        starticon={<WestIcon />}
        buttonlabel="Back"
        />
        <Box>
            <Typography variant="p" component="p" >
        Step {activeStep + 1} of Step 6
    </Typography>
    </Box>
    <Primarybutton
        addclass="nextbtn"
        disabled={!nextEnable}
        type="submit"
        handleclick={handleNext}
        starticon={<EastIcon />}
        buttonlabel="Next"
            />
            </Box>
            </React.Fragment>
    )}
    </div>
    </Box>
);
};
export default FormStepper;
