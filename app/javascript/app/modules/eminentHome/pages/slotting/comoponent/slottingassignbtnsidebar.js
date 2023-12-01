import * as React from 'react';
import {styled, useTheme} from '@mui/material/styles';
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
import {
    assignSlottingVacancy, deleteSlottingVacancy,
    getSlottingPsuData,
    reassignSlottingVacancy
} from "../../../../../api/eminentapis/endpoints";
import {useEffect, useState} from "react";
import './slottingassignbtnsidebar.css'
import {getStateData} from "../../../../../api/stepperApiEndpoints/stepperapiendpoints";
import Paper from '@mui/material/Paper';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
}));

const AssignBtnSidebar = ({open, handleDrawerClose, psuId, slottingMinistryId}) => {
    const [slottingPsuDetail, setSlottingPsuDetail] = useState({})
    const [slottingVacancyDetail, setSlottingVacancyDetail] = useState([])
    const [vacancyCount, setVacancyCount] = useState(0)
    const [slottingStateData, setSlottingStateData] = useState([])
    const [addMore, setAddMore] = useState(false)
    const [stateId, setStateId] = useState()
    const [remarks, setRemarks] = useState()
    const [vacancyId, setVacancyId] = useState([])
    const [validValue, setValidValue] = useState(true)


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

    const handleDecreaseCount = () => {
        if (vacancyCount >= 1) {
            setVacancyCount(vacancyCount - 1)
        }

    }
    const handleIncreaseCount = () => {
        if (vacancyCount + 1 <= slottingPsuDetail.vacant) {
            setVacancyCount(vacancyCount + 1)
        }
    }
    const slottingState = () => {
        getStateData.then((res) => {
            setSlottingStateData(res.data.data)
        })
    }
    const handleStateChange = (e) => {
        const inputValue = e.target.value;
        setStateId(inputValue);
        if (inputValue && validValue === false) {
            setValidValue(true);
        }
    }
    const handleRemarksChange = (e) => {
        const remarkValue = e.target.value;
        setRemarks(remarkValue);
        if (remarkValue && validValue === false) {
            setValidValue(true);
        }
    }
    const handleAddMore = () => {
        setAddMore(!addMore)
    }

    const handleSave = (event) => {
        event.preventDefault()
        if (addMore === true) {
            if(vacancyCount && stateId && remarks){
                const reSlottingData = {
                    ministry_id: slottingMinistryId,
                    organization_id: psuId,
                    vacancy_count: vacancyCount,
                    state_id: stateId,
                    vacancies_id: vacancyId,
                    remarks: remarks,
                }
                reassignSlottingVacancy(reSlottingData).then((response) => console.log('res', response.json()))
            }
            else {
                const vacancyData = {
                    ministry_id: slottingMinistryId,
                    organization_id: psuId,
                    vacancy_count: vacancyCount,
                    state_id: stateId,
                    remarks: remarks,
                }
                assignSlottingVacancy(vacancyData).then((res) => res.json())
            }
            setAddMore(false)
            addVacancyTableData()
            setVacancyCount(0)
            setStateId('')
            setRemarks('')
        }
        else {
            handleAddMore()
        }
    }
    const handleEdit = (vacancyDetail) => {
        setVacancyCount(vacancyDetail.vacancy_count);
        setStateId(vacancyDetail.country_state_id);
        setRemarks(vacancyDetail.slotting_remarks);
        setVacancyId(vacancyDetail.vacancies_id)
        setAddMore(true)
    }

  const handleDelete = (unslotId) => {
        const deleteParams = {
            vacancies_id: unslotId,
            remarks: "",
        }
      deleteSlottingVacancy(deleteParams).then((res) => console.log('delete', res.json()))
      customFunction()
  }


    useEffect(() => {
        customFunction();
        slottingState()
    }, []);

    return (
        <Box sx={{display: 'flex'}}>
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
                        <ChevronLeftIcon/>
                    </IconButton>
                </DrawerHeader>
                <TableContainer component={Paper} className="slottingassigntable">
                    <Table sx={{minWidth: 650}} aria-label="simple table">
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
                    <Typography variant="h5">
                        Assign Vacancy to state
                    </Typography>
                    {addMore && (
                        <div>
                            <div className="d-flex">
                                <div className="me-5">
                                    <Typography className="mb-2">
                                        Vacancy Count
                                    </Typography>
                                    <div className="d-flex counterbutton align-items-center">
                                        <Button onClick={handleDecreaseCount}> - </Button>
                                        <TextField
                                            className="addremark mx-2 text-center"
                                            name="count"
                                            variant="outlined"
                                            value={vacancyCount}
                                        error={!validValue}
                                        helperText={!validValue ? 'Please enter your remark' : ''}/>
                                        {/*<Typography className="countnumber mx-2 p-2 text-center">*/}
                                        {/*    {vacancyCount}*/}
                                        {/*</Typography>*/}
                                        <Button onClick={handleIncreaseCount}> + </Button>
                                    </div>
                                </div>
                                <div className="w-100">
                                    <Typography className="mb-2">
                                        state
                                    </Typography>
                                    <TextField
                                        id="outlined-select-currency"
                                        select
                                        fullWidth
                                        name="state"
                                        onChange={handleStateChange}
                                        defaultValue={(stateId === stateId) ? stateId : 'Select State'}
                                        error={!validValue}
                                        helperText={!validValue ? 'Please select any state' : ''}
                                    >
                                        {slottingStateData?.map((item, index) => (
                                            <MenuItem key={index.id} value={item.id}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </div>
                            </div>
                            <div>
                                <Typography className="mb-2">
                                    Remarks
                                </Typography>
                                <TextField
                                    className="addremark"
                                    fullWidth
                                    multiline
                                    rows={2}
                                    name="remark"
                                    id="outlined-basic"
                                    variant="outlined"
                                    onChange={handleRemarksChange}
                                    value={remarks}
                                    placeholder="E.g. requirement of 1 woman director, requirement of 1 financial background."
                                    error={!validValue}
                                    helperText={!validValue ? 'Please enter your remark' : ''}/>
                            </div>
                            <Button className="savebtn mt-2 mb-3" onClick={handleSave}>Save</Button>
                        </div>
                    )}
                    <TableContainer component={Paper} className="psutable">
                        <Table sx={{minWidth: 650}} aria-label="simple table">
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
                                                <Button onClick={() => handleEdit(vacancy)}><ModeEditOutlineOutlinedIcon/></Button>
                                                <Button onClick={() => handleDelete(vacancy.vacancies_id)}><DeleteForeverOutlinedIcon/></Button>
                                            </TableCell>
                                        </TableRow>)
                                    )
                                ) : (<p className="text-center">No data found</p>)}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {(addMore === false) ? (
                        <Button className="savebtn mt-3 " onClick={handleAddMore}>Add More</Button>) : ''}

                </div>
            </Drawer>
        </Box>
    );
}
export default AssignBtnSidebar;