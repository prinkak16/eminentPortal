import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Typography, Stack, Button, Box, Paper, Grid, FormLabel, TextField,Textarea} from '@mui/material';
import Selectfield from "../../selectfield/selectfield";
import Inputfield from '../../inputfield/inputfield';
import AddIcon from '@mui/icons-material/Add';

const  Winchoiseselect=()=>{
    const [winchoice, setWinchoice]=useState(false)
    const handlewinyes=()=>{
      setWinchoice(true)
    }
    const handlewinno=()=>{
      setWinchoice(false)
    }
    const [ministryport, setMinistryport]=useState(false)
    const handleportyes=()=>{
      setMinistryport(true)
    }
    const handleportno=()=>{
      setMinistryport(false)
    }
    return(
        <>
<Grid item xs={12}>
                    <FormLabel fullwidth>Do you win ?</FormLabel>
                    <div className='d-flex'>
                        <label className='d-flex justify-content-start me-3 ' >
                            <Field onChange={handlewinyes} className="w-auto me-2" type="radio" name="win" value="One" /> Yes
                        </label>
                        <label className='d-flex justify-content-start'>
                            <Field onChange={handlewinno} type="radio" className="w-auto me-2" name="win" value="Two" /> No
                        </label>
                    </div>
                </Grid>
                {winchoice && (
                    <Grid item xs={12} className='mb-3'>
                        <FormLabel fullwidth>Do you have any portfolio as Minister ?</FormLabel>
                        <div className='d-flex'>
                            <label className='d-flex justify-content-start me-3 ' >
                                <Field onChange={handleportyes} className="w-auto me-2" type="radio" name="win" value="One" /> Yes
                            </label>
                            <label className='d-flex justify-content-start'>
                                <Field  onChange={handleportno} type="radio" className="w-auto me-2" name="win" value="Two" /> No
                            </label>
                        </div>
                    </Grid>
                )}
                    {ministryport && (
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <FormLabel fullwidth>Name of Ministry</FormLabel>
                            <Inputfield type="text"
                            name="ministry_name "
                            placeholder="Enter Name of Ministry "/>
                            
                        </Grid>
                        <Grid item xs={6}>
                            <FormLabel fullwidth>Designation</FormLabel>
                            <Selectfield  name="designation"  optionList={['Select Designation']}/>
                        </Grid>
                        <Grid item xs={6}>
                            <FormLabel fullwidth> Duration</FormLabel>
                            <Inputfield type="text"
                            name="duration"
                            placeholder="Enter Duration (in Months)"/>
                        </Grid>
                        <Grid item xs={12}>
                            <Button className="addbtn mt-3" startIcon={<AddIcon/>}>
                                Add Ministry
                            </Button>
                        </Grid>
                    </Grid>
                        )} 

                        </>

    )

}
export default Winchoiseselect