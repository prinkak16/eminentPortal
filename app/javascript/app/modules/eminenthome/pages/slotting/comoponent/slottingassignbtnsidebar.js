import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
    Box,
    Drawer,
    Typography,
    TextField,
    Button,
    MenuItem,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {assignSlottingVacancy, getSlottingPsuData} from "../../../../../api/eminentapis/endpoints";
import {useEffect, useState} from "react";
import './slottingassignbtnsidebar.css'
import AddIcon  from '@mui/icons-material/Add'
import MinimizeIcon from '@mui/icons-material/Minimize';
import {getStateData} from "../../../../../api/stepperApiEndpoints/stepperapiendpoints";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Paper from '@mui/material/Paper';
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
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [toggleEdit, setToggleEdit] = useState(false)

    const toggleEditIcon = (event) => {
        event.preventDefault()
        setToggleEdit(!toggleEdit)
    };


    const customFunction = () => {
        getSlottingPsuData(psuId).then(response => {
            setSlottingPsuDetail(response.data.data.stats[0]);
            setSlottingVacancyDetail(response.data.data.slotting);
        })
    }

    const addVacancyTableData = () => {
        getSlottingPsuData(psuId).then(response => {
            setSlottingVacancyDetail(response.data.data.slotting);
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
            addVacancyTableData()
        }
        else {
            handleAddMore()
        }}
    const handleEdit = () => {
        setAddMore(true)
    }
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
                                {slottingVacancyDetail.value && slottingVacancyDetail.value.length > 0 ? (
                                    slottingVacancyDetail.value.map((vacancy, index) =>
                                        (<TableRow>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{vacancy.vacancy_count}</TableCell>
                                                <TableCell>{vacancy.country_state_name}</TableCell>
                                                <TableCell>{vacancy.slotting_remarks}</TableCell>
                                                <TableCell>
                                                    <div className="position-relative">
                                                    <Button onClick = {toggleEditIcon}>
                                                        <MoreVertIcon/>
                                                    </Button>
                                                    {toggleEdit && (
                                                        <div className="edit-popup">
                                                            <Button onClick={() => handleEdit(vacancy.country_state_name)}><MoreVertIcon/></Button>
                                                            
                                                        </div>
                                                    )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>)
                                        )
                                ) : (<p className="text-center">No data found</p>)}
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