import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Typography from '@mui/material/Typography';
import './verticalStepper.scss'
import {useEffect} from "react";


export default function VerticalLinearStepper({stepperList}) {
    const [activeStep, setActiveStep] = React.useState(1);

    useEffect(() => {
        const step = stepperList.map(item => item.description)
        setActiveStep(step.length )
    },[])


    return (
        <Box className='vertical-stepper-container' sx={{ maxWidth: 400 }}>
            <Stepper className='vertical-stepper' activeStep={activeStep}  orientation="vertical">
                {stepperList && stepperList.map((step, index) => (
                    <Step key={step.label} className={`${step.description !== '' ? 'completed-steps' : 'uncompleted-steps'} ${index > 0 && 'after-first-step'}`}>
                        <StepLabel>
                            {step.label}
                        </StepLabel>
                            <Typography className='vertical-stepper-description'>{step.description}</Typography>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}