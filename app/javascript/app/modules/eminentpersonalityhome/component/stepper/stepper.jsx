import * as React from 'react';
import { useState } from 'react';
import Personaldetailsform from '../../eminentforms/personaldetails';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import './stepper.scss'
import {
    Typography,
    Button,
    TextField,
    Stepper,
    Step,
    StepLabel,
    Box
} from "@mui/material";
import Communicationform from '../../eminentforms/communication';
import Educationform from '../../eminentforms/educationandprofession';
import PolticalandGovrnform from '../../eminentforms/politicalandgovernmant';
import Resumeform from '../../eminentforms/resume';
import Refferedform from "../../eminentforms/reffer";
import Primarybutton from '../primarybutton/primarybutton';
const steps = ['Personal Details', 'Communication Details', 'Education and Profession', 'Political and Government', 'Resume', 'Reffered By'];

const FormStepper=()=> {
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());
    const [formData, setFormData] = useState({});
    // const [reqmessage, setReqmessage]=useState()

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
}

const saveprog=()=>{
    return <Button type="submit" className="savebtn" onClick={(e) => saveProgressAction()} variant="contained" > Save Progress</Button>
}
return (
    <Box className="stepouter" sx={{ width: '100%' }}>
<div className="container-fluid px-md-5">
<Stepper className="stepperwrap" activeStep={activeStep} alternativeLabel>
{steps.map((label, index) => {
        const stepProps = {};
        const labelProps = {};
        if (isStepSkipped(index)) {
            stepProps.completed = false;
        }
        return (
            <Step key={label} {...stepProps}
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
            '& .MuiStepConnector-root':{
                left: 'calc(-54% + 20px)',
                    right: 'calc(46% + 20px)',
                    zIndex: '-1',
                    height:'4px'
            },
            '& .MuiStepConnector-line':{
                borderTopWidth: '4px',
            }
        }}
    >
        <StepLabel sx={{colo:'#FF9559'}} {...labelProps}>{label}</StepLabel>
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
                <Personaldetailsform />
</>
)}
    {activeStep === 1 && (
        <>
            <Communicationform/>
        </>
    )}
    {activeStep === 2 && (
        <>
            <Educationform/>
        </>
    )}
    {activeStep === 3 && (
        <>
            <PolticalandGovrnform data={formData[0]}/>
        </>
    )}
    {activeStep === 4 && (
        <>
            <Resumeform/>
        </>
    )}
    {activeStep === 5 && (
        <>
            <Refferedform/>
        </>
    )}

    </div>
    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent:'space-between', pt: 2 }}>
        <Primarybutton addclass='backbtn' disabled={activeStep === 0 } type="submit" handleclick={handleBack} starticon={<WestIcon/>} buttonlabel="Back" />
    <Box>
        <Typography variant="p" component="p" sx={{ mt: 3}}>Step {activeStep + 1} of Step 6</Typography>
    </Box>
        <Primarybutton addclass="nextbtn" disabled={activeStep === steps.length-1 } type="submit" handleclick={handleNext} starticon={<EastIcon/>} buttonlabel="Next" />
    </Box>
    </React.Fragment>
)}
</div>
</Box>
);
}
export default FormStepper;
