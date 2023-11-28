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
    const slottingPsuData = ()=>{
        getSlottingPsuData(psuId).then(res => {
            setSlottingPsuDetail(res.data.data.stats)
        })
    }
    useEffect(() => {
        slottingPsuData()
    }, []);
    const handleDecreaseCount = ()=>{
        setVacancyCount(vacancyCount - 1)
    }
    const handleIncreaseCount = ()=>{
        setVacancyCount(vacancyCount + 1)
    }
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
                <div className="vacancytostate">
                    <div className="d-flex justify-content-between">
                        <div>
                            <Typography>
                                Vacancy Count
                            </Typography>
                            <div>
                                <Button onClick={handleDecreaseCount}><MinimizeIcon/></Button>
                                <Typography>
                                    {vacancyCount}
                                </Typography>
                                <Button onClick={handleIncreaseCount}><AddIcon/></Button>
                            </div>
                        </div>
                        <div>
                            <Typography>
                                Vacancy Count
                            </Typography>
                            <TextField
                                id="outlined-select-currency"
                                select
                                >
                                    <MenuItem>
                                        Test
                                    </MenuItem>

                            </TextField>
                        </div>
                    </div>
                </div>
            </Drawer>
        </Box>
    );
}
export default AssignBtnSidebar;

// const psudetails={
//     psuName:"Balmer Lawrie",
//     total_position:12,
//     occupied:9,
//     vacant:10,
// }