import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useEffect, useState} from "react";
import  './movtable.css'


const  VacancyTable = ({data, onSwitchTab}) => {
    return (
        <TableContainer component={Paper} className="psutable">
            <Table sx={{ minWidth: 650 }} aria-label="simple table" >
                <TableHead>
                    <TableRow>
                        <TableCell>Sr. No.</TableCell>
                        <TableCell>Ministry</TableCell>
                        <TableCell>PSU/PSB</TableCell>
                        <TableCell>Designation</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Applicant Name</TableCell>
                        <TableCell>Saral ID</TableCell>
                        <TableCell>Tenure Start</TableCell>
                        <TableCell>Tenure End</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((ministry, index) => {
                        console.log('m', ministry)
                        let ministryCount = 0;
                        let ministryRowSpan = 0;
                        ministry.departments.forEach(department => {
                            ministryRowSpan += department.psus.length;
                        })
                        return ministry.departments.map((department, departmentIndex) => {
                            ministryCount += departmentIndex;
                            return department.psus.map((psu, psuIndex) =>{
                                ministryCount += psuIndex;
                                return(
                                    <TableRow>
                                        {ministryCount===0 && <TableCell rowSpan={ministryRowSpan}>{index + 1}</TableCell>}
                                        {ministryCount===0 && <TableCell rowSpan={ministryRowSpan} onClick={()=>onSwitchTab('1')}>{ministry.ministryName}</TableCell>}
                                        <TableCell>{psu.psuName}</TableCell>
                                        <TableCell>{psu.designation}</TableCell>
                                        <TableCell>{psu.status}</TableCell>
                                        <TableCell>{psu.applicantName}</TableCell>
                                        <TableCell>{psu.saralId}</TableCell>
                                        <TableCell>{psu.tenureStart}</TableCell>
                                        <TableCell>{psu.tenureEnd}</TableCell>
                                    </TableRow>
                                )}
                            )
                        })
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
export  default VacancyTable;

const ministry = {
    ministryName: 'Ministry One',
    departments: [
        { departmentId: 'm1_d1', departmentName: 'Ministry Two - Department One', psus: [
                {psu_id: 'm1_d1_p1', psuName: 'Ministry Two - Department One - PSU/PSB One', psuListed: 'yes', totalPosition: 27, occupied: 20, vacant: 10, designation: 'Designation One', status: 'Occupied', applicantName: 'Name one', saralId: 'xyz', tenureStart: '12-02-2018', tenureEnd: ''},
                {psu_id: 'm1_d1_p2', psuName: 'Ministry Two - Department One - PSU/PSB two', psuListed: 'yes', totalPosition: 27, occupied: 20, vacant: 10, designation: 'Designation Two', status: 'Occupied', applicantName: 'Name one', saralId: 'xyz', tenureStart: '12-02-2018', tenureEnd: ''}
            ]},
        { departmentId: 'm1_d2', departmentName: 'Ministry Two - Department two', psus: [
                {psu_id: 'm1_d2_p1', psuName: 'Ministry Two - Department two - PSU/PSB One', psuListed: 'yes', totalPosition: 27, occupied: 20, vacant: 10, designation: 'Designation One', status: 'Occupied', applicantName: 'Name one', saralId: 'xyz', tenureStart: '12-02-2018', tenureEnd: ''},
                {psu_id: 'm1_d2_p2', psuName: 'Ministry Two - Department two - PSU/PSB two', psuListed: 'yes', totalPosition: 27, occupied: 20, vacant: 10, designation: 'Designation two', status: 'Occupied', applicantName: 'Name one', saralId: 'xyz', tenureStart: '12-02-2018', tenureEnd: ''}
            ]},
    ],
    totalPositions: 20,
    occupied: 17,
    vacant: 3
}