import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useEffect, useState} from "react";


const  MinistryTable = ({handleTab}) => {
    const ministryData = [
        {id:"1", name:"ministri name1", pos: "positon1", occu: "Occupied1", vec:"Vecant1"},
        {id:"1", name:"ministri name1", pos: "positon1", occu: "Occupied1", vec:"Vecant1"},
        {id:"1", name:"ministri name1", pos: "positon1", occu: "Occupied1", vec:"Vecant1"},
        {id:"1", name:"ministri name1", pos: "positon1", occu: "Occupied1", vec:"Vecant1"},
        {id:"1", name:"ministri name1", pos: "positon1", occu: "Occupied1", vec:"Vecant1"}
    ]
    useEffect(() => {
        for (let i  = 0; i < ministryData.length; i++) {
            let dataItem = ministryData[i]
            console.log(dataItem?.name)
        }

    }, []);
    // let navigate=useNavigate();
    const testing=()=>{
        console.log('path', )

    }
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>S.no.</TableCell>
                        <TableCell>Ministry</TableCell>
                        <TableCell>Total Position</TableCell>
                        <TableCell>Occupied</TableCell>
                        <TableCell>Vacant</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {ministryData.map((item) => (
                        <TableRow
                            key={item.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {item.id}
                            </TableCell>

                                <TableCell className="mini" onClick={(e)=> {
                                    handleTab(e, 1);
                                }}>
                                   {item.name}
                                </TableCell>

                            <TableCell>{item.pos}</TableCell>
                            <TableCell>{item.occu}</TableCell>
                            <TableCell>{item.vec}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
export  default MinistryTable;