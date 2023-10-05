import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Typography, Stack, Button, Box, Paper, Grid, FormLabel, TextField,Textarea} from '@mui/material';
import Selectfield from "../selectfield/selectfield";
import Inputfield from '../inputfield/inputfield';
import AddIcon from '@mui/icons-material/Add';
import Winchoiseselect from './winchoiceselect/winchoiceselect';
const Stepfouraddmore=()=>{
   
    
    const [selectedOption, setSelectedOption] = useState('');
    const selectChange = (e) => {
        setSelectedOption(e.target.value);
      };
    return(
    <>
        
            <Grid container spacing={2} className='px-5 py-3'>
                <Grid item xs={6}>
                <FormLabel>State</FormLabel>
                        <Selectfield  name="state"  optionList={['Select State']}/>
                
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