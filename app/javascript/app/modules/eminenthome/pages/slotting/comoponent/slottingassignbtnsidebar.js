import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
    Box,
    Drawer,
    Divider,
    Typography,
    TextField,
    Button,
    MenuItem
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {assignSlottingVacancy, getSlottingPsuData} from "../../../../../api/eminentapis/endpoints";
import {useEffect, useState} from "react";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import './slottingassignbtnsidebar.css'
import AddIcon  from '@mui/icons-material/Add'
import MinimizeIcon from '@mui/icons-material/Minimize';
import {getStateData} from "../../../../../api/stepperApiEndpoints/stepperapiendpoints";
import {value} from "lodash/seq";
const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
}));

const AssignBtnSidebar=({open, handleDrawerClose, psuId, slottingMinistryId})=> {
    const [slottingPsuDetail, setSlottingPsuDetail] = useState({})
    const [slottingVacancyDetail, setSlottingVacancyDetail] = useState([])
    const [vacancyCount, setVacancyCount] = useState(0)
    const [slottingStateData, setSlottingStateData] = useState([])
    const [addMore, setAddMore] = useState(false)
    const [stateId, setStateId] = useState()
    const [remarks, setRemarks] = useState()

    const customFunction = () => {
        getSlottingPsuData(psuId).then(response => {
            setSlottingPsuDetail(response.data.data.stats[0]);
            // setSlottingVacancyDetail(response.data.data.slotting);
            // console.log('res', response.data.data.slotting)
        })
    }
    const slottingPsuData = ()=>{
            getSlottingPsuData(psuId).then(res => {
            setSlottingPsuDetail(res.data.data.stats)
        })
    }
    const assignVacancyStateData = ()=>{
        getSlottingPsuData(psuId).then(res => {
            setSlottingVacancyDetail(res.data.data.slotting.value)
        })
    }
    const handleDecreaseCount = ()=> {
        if(vacancyCount  >= 1){
            setVacancyCount(vacancyCount - 1)
        }

    }
    const handleIncreaseCount = ()=> {
        if(vacancyCount + 1 <= slottingPsuDetail.vacant){
            setVacancyCount(vacancyCount + 1)
            console.log(vacancyCount)
        }
    }
    const slottingState = () => {
        getStateData.then((res) => {
            setSlottingStateData(res.data.data)
        })
    }
    const handleStateChange = (event) => {
        setStateId(event.target.value)
    }
    const handleRemarksChange = (event) =>{
        setRemarks(event.target.value)
    }
    const handleAddMore = () => {
        setAddMore(!addMore)
    }
    const handleSave = () =>{
        if(addMore === true) {
            const vacancyData = {
                ministry_id: slottingMinistryId,
                organization_id: psuId,
                vacancy_count: vacancyCount,
                state_id: stateId,
                remarks: remarks,
            }
            assignSlottingVacancy(vacancyData).then((res) => res.json())
            setAddMore(false)
        }
        else {
            handleAddMore()
            assignVacancyStateData()
        }}
    useEffect(() => {
        customFunction();
        slottingState()
    }, []);

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer

                variant="persistent"
                anchor="right"
                open={open}
                psuId={psuId}
                className="slotting-sidebar"
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {/*{theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}*/}
                        <ChevronLeftIcon />
                    </IconButton>
                </DrawerHeader>
                <TableContainer component={Paper} className="slottingassigntable">
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>PSU Name</TableCell>
                                <TableCell>Total Position</TableCell>
                                <TableCell>Occupied</TableCell>
                                <TableCell>Vacant</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow key={slottingPsuDetail.id}>
                                <TableCell>{slottingPsuDetail.name}</TableCell>
                                <TableCell>{slottingPsuDetail.total}</TableCell>
                                <TableCell>{slottingPsuDetail.occupied}</TableCell>
                                <TableCell>{slottingPsuDetail.vacant}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <div className="vacancytostate mt-3">
                    {addMore && (
                        <div>
                            <div className="d-flex">
                            <div className="me-3">
                                <Typography className="mb-2">
                                    Vacancy Count
                                </Typography>
                                <div className="d-flex">
                                    <Button onClick={handleDecreaseCount}><MinimizeIcon/></Button>
                                    <Typography className="countnumber mx-2" >
                                        {vacancyCount}
                                    </Typography>
                                    <Button onClick={handleIncreaseCount}><AddIcon/></Button>
                                </div>
                            </div>
                            <div>
                                <Typography className="mb-2">
                                    Vacancy Count
                                </Typography>
                                <TextField
                                    id="outlined-select-currency"
                                    select
                                    fullWidth
                                    name="state"
                                    onChange={handleStateChange}
                                >
                                    <MenuItem>test</MenuItem>
                                    {slottingStateData?.map((item, index) => (
                                        <MenuItem key={index.id}  value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ) )}
                                </TextField>
                            </div>
                                <Button className="savebtn mt-3 " onClick={handleSave}>Save</Button>

                        </div>
                            <div>
                            <Typography className="mb-2">
                                Remarks
                            </Typography>
                            <TextField
                                className="p-2"
                                fullWidth
                                multiline
                                rows={3}
                                name="remarks"
                                id="outlined-basic"
                                variant="outlined"
                                onChange={handleRemarksChange}
                                placeholder="E.g. requirement of 1 woman director, requirement of 1 financial background." />
                        </div>
                        </div>
                    )}
                    <TableContainer component={Paper} className="slottingassigntable">
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Sr. no</TableCell>
                                    <TableCell>Vacancy Count</TableCell>
                                    <TableCell>State</TableCell>
                                    <TableCell>Remarks</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/*{(slottingVacancyDetail.value !== []) ? slottingVacancyDetail.value.map((vacancy, index) =>*/}
                                {/*    <TableRow>*/}
                                {/*        <TableCell>{vacancy.vacancy_count}</TableCell>*/}
                                {/*        <TableCell>{vacancy.country_state_name}</TableCell>*/}
                                {/*        <TableCell>{vacancy.slotting_remarks}</TableCell>*/}
                                {/*        <TableCell> {vacancy.country_state_name}</TableCell>*/}
                                {/*    </TableRow>*/}
                                {/*)*/}
                                {/*:*/}
                                {/*    <TableRow>*/}
                                {/*        <TableCell></TableCell>*/}
                                {/*        <TableCell></TableCell>*/}
                                {/*        <TableCell></TableCell>*/}
                                {/*        <TableCell></TableCell>*/}
                                {/*    </TableRow>*/}
                                {/*}*/}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {(addMore === false) ? ( <Button className="savebtn mt-3 " onClick={handleAddMore}>Add More</Button>): ''}

                </div>
            </Drawer>
        </Box>
    );
}
export default AssignBtnSidebar;