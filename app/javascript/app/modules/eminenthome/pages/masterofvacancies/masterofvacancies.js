import React, {useEffect, useState} from "react";
import Phone from "./../../../../../../../public/images/phone.svg"
import {debounce} from "lodash";
import {deleteMember, getData, updateState} from "../../../../api/eminentapis/endpoints";
import ReactPaginate from "react-paginate";
import Modal from "react-bootstrap/Modal";
import {useNavigate} from "react-router-dom";
import {Link} from 'react-router-dom';
import Analytics from "../../shared/././analytics/analytics";
import TableData from "../../shared/table/table";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import  MinistryTable from './components/ministrytable'
import PSUTable from "./components/psutable";
import VacancyTable from "./components/vacancytable";
import './masterofvacancies.css'


function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}
CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index1) {
    return {
        id: `simple-tab-${index1}`,
        'aria-controls': `simple-tabpanel-${index1}`,
    };
}
const MasterVacancies = (props) => {
    const [searchedName, setSearchedName] = useState('');
    const [tableData, setTableData] = useState(null);
    const [searchId, setSearchId] = useState('');
    const [currentPage, setCurrentPage] = useState('');
    const [deleteMemberId, setDeleteMemberId] = useState(null);
    const [reasonToDelete, setReasonToDelete] = useState('');
    const [deleteDisabled, setDeleteDisabled] = useState(true);
    const [wantToChangeStatus, setWantToChangeStatus] = useState(false);
    const [reasonToUpdateState,  setReasonToUpdateState] = useState('');
    const [currStatus,setCurrStatus] = useState('');
    const [currId, setCurrId] = useState('');
    const [open, setOpen] = useState(true);
    const navigate = useNavigate();
    const offset = 0;
    const limit = 2;


    const displayPhoneNumbers = (member) => {
        const displayingNumbers = member.data.mobiles.splice(0, 2);
        return displayingNumbers.map((number, index) => (
            <div className="col-md-6 text-container pe-0 ps-2.5">
                {index === 0 && <Phone/>}
                <p className={`ml-2 label-text ${index === 0 ? 'br-label first-number' : 'br-label2 pt-5'}`}>{number}</p>
            </div>
        ))
    }

    const deleteCurrentMember = (deleteId) => {
        setDeleteMemberId(deleteId);
    }

    useEffect(() => {
        if (reasonToDelete && reasonToDelete.length > 0) {
            setDeleteDisabled(false);
        }
    }, [reasonToDelete]);

    const updateCurrentState = (id, status) => {
        setWantToChangeStatus(true);
        setCurrId(id);
        setCurrStatus(status);
    }
    const updateCurrentStatus = () => {
        const newState ={
            "id": currId,
            "aasm_state": currStatus=== 'freeze' ? 'approve' : 'reject',
            "reason": reasonToUpdateState
        }
        updateState(newState).then(res=>{
            setWantToChangeStatus(false);
            prepareToGetDisplayData();
            console.log(res);
        }).catch(err=>{
            console.log(err);
        })
    }
    const deleteMem = () => {
        let deleteString = `id=${deleteMemberId}`;
        if (reasonToDelete && reasonToDelete.length > 0) {
            deleteString += `&reason=${reasonToDelete}`;
        }
        deleteMember(deleteString).then(res => {
            prepareToGetDisplayData();
            setDeleteMemberId(null)
        }).catch(err => {
            console.log("Error With Deleting Member", err);
        })
    }

    const prepareToGetDisplayData = () => {
        let searched = props?.filterString;
        if (searchedName && searchedName.length > 0) {
            searched += `&query=${searchedName}`;
        }
        if (searchId && searchId.length > 0) {
            searched += `&search_by_id=${searchId}`;
        }
        let pageString = '';
        let offset = currentPage * limit;
        pageString = `&offset=${offset}&limit=${limit}`;
        tableDataDisplay(searched + pageString);
    }

    useEffect(() => {
        prepareToGetDisplayData();
    }, [searchedName, props.filterString, searchId, currentPage]);

    const onSearchNameId = (e, isNameSearch = true) => {
        const value = e.target.value;
        debounce(isNameSearch ? setSearchedName(value) : setSearchId(value), 500)
    }
    const tableDataDisplay = (searchedUser) => {
        getData(searchedUser).then(res => {
            setTableData(res);
        }).catch(err => {
            setTableData(null);
            console.log(err);
        });
    }

    useEffect(() => {
        console.log('value change of table data', tableData);
    }, [tableData]);

    const openDocument = (filePath) => {
        window.open(filePath);
    }

    const handleClickAway = () => {
        setOpen(false);
    };

    const handleClick = () => {
        setOpen(true);
    };

    const handleDownload = (url) => {
        const link = document.createElement('a');
        link.href = 'url';
        link.download = "ExamplePdf.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const [filterString, setFilterString] = useState('');
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        console.log('new val ',newValue);
        setValue(newValue);
    };


    return (
        <>
            <Analytics/>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className="mastertabs">
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Ministry Wise" {...a11yProps(0)} />
                        <Tab label="PSU wise" {...a11yProps(1)} />
                        <Tab label="Vacancy Wise" {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                        <MinistryTable handleTab={handleChange}/>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <PSUTable handleVacancy={handleChange} handlepsu={handleChange}/>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    <VacancyTable />
                </CustomTabPanel>
            </Box>

            <div>
                <p className="d-flex justify-content-center">{currentPage + 1}&nbsp;of&nbsp;{Math.ceil(tableData?.data?.data.length / limit)}</p>
                <ReactPaginate
                    previousLabel={"<Previous"}
                    nextLabel={"Next"}
                    breakLabel={"...."}
                    pageCount={Math.ceil(tableData?.data?.data.length / limit)}
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
            <Modal
                contentClassName="addModal"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={wantToChangeStatus}
            >
                <Modal.Body>
                    <textarea  className="ps-2 reasontext" rows={3} cols={40} placeholder="Write your reason here"
                               onChange={(e) => setReasonToUpdateState(e.target.value)}/>
                </Modal.Body>
                <Modal.Footer>
                    <p className="cancelbtn" onClick={() => setWantToChangeStatus(false)}>Cancel</p>
                    <button className="btn" onClick={()=>updateCurrentStatus()}>Submit
                    </button>
                </Modal.Footer>
            </Modal>
            <Modal
                contentClassName="addModal"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={deleteMemberId}
            >
                <Modal.Body>
                    <textarea  className="ps-2 reasontext" rows={3} cols={40} placeholder="Write your reason here"
                               onChange={(e) => setReasonToDelete(e.target.value)}/>
                </Modal.Body>
                <Modal.Footer>
                    <p className="cancelbtn" onClick={() => setDeleteMemberId(null)}>Cancel</p>
                    <button className="btn btn-danger" disabled={deleteDisabled} onClick={() => deleteMem()}>Delete
                    </button>
                </Modal.Footer>
            </Modal>

        </>

    )
}
export default MasterVacancies;