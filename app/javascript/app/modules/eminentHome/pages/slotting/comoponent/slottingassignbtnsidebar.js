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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import IconButton from '@mui/material/IconButton';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
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
import ReactPaginate from "react-paginate";
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
    const [remarks, setRemarks] = useState('')
    const [vacancyId, setVacancyId] = useState([])
    const [validValue, setValidValue] = useState(true)
    const [prevVacancyCount, setPrevVacancyCount] = useState(null);
    const [currentPage, setCurrentPage] = useState(0)
    const limit = 10;
    let originalVacancyCount;
    let originalStateId;
    let originalRemarks;
    function initializeOriginalValues() {
        originalVacancyCount = stateId;
        originalStateId = vacancyCount;
        originalRemarks = remarks;
    }

    const customFunction = () => {
        const paginateParams = {
            limit : limit,
            offset : currentPage * limit
        }
        getSlottingPsuData(psuId, paginateParams).then(response => {
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
        if (vacancyCount + 1 <= slottingPsuDetail.unslotted) {
            setVacancyCount(vacancyCount + 1)
        }
        if (vacancyCount === slottingPsuDetail.unslotted) {
            toast("Vacancy count can't be greater than Unslotted ");
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
        toast("state updated ");
    }
    const handleRemarksChange = (e) => {
        const remarkValue = e.target.value;
        setRemarks(remarkValue);
        if (remarkValue && validValue === false) {
            setValidValue(true);
        }
    }
    const handleAddMore = () => {
        setAddMore(true)
    }
        const handleSave = async (event) => {
            event.preventDefault();
            if (addMore === true) {
                    const vacancyData = {
                        ministry_id: slottingMinistryId,
                        organization_id: psuId,
                        vacancy_count: vacancyCount,
                        state_id: stateId,
                        remarks: remarks,
                    };
                    assignSlottingVacancy(vacancyData).then((res) => res.json())
                 if(vacancyData && vacancyData.state_id !== undefined && vacancyData.vacancy_count > 0){
                    toast(`${vacancyCount} vacancy successfully assigned to state`);
                 }

                if(vacancyCount && vacancyData.state_id !== undefined && vacancyData.vacancy_count > 0 && vacancyData.remarks !== ''){
                    const reSlottingData = {
                        ministry_id: slottingMinistryId,
                        organization_id: psuId,
                        vacancy_count: vacancyCount,
                        state_id: stateId,
                        vacancies_id: vacancyId,
                        remarks: remarks,
                    };
                    reassignSlottingVacancy(reSlottingData).then((res) => res.json())
                }
                setAddMore(false);
                addVacancyTableData();
                setVacancyCount(0);
                setStateId('');
                setRemarks('');
            } else {
                handleAddMore();
            }
        };
        const handleEdit = (vacancyDetail) => {
        setVacancyCount(vacancyDetail.vacancy_count);
        setStateId(vacancyDetail.country_state_id);
        setRemarks(vacancyDetail.slotting_remarks);
        setVacancyId(vacancyDetail.vacancies_id)
        setAddMore(true)
            initializeOriginalValues()
    }

  const handleDelete = (unslotId) => {
        const deleteParams = {
            vacancies_id: unslotId,
            remarks: "",
        }
      deleteSlottingVacancy(deleteParams).then((res) => res.json())
      customFunction()
  }

    useEffect(() => {
        customFunction();
        slottingState()
        if (vacancyCount !== prevVacancyCount) {
            setPrevVacancyCount(vacancyCount);
        }
    }, [vacancyCount, prevVacancyCount, currentPage]);

    return (

        <Box sx={{display: 'flex'}}>
            <ToastContainer />
            <Drawer

                variant="persistent"
                anchor="right"
                open={open}
                psuId={psuId}
                className="slotting-sidebar"
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        <ArrowForwardIosIcon/>
                    </IconButton>
                </DrawerHeader>
                <TableContainer component={Paper} className="slottingassigntable">
                    <Table sx={{minWidth: 650}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>PSU Name</TableCell>
                                <TableCell>Total Position</TableCell>
                                <TableCell>Slotted</TableCell>
                                <TableCell>Unslotted</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow key={slottingPsuDetail.id}>
                                <TableCell>{slottingPsuDetail.name}</TableCell>
                                <TableCell>{slottingPsuDetail.total}</TableCell>
                                <TableCell>{slottingPsuDetail.slotted}</TableCell>
                                <TableCell>{slottingPsuDetail.unslotted}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <div className="vacancytostate mt-3">
                    <Typography variant="h5">
                        Assign Vacancy to state
                    </Typography>
                    { addMore && (
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
                                        defaultValue={stateId ? stateId : 'Select State'}
                                        error={!validValue}
                                        helperText={!validValue ? 'Please select any state' : ''}
                                    >
                                        <MenuItem key="{state}" value="Select State">
                                            Select State
                                        </MenuItem>
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
                    <div className="mt-3">
                        <p className="d-flex justify-content-center">{currentPage + 1} &nbsp;of&nbsp; { slottingVacancyDetail?.count ?  Math.ceil(slottingVacancyDetail?.count / limit) : ''}</p>
                        <ReactPaginate
                            previousLabel={"Previous"}
                            nextLabel={"Next"}
                            breakLabel={"...."}
                            pageCount={Math.ceil(slottingVacancyDetail?.count / limit)}
                            marginPagesDisplayed={1}
                            pageRangeDisplayed={5}
                            onPageChange={(selectedPage) => setCurrentPage(selectedPage.selected)}
                            containerClassName={'pagination justify-content-end'}
                            pageClassName={'page-item'}
                            pageLinkClassName={'page-link'}
                            previousClassName={'page-item'}
                            previousLinkClassName={'page-link'}
                            nextClassName={'page-item'}
                            nextLinkClassName={'page-link'}
                            breakClassName={'page-link'}
                            breakLinkClassName={'page-item'}
                            activeClassName={'active'}/>
                    </div>

                </div>
            </Drawer>
        </Box>
    );
}
export default AssignBtnSidebar;