import React,{useState, useEffect} from 'react';
import {
    Paper,
    Box,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer

} from '@mui/material';
import ReactPaginate from "react-paginate";
import Analytics from "../../shared/analytics/analytics";
import {getSlottingTable} from "../../../../api/eminentapis/endpoints";
import AssignBtnSidebar from "./comoponent/slottingassignbtnsidebar";

const SlottingTabPage =({tabId})=>{
    const [currentPage, setCurrentPage] = useState('');
    const [slottingTableData, setSlottingTableData] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [psuId, setPsuID] = useState(null)
    const handleDrawerOpen = (id) => {
        setOpen(true);
        setPsuID(id)
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    const prepareToGetDisplayData = () => {
        setCurrentPage(currentPage)
    }
    const slottingTable =()=>{
        getSlottingTable().then(res=>{
            const temp = [];
            for (const key in res.data) {
                temp.push({
                    id: key,
                    ...res.data[key]
                })
            }
            setSlottingTableData(temp)
        })
        // getSlottingTable()
        // setSlottingTableData(slottingTableData)
    }
    useEffect(() => {
        prepareToGetDisplayData();
        slottingTable()
    }, [currentPage]);
    return (
        <>
            <Analytics tabId={tabId}/>
            <AssignBtnSidebar psuId={psuId} open={open} handleDrawerClose={handleDrawerClose}/>
            <Box sx={{ width: '100%', typography: 'body1' }} className="mt-3">
                <TableContainer component={Paper} className="psutable">
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>S.no.</TableCell>
                                <TableCell>PSU/PSB</TableCell>
                                <TableCell>Ministry</TableCell>
                                <TableCell>Vacant</TableCell>
                                <TableCell>Assigned to State</TableCell>
                                <TableCell>PSU Listed</TableCell>
                                <TableCell>Last Updated</TableCell>
                                <TableCell className="text-center">Assign</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {slottingTableData.map((slotting, index) =>
                                <TableRow key={slotting.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{slotting.psu_psb}</TableCell>
                                <TableCell>{slotting.ministry}</TableCell>
                                <TableCell>{slotting.vacant}</TableCell>
                                <TableCell>{slotting.assigned_to_state}</TableCell>
                                <TableCell>{slotting.psu_listed}</TableCell>
                                <TableCell>{slotting.last_updated}</TableCell>
                                    <TableCell className="text-center"><Button aria-label="open drawer"
                                                                               edge="end"
                                                                               onClick={() => {
                                                                                   handleDrawerOpen(slotting.id)
                                                                               }}
                                                                               sx={{ ...(open && { display: 'none' }) }}>{slotting.assigned_to_state === 0 ? 'Assign' : 'Update'}</Button></TableCell>
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
            </Box>
        </>
    )
}
export default SlottingTabPage

const slotting={
    psu_psb:"Citizen and Immigration Authority",
    ministry:"ministry of finance/treasury",
    vacant:3,
    assigned_to_state:1,
    psu_listed:"yes",
    last_updated:"10 Jul 2023",
}