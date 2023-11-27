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
import {Backdrop, CircularProgress} from "@mui/material";
const  VacancyTable = ({onSwitchTab, filterString, organizationId}) => {
    const [vacancyTableData, setVacancyTableData] = useState(null)
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0)
    const limit=4;
    useEffect(() => {
        setIsFetching(true)
        const params={
            search_by:'vacancy_wise',
            order_by:'ministry_name',
            order_type:'DESC',
            organization: organizationId,
            limit: limit,
            offset: currentPage * limit
        }
        getMinistryWiseData(params, filterString)
            .then((res)=>{
                setIsFetching(false)
                setVacancyTableData(res.data.data)
            })
            .catch((error)=>{
                setIsFetching(false)
                setError(error);
            })
    }, [currentPage, filterString]);
    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isFetching}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
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
                    {vacancyTableData?.value.map((ministry, ministryIndex) => {
                        const ministryRowSpan = ministry.vac_info.length;
                        return ministry.vac_info.map((vacancy, vacancyIndex) => {
                            return (
                                <TableRow>
                                    {vacancyIndex === 0 && <TableCell rowSpan={ministryRowSpan}>{ministryIndex + 1}</TableCell>}
                                    {vacancyIndex === 0 && <TableCell onClick={()=>onSwitchTab('ministry_wise')} rowSpan={ministryRowSpan}>{ministry.ministry_name}</TableCell>}
                                    <TableCell>{vacancy.org_name}</TableCell>
                                    <TableCell>{vacancy.designation}</TableCell>
                                    <TableCell>{vacancy.status}</TableCell>
                                    <TableCell className="text-center">----</TableCell>
                                    <TableCell className="text-center">----</TableCell>
                                    <TableCell className="text-center">{vacancy.tenure_started_at ? (vacancy.tenure_started_at):'----'}</TableCell>
                                    <TableCell className="text-center">{vacancy.tenure_ended_at ? (vacancy.tenure_started_at):'----'}</TableCell>
                                </TableRow>
                            )
                        })
                    })}
                </TableBody>
            </Table>
        </TableContainer>
            <div>
                <p className="d-flex justify-content-center">{currentPage + 1}&nbsp;of&nbsp;{vacancyTableData?.count ? Math.ceil(vacancyTableData?.count / limit):''}</p>
                <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    breakLabel={"...."}
                    pageCount={Math.ceil(vacancyTableData?.count / limit)}
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
export  default VacancyTable;
