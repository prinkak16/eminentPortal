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


const  PSUTable = ({onSwitchTab, ministryId, filterString}) => {
    const [psuTableData, setPsuTableData] = useState([])
    useEffect(() => {
        const params = {
            search_by: 'organization_wise',
            order_by: 'total',
            order_type: 'DESC',
            ministry_id: ministryId
        };
        getMinistryWiseData(params).then(res=>
            setPsuTableData(res.data.data.value))
    }, []);
    return (
        <>
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
                    {psuTableData.map((ministry, ministryIndex) => {
                        let ministryCount = 0;
                        let ministryRowSpan = 0;
                        ministry.dept_info.forEach(department => {
                            ministryRowSpan += department.org_info.length;
                        })
                        return ministry.dept_info.map((department, departmentIndex) => {
                            ministryCount += departmentIndex;
                            const departmentRowSpan = department.org_info.length;
                            return department.org_info.map((psu, psuIndex) => {
                                ministryCount += psuIndex;
                                return (
                                    <TableRow key={psu.org_id}>
                                        {ministryCount ===0   &&  <TableCell rowSpan={ministryRowSpan}>{ministryIndex + 1}</TableCell>}
                                        {ministryCount ===0 && <TableCell rowSpan={ministryRowSpan} onClick={()=>onSwitchTab('1')}>{ministry.ministry_name}</TableCell>}
                                        {psuIndex ===0 && <TableCell rowSpan={departmentRowSpan} >{department.dept_name}</TableCell>}
                                        <TableCell onClick={()=>onSwitchTab('3', ministry.ministryId, department.departmentId)}>{psu.org_name}</TableCell>
                                        <TableCell >{psu.is_listed}</TableCell>
                                        <TableCell>{psu.total}</TableCell>
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