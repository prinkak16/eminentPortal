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
import ReactPaginate from "react-paginate";


const  PSUTable = ({data, onSwitchTab}) => {
    return (
        <>
        <TableContainer component={Paper} className="psutable">
            <Table sx={{ minWidth: 650 }} aria-label="simple table" >
                <TableHead>
                    <TableRow>
                        <TableCell>Sr. No.</TableCell>
                        <TableCell>Ministry</TableCell>
                        <TableCell>Department</TableCell>
                        <TableCell>PSU/PSB</TableCell>
                        <TableCell>PSU Listed</TableCell>
                        <TableCell>Total Position</TableCell>
                        <TableCell>Occupied</TableCell>
                        <TableCell>Vacant</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((ministry, ministryIndex) => {
                        let ministryCount = 0;
                        let ministryRowSpan = 0;
                        ministry.departments.forEach(department => {
                            ministryRowSpan += department.psus.length;
                        })
                        return ministry.departments.map((department, departmentIndex) => {
                            ministryCount += departmentIndex;
                            const departmentRowSpan = department.psus.length;
                            return department.psus.map((psu, psuIndex) => {
                                ministryCount += psuIndex;
                                return (
                                    <TableRow key={psu.psu_id}>
                                        {ministryCount ===0   &&  <TableCell rowSpan={ministryRowSpan}>{ministryIndex + 1}</TableCell>}
                                        {ministryCount ===0 && <TableCell rowSpan={ministryRowSpan} onClick={()=>onSwitchTab('1')}>{ministry.ministryName}</TableCell>}
                                        {psuIndex ===0 && <TableCell rowSpan={departmentRowSpan} >{department.departmentName}</TableCell>}
                                        <TableCell onClick={()=>onSwitchTab('3', ministry.ministryId, department.departmentId)}>{psu.psuName}</TableCell>
                                        <TableCell >{psu.psuListed}</TableCell>
                                        <TableCell>{psu.totalPosition}</TableCell>
                                        <TableCell>{psu.occupied}</TableCell>
                                        <TableCell>{psu.vacant}</TableCell>
                                    </TableRow>
                                )
                            })
                        })
                    })}
                </TableBody>
            </Table>
        </TableContainer>
            <div>
                {/*<p className="d-flex justify-content-center">{currentPage + 1}&nbsp;of&nbsp;{Math.ceil(tableData?.data?.data.length / limit)}</p>*/}
                <ReactPaginate
                    previousLabel={"<Previous"}
                    nextLabel={"Next"}
                    breakLabel={"...."}
                    // pageCount={Math.ceil(tableData?.data?.data.length / limit)}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={5}
                    // onPageChange={(selectedPage) => setCurrentPage(selectedPage.selected)}
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
export  default PSUTable;