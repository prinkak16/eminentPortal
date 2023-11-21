import * as React from 'react';
import {Table, TableBody,TableCell, TableContainer,TableHead,  TableRow,Paper, Backdrop, CircularProgress } from '@mui/material'
import {useEffect, useState} from "react";
import ReactPaginate from "react-paginate";
import {getMinistryWiseData} from "../../../../../api/eminentapis/endpoints";


const  MinistryTable = ({onSwitchTab}) => {
    const [currentPage, setCurrentPage] = useState('');
    const [ministryTableData, setMinistryTableData] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState(null);
    const prepareToGetDisplayData = () => {
        // let pageString = '';
        // let offset = currentPage * limit;
        // pageString = `&offset=${offset}&limit=${limit}`;
        // tableDataDisplay(searched + pageString);
        setCurrentPage(currentPage)
    }
    useEffect(() => {
        setIsFetching(true);
        const params = {
            search_by: 'ministry_wise',
            // order_by: 'total',
            // order_type: 'DESC'
        };
        getMinistryWiseData(params)
            .then(response => {
            setIsFetching(false);
            setMinistryTableData(response.data.data.value);
        }).catch(error => {
            setIsFetching(false);
            setError(error);
            console.error(error);
        })
        prepareToGetDisplayData();
    }, [currentPage]);

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
                    {ministryTableData.map((ministry, index) => <TableRow key={ministry.ministry_id}>
                        <TableCell>{index + 1}</TableCell>
                        { }
                        <TableCell className="element" onClick={() => onSwitchTab('2', ministry.ministry_id)}>{ministry.ministry_name}</TableCell>
                        <TableCell>{ministry.total}</TableCell>
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