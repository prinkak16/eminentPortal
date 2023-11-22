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
import {getMinistryWiseData} from "../../../../../api/eminentapis/endpoints";


const  VacancyTable = ({data, onSwitchTab}) => {
    const [vacancyTableData, setVacancyTableData] = useState([])
    useEffect(() => {
        const params={
            search_by:'vacancy_wise',
            order_by:'ministry_name',
            order_type:'DESC'
        }
        getMinistryWiseData(params).then(res=>{
            setVacancyTableData(res.data.data.value)
        })
    }, []);
    return (
        <>
        <TableContainer component={Paper} className="psutable mb-3">
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
                    {vacancyTableData.map((ministry, ministryIndex) => {
                        const ministryRowSpan = ministry.vac_info.length;
                        return ministry.vac_info.map((vacancy, vacancyIndex) => {
                            return (
                                <TableRow>
                                    {vacancyIndex === 0 && <TableCell rowSpan={ministryRowSpan}>{ministryIndex + 1}</TableCell>}
                                    {vacancyIndex === 0 && <TableCell onClick={()=>onSwitchTab('1')} rowSpan={ministryRowSpan}>{ministry.ministry_name}</TableCell>}
                                    <TableCell>{vacancy.org_name}</TableCell>
                                    <TableCell>{vacancy.designation}</TableCell>
                                    <TableCell>{vacancy.status}</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>{vacancy.tenure_started_at}</TableCell>
                                    <TableCell>{vacancy.tenure_ended_at}</TableCell>
                                </TableRow>
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
