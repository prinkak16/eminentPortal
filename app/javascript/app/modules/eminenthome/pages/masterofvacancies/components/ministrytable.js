import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useEffect, useState} from "react";
import ReactPaginate from "react-paginate";


const  MinistryTable = ({data, onSwitchTab}) => {
    const [tableData, setTableData] = useState(null);
    const [currentPage, setCurrentPage] = useState('');
    const prepareToGetDisplayData = () => {
        // let pageString = '';
        // let offset = currentPage * limit;
        // pageString = `&offset=${offset}&limit=${limit}`;
        // tableDataDisplay(searched + pageString);
        setCurrentPage(currentPage)
    }
    useEffect(() => {
        prepareToGetDisplayData();
    }, [currentPage]);

    return (
        <>
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
    <div className="mt-3">
        <p className="d-flex justify-content-center">{currentPage + 1}</p>
        <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"...."}
            // pageCount={ limit}
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
</>
    );
}
export  default MinistryTable;