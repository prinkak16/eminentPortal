import React, {useEffect, useState} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Typography, Stack, Button, Box, Paper, Grid, FormLabel, TextField,Textarea} from '@mui/material';
import Selectfield from "../selectfield/selectfield";
import Inputfield from '../inputfield/inputfield';
import AddIcon from '@mui/icons-material/Add';
import Winchoiseselect from './winchoiceselect/winchoiceselect';
import SelectField from "../selectfield/selectfield";
import {getStateData} from "../../../../api/stepperApiEndpoints/stepperapiendpoints";
const Stepfouraddmore=()=>{
   
    
    const [selectedOption, setSelectedOption] = useState('');
    const selectChange = (e) => {
        setSelectedOption(e.target.value);
      };
    const [StateData, setStateData]= useState([])
    const getState =()=>{
        getStateData.then((res)=>{
            setStateData(res.data.data)
        })

    }
    useEffect(() => {
        getState()
    },[]);
    return(
    <>
        
            <Grid container spacing={2} className='px-5 py-3'>
                <Grid item xs={6}>
                <FormLabel>State</FormLabel>
                    <SelectField name="current_state" selectedvalues={selectedOption}  handleSelectChange={selectChange} defaultOption="Select State" optionList={StateData}/>
                </Grid>
                <Grid item xs={6}>
                <FormLabel>PC</FormLabel>
                        <Selectfield  name="pc"  optionList={['Select PC']}/>
                
                </Grid>
                <Winchoiseselect/>
            </Grid>
</>

    )

}
export default Stepfouraddmore