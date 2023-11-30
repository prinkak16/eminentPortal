import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(number, ministry, totalPosition, occupied, vacant) {
    return { number, ministry, totalPosition, occupied, vacant};
}

const VacanciesTableData = [
    createData(1, 'ministry Petroleum', 6.0, 24, 4.0),

];

const  TableData = () => {
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
                    {VacanciesTableData.map((VacanciesTableData) => (
                        <TableRow
                            key={VacanciesTableData.number}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {VacanciesTableData.number}
                            </TableCell>
                            <TableCell ><a href="">{VacanciesTableData.ministry}</a></TableCell>
                            <TableCell>{VacanciesTableData.totalPosition}</TableCell>
                            <TableCell>{VacanciesTableData.occupied}</TableCell>
                            <TableCell>{VacanciesTableData.vacant}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
export  default TableData;