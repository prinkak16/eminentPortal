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

const SlottingTabPage =({tabId, filterString})=>{
    const [currentPage, setCurrentPage] = useState(0);
    const [slottingTableData, setSlottingTableData] = useState(null);
    const [open, setOpen] = useState(false);
    const [psuId, setPsuId] = useState(null)
    const [slottingMinistryId, setSlottingMinistryId] = useState(null)
    const limit = 10;
    const handleDrawerOpen = (id, MinistryId, slotted) => {
        setOpen(true);
        setPsuId(id)
        setSlottingMinistryId(MinistryId)
    };
    const handleDrawerClose = () => {
        setOpen(false);
        slottingTable()
    };

    const slottingTable =()=>{
        const slottingParams = {
            limit: limit,
            offset: currentPage * limit
        }
        getSlottingTable(slottingParams, filterString).then(res => {
            setSlottingTableData(res.data.data)
        })
    }
    useEffect(() => {
        slottingTable()
    }, [currentPage, filterString]);
    return (
        <>
            <Analytics tabId={tabId} title="Position Analytics"/>
            {open && <AssignBtnSidebar slottingMinistryId={slottingMinistryId} psuId={psuId} open={open} handleDrawerClose={handleDrawerClose}  />}
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
                            {slottingTableData?.value.map((slotting, index) =>
                                <TableRow key={slotting.org_id}>
                                <TableCell>{currentPage * limit + index + 1}</TableCell>
                                <TableCell>{slotting.org_name}</TableCell>
                                <TableCell>{slotting.ministry_name}</TableCell>
                                <TableCell>{slotting.vacant}</TableCell>
                                <TableCell>{slotting.slotted}</TableCell>
                                <TableCell>{slotting.is_listed ? 'Yes' : 'No'}</TableCell>
                                <TableCell>{slotting.last_updated_at}</TableCell>
                                    <TableCell className="text-center"><Button className="assignButton" aria-label="open drawer"
                                                                               edge="end"
                                                                               onClick={() => {
                                                                                   handleDrawerOpen(slotting.org_id, slotting.ministry_id, slotting.slotted)
                                                                               }}
                                                                               sx={{ ...(open && { display: 'none' }) }}>{slotting.slotted === 0 ? 'Assign' : 'Update'}</Button></TableCell>
                            </TableRow>)}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div className="mt-3">
                    <p className="d-flex justify-content-center">{currentPage + 1} &nbsp; of &nbsp; { slottingTableData?.count ? Math.ceil(slottingTableData?.count / limit ) : ''}</p>
                    <ReactPaginate
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        breakLabel={"...."}
                        pageCount={Math.ceil(slottingTableData?.count / limit)}
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