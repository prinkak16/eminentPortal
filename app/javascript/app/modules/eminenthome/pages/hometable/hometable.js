import React, {useEffect, useState} from "react";
import "./hometable.scss"
import Phone from "./../../../../../../../public/images/phone.svg"
import {Grid} from "@mui/material";
import Download from "./../../../../../../../public/images/download.svg"
import Icon from "./../../../../../../../public/images/icon.svg"
import Typography from '@mui/material/Typography';
import Popper from '@mui/material/Popper';
import PopupState, {bindToggle, bindPopper} from 'material-ui-popup-state';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import IdBadge from "./../../../../../../../public/images/idbadge.svg"
import SearchIcon from './../../../../../../../public/images/search.svg'
import {debounce} from "lodash";
import {getData} from "../../../../api/eminentapis/endpoints";


const HomeTable = (props) => {
    const [searchedName, setSearchedName] = useState('');
    const [tableData, setTableData] = useState('');
    const [searchId, setSearchId] = useState('');


    const displayPhoneNumbers = (member) => {
        const displayingNumbers = member.data.mobiles.splice(0, 2);
        return displayingNumbers.map((number, index) => (
            <div className="col-md-6 text-container pe-0 ps-2.5">
                {index === 0 && <Phone/>}
                <p className={`ml-2 label-text ${index === 0 ? 'br-label first-number' : 'br-label2 pt-5'}`}>{number}</p>
            </div>
        ))
    }
    useEffect(() => {
        let searched = props?.filterString;
        if (searchedName && searchedName.length > 0) {
            searched += `&query=${searchedName}`;
        }
        if (searchId && searchId.length > 0) {
            searched += `&search_by_id=${searchId}`;
        }
        tableDataDisplay(searched);
    }, [searchedName, props.filterString, searchId]);

    const onSearchNameId = (e, isNameSearch = true) => {
        const value = e.target.value;
        debounce(isNameSearch ? setSearchedName(value) : setSearchId(value), 500)
    }
    // const debouncedOnChange = ;
    const tableDataDisplay = (searchedUser) => {
        getData(searchedUser).then(res => {
            setTableData(res);
        }).catch(err => {
            setTableData([]);
            console.log(err);
        });
    }


    return (
        <>
            <div className=" hometable mt-4">
                <div className="mt-4 d-flex justify-content-between ">
                    <div className="d-flex">
                        <div className='d-flex search-field'>
                            <SearchIcon className='search-icon'/>
                            <input className="input-field" placeholder="Search by Name or Phone no."
                                   onChange={(e) => onSearchNameId(e)}/>
                        </div>
                        <div className='d-flex search-field ms-5'>
                            <SearchIcon className='search-icon'/>
                            <input className="input-field " placeholder="Search by ID"
                                   onChange={(e) => onSearchNameId(e, false)}/>
                        </div>
                    </div>
                    <div className="d-flex me-0 ">
                        {/*<input className="filestatusfield" placeholder="Person file status"/>*/}
                        <button className="downloadBtn ms-4">Download {<Download/>}</button>
                    </div>

                </div>

                {tableData?.data?.data?.members && tableData?.data?.data?.members.map((member) => (

                    <div className="table-container mt-4">
                        <Grid container className="single-row">
                            <Grid item xs={3} className="gridItem">
                                <div className="row">
                                    <div className="col-md-4 pe-0">
                                        <div className='imgdiv circle'>

                                            <img className='img' src={member.data.photo}/>
                                        </div>
                                    </div>
                                    <div className="col-md-8">
                                        <h2 className="headingName">{member.data.name}</h2>
                                        <div className="row d-flex">
                                            {displayPhoneNumbers(member)}
                                            <div/>
                                            <div className="d-flex">
                                                <IdBadge/>
                                                <p className="id-text">ID-No.{member.data.id}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs className="gridItem">
                                <div className="row">
                                    <div className="col-md-6 data-display">
                                        <p className="text-labels">Age</p>
                                        <p>xx Years</p>
                                    </div>
                                    <div className="col-md-6 data-display">
                                        <p className="text-labels">Profession</p>
                                        <p>xx</p>
                                    </div>
                                    <div className="col-md-6 data-display">
                                        <p className="text-labels">Education</p>
                                        <p>xx</p>
                                    </div>

                                </div>
                            </Grid>
                            <Grid item xs className="gridItem">
                                <div className="row data-display">
                                    <p className="text-labels">Address</p>
                                    <p>Value</p>
                                </div>
                            </Grid>
                            <Grid item xs className="gridItem">
                                <div className="row data-display">
                                    <p className="text-labels">Form Status</p>
                                    <p>Value</p>
                                </div>
                                <div className="row data-display">
                                    <p className="text-labels">Channel</p>
                                    <p>{member.channel}</p>
                                </div>

                            </Grid>
                            <Grid item xs className="gridItemLast">
                                <div className="d-flex">
                                    <div className="row data-display">
                                        <p className="text-labels">Referred by</p>
                                        <p>Name</p>
                                        <p>98765467</p>

                                    </div>
                                    <PopupState variant="popper" popupId="demo-popup-popper">
                                        {(popupState) => (
                                            <div>
                                                <p variant="contained" {...bindToggle(popupState)}
                                                   className="popupicon">
                                                    <Icon/>
                                                </p>
                                                <Popper {...bindPopper(popupState)} transition>
                                                    {({TransitionProps}) => (
                                                        <Fade {...TransitionProps} timeout={350}>
                                                            <Paper>
                                                                <Typography sx={{p: 2}} className="tableiconlist">
                                                                    <p>Edit</p>
                                                                    <p>View</p>
                                                                    <p>View Documents</p>
                                                                    <p>Delete</p>
                                                                    <p>Freeze / Re-edit</p>
                                                                    <p>Download</p>
                                                                </Typography>
                                                            </Paper>
                                                        </Fade>
                                                    )}
                                                </Popper>
                                            </div>
                                        )}
                                    </PopupState>
                                </div>
                            </Grid>

                        </Grid>
                    </div>

                ))}
            </div>
        </>

    )
}
export default HomeTable;