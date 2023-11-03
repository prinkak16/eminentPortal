import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useEffect, useState} from "react";


const  MinistryTable = ({data, onSwitchTab}) => {
    return (
        <TableContainer component={Paper} className="psutable">
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
                    {data.map((ministry, index) => <TableRow key={ministry.ministryId}>
                        <TableCell>{index + 1}</TableCell>
                        { }
                        <TableCell className="element" onClick={() => onSwitchTab('2', ministry.ministryId)}>{ministry.ministryName}</TableCell>
                        <TableCell>{ministry.totalPositions}</TableCell>
                        <TableCell>{ministry.occupied}</TableCell>
                        <TableCell>{ministry.vacant}</TableCell>
                    </TableRow>)}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
export  default MinistryTable;