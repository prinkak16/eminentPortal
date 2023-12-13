import * as React from 'react';
import {Table, TableBody,TableCell, TableContainer,TableHead,  TableRow,Paper, Backdrop, CircularProgress } from '@mui/material'
import {useContext, useEffect, useState} from "react";
import ReactPaginate from "react-paginate";
import {getMinistryWiseData} from "../../../../../api/eminentapis/endpoints";

const  MinistryTable = ({ onSwitchTab, filterString }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [ministryTableData, setMinistryTableData] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState(null);
    const limit = 10;
    const displayMinistryData = ()=>{
        const params = {
            search_by: 'ministry_wise',
            limit: limit,
            offset: currentPage * limit
        };

        getMinistryWiseData(params, filterString)
            .then(response => {
                setIsFetching(false);
                setMinistryTableData(response.data.data);
            }).catch(error => {
            setIsFetching(false);
            setError(error);
        })
    }

    useEffect(() => {
        setIsFetching(true);
        displayMinistryData();
    }, [currentPage, filterString]);
    return (
        <>
            { error && <h1>Error: {error.response.data.message}</h1> }
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={isFetching}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
        <TableContainer component={Paper} className="psutable mb-3">
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
                    {ministryTableData?.value.map((ministry, index) => <TableRow key={ministry.ministry_id}>
                        <TableCell>{currentPage * limit + index + 1}</TableCell>
                        <TableCell className="element" onClick={() => onSwitchTab('psu_wise', ministry.ministry_id)}>{ministry.ministry_name}</TableCell>
                        <TableCell>{ministry.total}</TableCell>
                        <TableCell>{ministry.occupied}</TableCell>
                        <TableCell>{ministry.vacant}</TableCell>
                    </TableRow>)}
                </TableBody>
            </Table>
        </TableContainer>
    <div className="mt-3">
        <p className="d-flex justify-content-center">{currentPage + 1} &nbsp;of&nbsp; { ministryTableData?.count ?  Math.ceil(ministryTableData?.count / limit) : ''}</p>
        <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"...."}
            pageCount={Math.ceil(ministryTableData?.count / limit)}
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