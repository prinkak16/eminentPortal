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
import Analytics from "../../shared/analytics/analytics";
import HomeTable from "../hometable/hometable";
import "./homepage.css"
import "../../shared/tabs/tabs.css"
import FiltersSidebar from "../../shared/filterssidebar/filterssidebar";
import {useState} from "react";
import BellIcon from "../../../../../../../public/images/bellicon.svg"
import Header from "../../shared/header/header";
import {Pagination} from "@mui/material";
import SideBarIcon from "./../../../../../../../public/images/sidebaricon.svg"
import ReactPaginate from "react-paginate";


const drawerWidth = 240;

const Main = styled('main', {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme, open}) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    }),
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({theme, open}) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [toggle, setToggle] = useState(1);
    const [filterString, setFilterString] = useState('');
    const [wantToAddNew, setWantToAddNew] = useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const updateToggle = (id) => {
        setToggle(id);
    }

    return (
        <>
        <Box sx={{display: 'flex'}}>

            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
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
            <Main open={open} className="p-0">
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
                        <button className="addNewBtn" onClick={()=>setWantToAddNew(true)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M13 6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6V11H6C5.44772 11 5 11.4477 5 12C5 12.5523 5.44772 13 6 13H11V18C11 18.5523 11.4477 19 12 19C12.5523 19 13 18.5523 13 18V13H18C18.5523 13 19 12.5523 19 12C19 11.4477 18.5523 11 18 11H13V6Z"
                                    fill="white"/>
                            </svg>
                            Add New
                        </button>
                    </div>

                    <div className="tabsDiv d-flex flex-column">
                        <div className="navBar d-flex justify-content-between mt-2">
                            <ul>
                                <li onClick={() => updateToggle(1)}
                                    className={toggle === 1 ? "opentab" : "closedtab"}>Home
                                </li>
                                <li onClick={() => updateToggle(2)}
                                    className={toggle === 2 ? "opentab" : "closedtab"}>Allotment
                                </li>
                                <li onClick={() => updateToggle(3)}
                                    className={toggle === 3 ? "opentab" : "closedtab"}>File Status
                                </li>
                                <li onClick={() => updateToggle(4)}
                                    className={toggle === 4 ? "opentab" : "closedtab"}>Master of Vacancies
                                </li>
                                <li onClick={() => updateToggle(5)}
                                    className={toggle === 5 ? "opentab" : "closedtab"}>Slotting
                                </li>
                                <li onClick={() => updateToggle(6)}
                                    className={toggle === 6 ? "opentab" : "closedtab"}>GOM Management
                                </li>
                            </ul>
                            {/*<div className="fa-border">*/}
                            {/*    <BellIcon/>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                    {/*<Tabs/>*/}
                    {/*<div className={toggle=== 1 ? "opencontent" : "content"}>*/}
                    <>
                        <Analytics toggle={toggle}/>
                        <HomeTable filterString={filterString}/>

                    </>
                    {/*</div>*/}



                </Typography>
            </Main>
        </Box>
            {wantToAddNew && <div className="modal customModal">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <span>Add New</span><button type="button" className="btn-close" onClick={() => setWantToAddNew(false)}></button>
                        </div>
                        <div className="modal-body">
                            <p>Enter mobile number</p>
                            <input className="form-control" type="number" maxLength={10}/>
                        </div>
                        {/*<div className="modal-footer">*/}
                        {/*    <button type="button" className="btn btn-secondary" onClick={() => setWantToDelete(false)}>No</button>*/}
                        {/*    <button type="button" className="btn btn-primary" onClick={() => delUsers(delUser)}>Yes</button>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>}
            </>

    );
}