import * as React from 'react';
import {Button,Tab, Box, TextField, styled, InputLabel } from '@mui/material';
import HomeTable from "../../pages/hometable/hometable";
import {useState, useContext} from "react";
import MasterVacancies from "../../pages/masterofvacancies/masterofvacancies";
import  './tabs.css'
import Modal from "react-bootstrap/Modal";
import {getData} from "../../../../api/eminentapis/endpoints";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
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

export default function BasicTabs() {
    const [filterString, setFilterString] = useState('');
    const [value, setValue] = React.useState('1');
    const [wantToAddNew, setWantToAddNew] =useState(false)
    const [inputNumber, setInputNumber] = useState('');
    const [existingData, setExistingData] = useState(null);
    const [errorNumber, setErrorNumber] = useState('');
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const [show, setShow] = useState(false);
    const [file, setFile] = useState(null);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };
    const handleSubmit = () => {
        if(file){
            const apiUrl = 'your_backend_api_url';
            const formData = new FormData();
            formData.append('excelFile', file);
            fetch(apiUrl, {
                method: 'POST',
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('File uploaded successfully', data);
                })
                .catch((error) => {
                    console.error('Error uploading file', error);
                });
        } else {
            console.error('No file selected');
        }
    }
    const isValidNumber = (number) => {
        const regex = /^[5-9]\d{9}$/;
        return regex.test(number);

    }
    const changeInputNumber = (number) => {
        setInputNumber(number.replace(/[^0-9]/g, ''));
        if (number && number.length === 10 && isValidNumber(number)) {
            let numberString = `&query=${number}`;
            getData(numberString).then(res => {
                console.log(res);
                setExistingData(res?.data?.data)
                setSubmitDisabled(false);
            }).catch(err => {
                console.log(err);
            });
            setSubmitDisabled(true);
        } else if (number && number.length === 10 && !isValidNumber(number)) {
            setErrorNumber('Please enter a valid number');
        } else {
            setErrorNumber('');
        }
        setExistingData(null);
        setSubmitDisabled(!number || number.length < 10 || !isValidNumber(number));
    }
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    let buttonContent;
    if (value === '1') {
        buttonContent = <button className="addNewBtn" onClick={() => setWantToAddNew(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M13 6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6V11H6C5.44772 11 5 11.4477 5 12C5 12.5523 5.44772 13 6 13H11V18C11 18.5523 11.4477 19 12 19C12.5523 19 13 18.5523 13 18V13H18C18.5523 13 19 12.5523 19 12C19 11.4477 18.5523 11 18 11H13V6Z"
                    fill="white"/>
            </svg>
            Add New
        </button>
    } else if (value === '2') {
        buttonContent =
            <>
                <Button variant="primary" onClick={handleShow}>
                    Launch demo modal
                </Button>
                <Modal show={show} onHide={handleClose}
                       aria-labelledby="contained-modal-title-vcenter"
                       centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">Upload  Excel File</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/*<Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>*/}
                        {/*    Upload file*/}
                        {/*    <VisuallyHiddenInput type="file" />*/}
                        {/*    <br/>*/}
                        {/*    <label>Drag and Frop Excel file here <br/> Or <br/> Click here to upload</label>*/}
                        {/*</Button>*/}

                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                            aria-placeholder="Drag and Frop Excel file here Click here to upload"
                        />

                        <TextField id="outlined-basic" name="email"  type="email" variant="outlined" />
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            className="btn"
                            onClick={() => setWantToAddNew(false)}>
                            Cancel
                        </button>
                        <button
                            className="btn addNewSubmit"
                            onClick={handleSubmit}>
                            Submit
                        </button>
                        <button
                            className="btn">
                            Download sample file
                        </button>
                    </Modal.Footer>
                </Modal>
            </>
    } else if (value === '3') {
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
    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className="hometabs d-flex justify-content-between align-items-center">
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Home" value="1" />
                        <Tab label="Master of Vacancies" value="2" />
                        <Tab label="File Stauts" value="3" />
                    </TabList>
                    {buttonContent}
                </Box>
                <TabPanel value="1">
                    <HomeTable filterString={filterString} tabId={value}/>
                </TabPanel>
                <TabPanel value="2">
                    <MasterVacancies  tabId={value}/>
                </TabPanel>
                <TabPanel value="3">
                    Item Three
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
                    {(existingData && existingData.length > 0) && <span>Number Already Exist</span>}
                    {(errorNumber && errorNumber.length > 0) && <span>{errorNumber}</span>}
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="btn"
                        onClick={() => setWantToAddNew(false)}>
                        Cancel
                    </button>
                    <button
                        className="btn addNewSubmit"
                        onClick={() => navigate('/EminentPersonality')}
                        disabled={submitDisabled}>
                        Submit
                    </button>
                </Modal.Footer>
            </Modal>
        </Box>

    );
}