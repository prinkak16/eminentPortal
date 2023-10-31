import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useEffect, useState} from "react";


const  VacancyTable = () => {
    const vacancyData = [
        {id:"1", name:"ministri name1", psu: "National Security", designation: "Independent Director", status:"Occupied"},
        {id:"2", name:"ministri name1", psu: "National Security", designation: "Independent Director", status:"Occupied"},
        {id:"3", name:"ministri name1", psu: "National Security", designation: "Independent Director", status:"Occupied"},
        {id:"4", name:"ministri name1", psu: "National Security", designation: "Independent Director", status:"Occupied"},
        {id:"5", name:"ministri name1", psu: "National Security", designation: "Independent Director", status:"Occupied"},
        {id:"6", name:"ministri name1", psu: "National Security", designation: "Independent Director", status:"Occupied"},

    ]
    useEffect(() => {
        for (let i  = 0; i < vacancyData.length; i++) {
            let dataItem = vacancyData[i]
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
                        <TableCell>PSU/PSB</TableCell>
                        <TableCell>Designation</TableCell>
                        <TableCell>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {vacancyData.map((item) => (
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

                            <TableCell>{item.psu}</TableCell>
                            <TableCell>{item.designation}</TableCell>
                            <TableCell>{item.status}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
export  default VacancyTable;