import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useEffect, useState} from "react";


const  PSUTable = ({handlepsu, handleVacancy}) => {
    const psuData = [
        {id:"1", ministry:"ministri", department: "positon1", psu:"national",},
        {id:"2", ministry:"ministri", department: "positon1", psu:"national",},
        {id:"3", ministry:"ministri", department: "positon1", psu:"national",},
        {id:"4", ministry:"ministri", department: "positon1", psu:"national",},
        {id:"5", ministry:"ministri", department: "positon1", psu:"national",},
        {id:"6", ministry:"ministri", department: "positon1", psu:"national",},
        {id:"6", ministry:"ministri", department: "positon1", psu:"national",},

    ]
    useEffect(() => {
        for (let i  = 0; i < psuData.length; i++) {
            let dataItem = psuData[i]
            console.log(dataItem?.name)
        }

    }, []);

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>S.no.</TableCell>
                        <TableCell>Ministry</TableCell>
                        <TableCell>Department</TableCell>
                        <TableCell>PSU/PSB</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {psuData.map((item) => (
                        <TableRow
                            key={item.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {item.id}
                            </TableCell>

                            <TableCell className="mini" onClick={(e)=> {
                                console.log('psu')
                                handlepsu(e, 0);
                            }}>
                                {item.ministry}
                            </TableCell>

                            <TableCell>{item.department}</TableCell>
                            <TableCell onClick={(e)=>handleVacancy(e,2)}>{item.psu}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
export  default PSUTable;