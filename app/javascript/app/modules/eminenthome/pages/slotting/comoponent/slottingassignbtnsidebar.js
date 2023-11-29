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
import {getSlottingPsuData} from "../../../../../api/eminentapis/endpoints";
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
const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
}));

const AssignBtnSidebar=({open, handleDrawerClose, psuId})=> {
    const [slottingPsuDetail, setSlottingPsuDetail] = useState([])
    const [vacancyCount, setVacancyCount] = useState(null)
    const [slottingStateData, setSlottingStateData] = useState([])
    const [addMore, setAddMore] = useState(false)
    const slottingPsuData = ()=>{
        getSlottingPsuData(psuId).then(res => {
            setSlottingPsuDetail(res.data.data.stats)
        })
    }
    const handleDecreaseCount = ()=>{
        setVacancyCount(vacancyCount - 1)
    }
    const handleIncreaseCount = ()=>{
        setVacancyCount(vacancyCount + 1)
    }
    const slottingState = () => {
        getStateData.then((res) => {
            setSlottingStateData(res.data.data)
        })
    }
    const handleSave = () =>{
        console.log('save')
    }
    useEffect(() => {
        slottingPsuData()
        slottingState()
        setAddMore(true)
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
                            {slottingPsuDetail.map((pusDetail, index) =>
                                <TableRow key={pusDetail.id}>
                                    <TableCell>{pusDetail.name}</TableCell>
                                    <TableCell>{pusDetail.total}</TableCell>
                                    <TableCell>{pusDetail.occupied}</TableCell>
                                    <TableCell>{pusDetail.vacant}</TableCell>
                                </TableRow>)}
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
                                >
                                    <MenuItem>test</MenuItem>
                                    {slottingStateData?.map((item, index) => (
                                        <MenuItem key={index.id}  value={item.name}>
                                            {item.name}
                                        </MenuItem>
                                    ) )}
                                </TextField>
                            </div>
                        </div>
                            <div>
                            <Typography className="mb-2">
                                Remarks
                            </Typography>
                            <TextField className="p-2" fullWidth multiline rows={3} id="outlined-basic"  variant="outlined" placeholder="E.g. requirement of 1 woman director, requirement of 1 financial background." />
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
                                {/*{slottingPsuDetail.map((pusDetail, index) =>*/}
                                    <TableRow >
                                        <TableCell>1</TableCell>
                                        <TableCell>10</TableCell>
                                        <TableCell>Rajasthan</TableCell>
                                        <TableCell> 1 woman required</TableCell>
                                    </TableRow>
                                {/*)}*/}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Button className="savebtn" onClick={handleSave}>Save</Button>
                </div>
            </Drawer>
        </Box>
    );
}
export default AssignBtnSidebar;