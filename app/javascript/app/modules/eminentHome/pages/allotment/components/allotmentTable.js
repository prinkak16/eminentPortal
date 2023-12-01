import React, { useState, useEffect } from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import ReactPaginate from "react-paginate";
import '../components/allotmentTable.css';
import SearchIcon from "../../../../../../../../public/images/search.svg";
import ArrowDownward from "../../../../../../../../public/images/si_File_download.svg";
import IconPark from "../../../../../../../../public/images/icon-park_column.svg";
import EditIcon from "../../../../../../../../public/images/Edit.svg";

function    AllotmentTable({setAssignShow}) {
    const [tableData, setTableData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);

    function changeHandler(data) {
        if (data.action === 'assign') {
            setAssignShow(true);
            console.log('Assign action clicked');
        }
    }

    const fetchTableData = () => {

        const apiData =[
           {
            psu_psb:"National Security Solution Corporation (NSSC)",
            ministry:"Ministry of Interior",
            vacancy:2,
            department:"Ensure Put",
            listed:"yes",
            action:"assign"
        },
        {
            psu_psb:"National Security Solution Corporation (NSSC)",
            ministry:"Ministry of Interior",
            vacancy:2,
            department:"Ensure Put",
            listed:"yes",
            action:"update"
        },
        {
            psu_psb:"National Security Solution Corporation (NSSC)",
            ministry:"Ministry of Interior",
            vacancy:2,
            department:"Ensure Put",
            listed:"yes",
            action:"assign"
        }
    ];

        setTableData(apiData);
        const itemsPerPage = 5;
        setPageCount(Math.ceil(apiData.length / itemsPerPage));
    };

    useEffect(() => {
        fetchTableData();
    }, []);

    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };



    return (
        <div className="allotment-table">
            <div className='wrap'>
                <div className="search-box">
                    <SearchIcon className="searchIcon" />
                    <input type="text" placeholder="Search by PSU or Ministry" className="allot-searchField" />
                </div>
                <button className="allot-download-btn">Download <ArrowDownward /></button>
            </div>
            <div className="table_main">
                <TableContainer component={Paper} className="psutable_1">
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>S.no.</TableCell>
                                <TableCell>PSU/PSB</TableCell>
                                <TableCell>Ministry</TableCell>
                                <TableCell>Vacancy</TableCell>
                                <TableCell>Department</TableCell>
                                <TableCell>PSC Listed</TableCell>
                                <TableCell className="text-center"><IconPark /></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData.map((data, index) => (
                                <TableRow key={index + 1}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{data.psu_psb}</TableCell>
                                    <TableCell>{data.ministry}</TableCell>
                                    <TableCell>{data.vacancy}</TableCell>
                                    <TableCell>{data.department}</TableCell>
                                    <TableCell>{data.listed}</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                        <button
                                            variant="contained"
                                            className={data.action === 'assign' ? 'assign-button' : 'update-button'}
                                            onClick={() => changeHandler(data)}
                                        >
                                            {data.action.charAt(0).toUpperCase() + data.action.slice(1)}
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <div>
                    <span className="d-flex justify-content-center pageCount">{currentPage + 1}&nbsp;of&nbsp;{pageCount}</span>
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel="next >"
                        containerClassName={'pagination justify-content-end'}
                        onPageChange={handlePageChange}
                        pageLinkClassName={'page-link'}
                        pageClassName={'page-item'}
                        previousClassName={'page-item'}
                        previousLinkClassName={'page-link'}
                        nextClassName={'page-item'}
                        nextLinkClassName={'page-link'}
                        breakClassName={'page-item'}
                        breakLinkClassName={'page-link'}
                        activeClassName={'active'}
                        pageRangeDisplayed={3}
                        pageCount={pageCount}
                        previousLabel="< previous"
                    />
                </div>
            </div>
        </div>
    );
}

export default AllotmentTable;
