import * as React from 'react';
import {styled, useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Analytics from "../../shared/././analytics/analytics";
import HomeTable from "../hometable/hometable";
import "./homepage.css"
import "../../shared/tabs/tabs.css"
import FiltersSidebar from "../../shared/filterssidebar/filterssidebar";
import {useEffect, useState} from "react";
import BellIcon from "../../../../../../../public/images/bellicon.svg"
import {Button, Pagination} from "@mui/material";
import SideBarIcon from "./../../../../../../../public/images/sidebaricon.svg"
import {useNavigate} from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import {getData} from "../../../../api/eminentapis/endpoints";
import Header from "../../../eminentpersonalityhome/header/header";
import BasicTabs from "../../shared/tabs/tabs";


const drawerWidth = 240;

const Main = styled('main', {shouldForwardProp: (prop) => prop !== 'open'})(({theme, open}) => ({
    flexGrow: 1, padding: theme.spacing(3), transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.leavingScreen,
    }), marginLeft: `-${drawerWidth}px`, ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut, duration: theme.transitions.duration.enteringScreen,
        }), marginLeft: 0,
    }),
}),);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({theme, open}) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.leavingScreen,
    }), ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut, duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex', alignItems: 'center', padding: theme.spacing(0, 1), // necessary for content to be below app bar
    ...theme.mixins.toolbar, justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [toggle, setToggle] = useState(1);
    const [filterString, setFilterString] = useState('');
    const [wantToAddNew, setWantToAddNew] = useState(false);
    const [existingData, setExistingData] = useState(null);
    const [errorNumber, setErrorNumber] = useState('');
    const [inputNumber, setInputNumber] = useState('');
    const [submitDisabled, setSubmitDisabled] = useState(true);

    const navigate = useNavigate();

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
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const updateToggle = (id) => {
        setToggle(id);
    }

    return (<>
            <Header/>
            <Box sx={{display: 'flex'}} className="mt-5">

                <Drawer
                    sx={{
                        width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': {
                            width: drawerWidth, boxSizing: 'border-box',
                        },
                    }}
                    variant="persistent"
                    anchor="left"
                    open={open}
                >
                    <div>
                        <DrawerHeader className="d-flex justify-content-between mt-1.7 ms-4 ps-0">
                            <h2 className="filter">Filters</h2>
                            <IconButton className="chevronicon" onClick={handleDrawerClose}>
                                {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                            </IconButton>
                        </DrawerHeader>
                        <FiltersSidebar setFilterString={setFilterString}/>

                    </div>
                </Drawer>
                <Main open={open} className="p-0 mt-5">
                    <Typography className="ms-15-30">

                        <div className="d-flex justify-content-between">
                            <p className="heading">
                            <span>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{mr: 2, ...(open && {display: 'none'})}}
                        >
                            <SideBarIcon/>
                        </IconButton>
                            </span>
                                Eminent Personality</p>
                            <button className="addNewBtn" onClick={() => setWantToAddNew(true)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M13 6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6V11H6C5.44772 11 5 11.4477 5 12C5 12.5523 5.44772 13 6 13H11V18C11 18.5523 11.4477 19 12 19C12.5523 19 13 18.5523 13 18V13H18C18.5523 13 19 12.5523 19 12C19 11.4477 18.5523 11 18 11H13V6Z"
                                        fill="white"/>
                                </svg>
                                Add New
                            </button>
                        </div>

                    <BasicTabs/>
                        <>
                            {/*<Analytics toggle={toggle}/>*/}
                            {/*<HomeTable filterString={filterString}/>*/}

                        </>
                        {/*</div>*/}

                    </Typography>
                </Main>
            </Box>
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
        </>

    );
}