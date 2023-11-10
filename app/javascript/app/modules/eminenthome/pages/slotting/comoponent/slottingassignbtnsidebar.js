import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
    Box,
    Drawer,
    Divider,
    Typography

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
    const slottingPsuData=()=>{
        getSlottingPsuData().then(res=>{
            const psuArray=[];
            for (const key in res.data) {
                psuArray.push({
                    id: key,
                    ...res.data[key]
                })
            }
            setSlottingPsuDetail(psuArray)
        })
    }
    useEffect(() => {
        slottingPsuData()
    }, []);
    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                // sx={{
                //     width: drawerWidth,
                //     flexShrink: 0,
                //     '& .MuiDrawer-paper': {
                //         width: drawerWidth,
                //     },
                // }}
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
                                    <TableCell>{pusDetail.psuName}</TableCell>
                                    <TableCell>{pusDetail.total_position}</TableCell>
                                    <TableCell>{pusDetail.occupied}</TableCell>
                                    <TableCell>{pusDetail.vacant}</TableCell>
                                </TableRow>)}
                        </TableBody>
                    </Table>
                </TableContainer>
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