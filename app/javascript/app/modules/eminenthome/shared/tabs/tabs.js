import * as React from 'react';
import {Button, Tab, Box, TextField, styled, InputLabel, Alert, Typography} from '@mui/material';
import HomeTable from "../../pages/hometable/hometable";
import {useState, useContext, useEffect, useRef} from "react";
import MasterVacancies from "../../pages/masterofvacancies/masterofvacancies";
import  './tabs.css'
import Modal from "react-bootstrap/Modal";
import {fetchMobile, getData, uploadVacancy} from "../../../../api/eminentapis/endpoints";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import PdfIcon from "../../../../../../../public/images/PdfIcon.svg";
import SlottingTabPage from "../../pages/slotting/slotting";
import {useNavigate, useSearchParams} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import GomPage from "../../pages/GOM/GomPage/GomPage";
import Allotment from "../../../eminenthome/pages/allotment/Allotment"
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import UploadIcon from "../../../../../../../public/images/upload.svg";
import CloseIcon from "../../../../../../../public/images/CloseIcon.svg";
import UploadFile from "../../../../../../../public/images/upload_file.svg";
import {useParams} from 'react-router-dom';

// import {TabsContext} from "../../../../context/tabdataContext";
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function BasicTabs({ onSwitchTab, filterString, openFilter, clearFilter}) {
    const [basicTabId, setBasicTabId] = useSearchParams({basicTabId: 'home_table'});
    const [value, setValue] = React.useState(basicTabId.get('basicTabId'));
    const [wantToAddNew, setWantToAddNew] =useState(false)
    const [inputNumber, setInputNumber] = useState('');
    const [existingData, setExistingData] = useState(null);
    const [errorNumber, setErrorNumber] = useState('');
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const [show, setShow] = useState(false);
    const [userData, setUserData] = useState();
    const [wantToUpload, setWantToUpload] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [fileName, setFileName] = useState()
    const [excelFile, setExcelFile] = useState()
    const [email, setEmail] = useState();
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [eminentMsg, setEminentMsg] = useState('');
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState(false)
    const notify = () => toast("CSV file Uploaded successfully");
    const hiddenFileInput = useRef(null);
    const handleEmailChange = (e) => {
        const inputValue = e.target.value;
        setEmail(inputValue);
        if (inputValue && isValidEmail === false) {
            setIsValidEmail(true);
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const handleClick = event => {
        setWantToUpload(true);
    };

    const uploadExcel = (event) => {
        const file = event.target.files[0];
        const allowedExtensions = ['.csv'];

        if (file) {
            const fileExtension = file.name.split('.').pop().toLowerCase();
            if (allowedExtensions.includes('.' + fileExtension)) {
                setFileName(file.name);
                setExcelFile(file);
            } else {
                alert('Please upload CSV files with .csv extension.');
            }
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (excelFile && validateEmail(email)) {
            setIsValidEmail(true);
            const formData = new FormData();
            formData.append('file', excelFile);
            formData.append('email', email);
            uploadVacancy(formData).then((response) => response.json())
            setShow(false)
            notify()
        } else {
            setIsValidEmail(false);
        }
    }
    const fileUrl= "https://storage.googleapis.com/public-saral/mapping_vacancy.csv"
    const downloadSampleVacancy=()=>{
        window.open(fileUrl,'_blank')
    }
    const isValidNumber = (number) => {
        const regex = /^[5-9]\d{9}$/;
        return regex.test(number);

    }

    const uploadFile = () => {
        hiddenFileInput.current.click();
    }
    const changeInputNumber = (number) => {
        setInputNumber(number.replace(/[^0-9]/g, ''));
        setEminentMsg('')
        if (number && number.length === 10 && isValidNumber(number)) {
            fetchMobile(number).then(res => {
                setEminentMsg(res.data?.message)
                setUserData(res?.data?.data)
                setSubmitDisabled(false);
            }).catch(err => {
                setSubmitDisabled(true);
                setEminentMsg(err.response.data.message)
            });
            setSubmitDisabled(true);
        } else if (number && number.length === 10 && !isValidNumber(number)) {
            setEminentMsg('Please enter a valid number');
        }
        setExistingData(null);
        setSubmitDisabled(!number || number.length < 10 || !isValidNumber(number));
    }
    const handleChange = (event, newValue) => {
        handleBasicTabChange({basicTabId: newValue});
        setValue(newValue);
        onSwitchTab(newValue);
    };

    const handleDownload = (url) => {
        const link = document.createElement('a');
        link.href = 'url';
        link.download = "https://storage.googleapis.com/public-saral/minister_assitant_mapping.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const  navigateForm = () => {
        localStorage.setItem('eminent_number', userData.phone);
        navigate({
            pathname: '/eminent_form'
        }, {
            state: {
                eminent_number: userData.phone,
                user_data: userData
            }
        });
    }

    const cancelAddNew = () => {
        setWantToAddNew(false)
        setInputNumber('')
        setEminentMsg((''))
    }

    const handleChangeUpload = event => {
        const fileUploaded = event.target.files[0];
        handleFile(fileUploaded);
    };

    const handleFile = (file) => {
        setSelectedFile(file);
    };


    let buttonContent;
    if (value === 'home_table') {
        buttonContent = <button className="addNewBtn" onClick={() => setWantToAddNew(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M13 6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6V11H6C5.44772 11 5 11.4477 5 12C5 12.5523 5.44772 13 6 13H11V18C11 18.5523 11.4477 19 12 19C12.5523 19 13 18.5523 13 18V13H18C18.5523 13 19 12.5523 19 12C19 11.4477 18.5523 11 18 11H13V6Z"
                    fill="white"/>
            </svg>
            Add New
        </button>
    } else if (value === 'master_of_vacancies') {
        buttonContent =
            <>
                <Button className="downloadBtn" variant="primary" onClick={handleShow}>
                   <ArrowUpwardIcon/> Upload CSV File
                </Button>

                <Modal  show={show} onHide={handleClose}
                       aria-labelledby="contained-modal-title-vcenter"
                       centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">Upload  Excel File</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ToastContainer />
                        <div className="excel-upload d-flex align-items-center flex-column w-100">
                            <div className='excel-icon-name'>
                                <span className="material-icons"><PdfIcon/></span>
                                <div id="excel-file-name" onClick={() => openPdfInBrowser(excelFile)}>{fileName}</div>
                            </div>
                            <div className='upload-excel-button'>
                                <Button component="label" variant="contained">
                                    <VisuallyHiddenInput accept=".csv" onChange={uploadExcel} type="file"/><br/>
                                    Drag and Drop Excel file here <br/> or <br/> click here to upload
                                </Button>
                                <TextField
                                    variant="outlined"
                                    type="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    error={!isValidEmail}
                                    helperText={!isValidEmail ? 'No CSV file selected or Invalid email format ' : ''}
                                />
                            </div>
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            className="btn"
                            onClick={handleClose}>
                            Cancel
                        </button>
                        <button
                            className="btn addNewSubmit" onClick={handleSubmit}>
                            Submit
                        </button>
                        <button
                            className="btn"
                            onClick={downloadSampleVacancy}
                        >
                            Download sample file
                        </button>
                    </Modal.Footer>
                </Modal>
            </>
    }
    else if (value === 'gom_management'){
        buttonContent=
           <>
        <button className="button-upload" onClick={handleClick}>
            <UploadIcon/> PA/OSD mapping
        </button>
               <input
                   type="file"
                   accept=".csv, .xlsx"
                   onChange={handleChangeUpload}
                   ref={hiddenFileInput}
                   style={{display: 'none'}}
               />
               <Modal
                   // contentClassName="deleteModal"
                   aria-labelledby="contained-modal-title-vcenter"
                   centered
                   show={wantToUpload}
               >
                   <Modal.Body>
                       <div>
                           <div className="d-flex justify-content-between">
                               <h6 >Upload .csv or Excel file</h6>
                               <p style={{cursor: "pointer"}} onClick={()=> setWantToUpload(false)}><CloseIcon/></p>
                           </div>
                           <div >
                               <div className="uploadBox">
                                   <div className="d-flex justify-content-center mt-4 " style={{height:"70px", width:"70px", backgroundColor:"#D3D3D3", borderRadius:"50%", marginLeft:"200px", alignItems:"center"}}>

                                       <UploadFile onClick={()=> uploadFile()}/>
                                   </div>
                                   <p className="d-flex justify-content-center">Drag and Drop .CSV or Excel file here </p>
                                   <p className="d-flex justify-content-center">or</p>
                                   <p className="d-flex justify-content-center">Click here to upload</p>
                                   <input placeholder="Enter Email" type="email"/>
                                   <button className="Submit" >
                                       Submit
                                   </button>
                               </div>
                               <p style={{marginLeft:"300px", color:"blue",cursor:"pointer"}} onClick={()=>handleDownload("url from api")}>Download sample file</p>
                           </div>
                       </div>
                   </Modal.Body>
               </Modal>
               </>
    } else if (value === 'file_status') {
        buttonContent = <button className="addNewBtn" onClick={() => setWantToAddNew(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M13 6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6V11H6C5.44772 11 5 11.4477 5 12C5 12.5523 5.44772 13 6 13H11V18C11 18.5523 11.4477 19 12 19C12.5523 19 13 18.5523 13 18V13H18C18.5523 13 19 12.5523 19 12C19 11.4477 18.5523 11 18 11H13V6Z"
                    fill="white"/>
            </svg>
            Add New
        </button>
    }

    const handleBasicTabChange = (basicTabValue) => {
        setBasicTabId(basicTabValue);
    }

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className="hometabs d-flex justify-content-between align-items-center">
                    <TabList onChange={handleChange} style={{maxWidth: window.innerWidth < 1281 && openFilter ? '45rem' : ''}} aria-label="lab API tabs example">
                        <Tab label="Home" value="home_table" />
                        <Tab label="Allotment" value="allotment" />
                        <Tab label="File Status" value="file_status" />
                        <Tab label="Master of Vacancies" value="master_of_vacancies" />
                        <Tab label="Slotting" value="slotting" />
                        <Tab label="GOM Management" value="gom_management" />
                    </TabList>
                    {buttonContent}
                </Box>
                <TabPanel value="home_table">
                    <HomeTable filterString={filterString} tabId={value} clearFilter={clearFilter}/>
                </TabPanel>

                <TabPanel value="allotment">
                    <Allotment  tabId={value}/>
                </TabPanel>
                <TabPanel value="file_status">
                    <Typography>File Status Page coming soon.....</Typography>
                </TabPanel>
                <TabPanel value="master_of_vacancies">
                    <MasterVacancies  filterString={filterString} tabId={value}/>
                </TabPanel>
                <TabPanel value="slotting">
                    <SlottingTabPage filterString={filterString} tabId={value}/>
                </TabPanel>
                <TabPanel value="gom_management">
                    <GomPage filterString={filterString} tabId={value}/>
                </TabPanel>

            </TabContext>
            <Modal
                contentClassName="deleteModal"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={wantToAddNew}
            >
                <Modal.Body>
                    <h4>Enter phone no.</h4>
                    <label>Mobile Number<span className="text-danger">*</span></label>
                    <input className="addNewInput ps-2"
                           type="tel"
                           maxLength={10}
                           value={inputNumber}
                           placeholder="Enter mobile number"
                           onChange={(e) => changeInputNumber(e.target.value)}/>
                    {eminentMsg && <span>{eminentMsg}</span>}
                    {(errorNumber && errorNumber.length > 0) && <span>{errorNumber}</span>}
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="btn"
                        onClick={cancelAddNew}>
                        Cancel
                    </button>
                    <button
                        className="btn addNewSubmit"
                        onClick={navigateForm}
                        disabled={submitDisabled}>
                        Submit
                    </button>
                </Modal.Footer>
            </Modal>
        </Box>
    );
}