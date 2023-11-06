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


const  VacancyTable = ({data, onSwitchTab}) => {
    return (
        <>
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
export  default VacancyTable;
