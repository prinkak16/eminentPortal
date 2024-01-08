import React, {useEffect, useState} from 'react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import {Typography, Stack, Button, Box, Paper, Grid, FormLabel, TextField, Textarea} from '@mui/material';
import Selectfield from "../selectfield/selectfield";
import Inputfield from '../inputfield/inputfield';
import AddIcon from '@mui/icons-material/Add';
import Winchoiseselect from './winchoiceselect/winchoiceselect';
import SelectField from "../selectfield/selectfield";
import {getAssemblyData, getStateData} from "../../../../api/stepperApiEndpoints/stepperapiendpoints";
const Vidhansabhaform = (props) => {
    const [selectedOption, setSelectedOption] = useState('');
    const selectChange = (e) => {
        setSelectedOption(e.target.value);
    };
    const [StateData, setStateData]= useState([])
    const [stateId, setStateId] = useState(null);
    const [assemblyData, setAssemblyData]=useState()
    const getState =()=>{
        getStateData.then((res)=>{
            setStateData(res.data.data)
            const selectedState = res.data.data.findIndex(item => item.id === props.values.state_name);
            if (selectedState) {
                setStateId(selectedState);
            }
        })
    }
    useEffect(() => {
        getState()
    },[]);


    const getassembly=()=>{
        if (stateId) {
            let dataAssembly = `?location_type=State&location_id=${stateId}&required_location_type=AssemblyConstituency`;
            getAssemblyData(dataAssembly).then((res) => {
                setAssemblyData(res.data.data);
            });
        }
    }
    useEffect(()=>{
        if(props.values.state_name !== ''){
            getassembly()
        }
    },[props.values.state_name])
    return (<>

            <Grid container spacing={2} className='px-5 py-3'>
                <Grid item xs={6}>
                    <FormLabel>State</FormLabel>
                    <SelectField name="state_name" defaultOption="Select State" optionList={StateData}/>

                </Grid>
                <Grid item xs={6}>
                    <FormLabel>AC</FormLabel>
                    <SelectField name="ac" defaultOption="Select Assembly" optionList={assemblyData} />

                </Grid>
                <Winchoiseselect/>
            </Grid>
        </>

    )

}
export default Vidhansabhaform