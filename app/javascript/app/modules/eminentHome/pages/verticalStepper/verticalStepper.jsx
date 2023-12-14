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
        const step = stepperList.map(item => item.updated_at)
        setActiveStep(step.length )
    },[])


    return (
        <Box className='vertical-stepper-container' sx={{ maxWidth: 400}}>
            <Stepper className='vertical-stepper' activeStep={activeStep}  orientation="vertical">
                {stepperList && stepperList.map((step, index) => (
                    <Step key={step.status} className={`${step.updated_at !== '' ? 'completed-steps' : 'uncompleted-steps'} ${index > 0 && 'after-first-step'}`}>
                        <StepLabel>
                            {step.status}
                        </StepLabel>
                            <Typography className='vertical-stepper-description'>{step.updated_at}</Typography>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}