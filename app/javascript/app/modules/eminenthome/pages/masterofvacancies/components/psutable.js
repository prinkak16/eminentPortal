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


const  PSUTable = ({onSwitchTab, ministryId, filterString}) => {
    const [psuTableData, setPsuTableData] = useState(null)
    const [isFetching, setIsFetching] = useState(false);
    const [currentPage, setCurrentPage] = useState(0)
    const [error, setError] = useState(null);
    const limit= 10;


    const displayPsuData = ()=>{
        const params = {
            search_by: 'organization_wise',
            order_by: 'total',
            order_type: 'DESC',
            ministry: ministryId,
            limit: limit,
            offset: currentPage * limit
        };
        getMinistryWiseData(params, filterString)
            .then((res)=>{
                setIsFetching(false)
                setPsuTableData(res.data.data)
            })
            .catch((error)=>{
                setIsFetching(false);
                setError(error);
            })
    }
    useEffect(() => {
        setIsFetching(true);
        displayPsuData()
    }, [filterString, currentPage]);
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
                        <TableCell>Department</TableCell>
                        <TableCell>PSU/PSB</TableCell>
                        <TableCell>PSU Listed</TableCell>
                        <TableCell>Total Position</TableCell>
                        <TableCell>Occupied</TableCell>
                        <TableCell>Vacant</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {psuTableData?.value.map((ministry, ministryIndex) => {
                        let ministryCount = 0;
                        let ministryRowSpan = 0;
                        ministry.dept_info.forEach(department => {
                            ministryRowSpan += department.org_info.length;
                        })
                        return ministry.dept_info.map((department, departmentIndex) => {
                            ministryCount += departmentIndex;
                            const departmentRowSpan = department.org_info.length;
                            return department.org_info.map((organization, psuIndex) => {
                                ministryCount += psuIndex;
                                return (
                                    <TableRow key={organization.org_id}>
                                        {ministryCount ===0   &&  <TableCell rowSpan={ministryRowSpan}>{ministryIndex + 1}</TableCell>}
                                        {ministryCount ===0 && <TableCell rowSpan={ministryRowSpan} onClick={()=>onSwitchTab('1', ministry.ministryId)}>{ministry.ministry_name}</TableCell>}
                                        {psuIndex ===0 && <TableCell rowSpan={departmentRowSpan} >{department.dept_name}</TableCell>}
                                        <TableCell onClick={() => onSwitchTab('3', null, organization.org_id)}>{organization.org_name}</TableCell>
                                        <TableCell className="text-center">{organization.is_listed ? (organization.is_listed) : '---'}</TableCell>
                                        <TableCell>{organization.total}</TableCell>
                                        <TableCell>{organization.occupied}</TableCell>
                                        <TableCell>{organization.vacant}</TableCell>
                                    </TableRow>
                                )
                            })
                        })
                    })}
                </TableBody>
            </Table>
        </TableContainer>
            <div>
                <p className="d-flex justify-content-center">{currentPage + 1}&nbsp;of&nbsp;{ psuTableData?.count ?  Math.ceil(psuTableData?.count / limit) : ''}</p>
                <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    breakLabel={"...."}
                    pageCount={Math.ceil(psuTableData?.count / limit)}
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
export  default PSUTable;