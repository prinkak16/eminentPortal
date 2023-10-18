import React from "react";
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


const HomeTable = () => {
    const userFrom = {
        "success": true,
        "message": "Success.",
        "data": {
            "members": [
                {
                    "id": 1,
                    "data": {
                        "id": "",
                        "dob": "2001-01-01",
                        "name": "Test Name",
                        "caste": "Test caste",
                        "photo": "https://storage.googleapis.com/public-saral/public_document/eminent/6b8e0c86a1bd1044335a56ce037e45939f1d8ec9a0.jpg",
                        "gender": "Others",
                        "aadhaar": "",
                        "mobiles": [
                            "9879870984", '99999223772', '99999999990'
                        ],
                        "category": "SC",
                        "religion": "Islam",
                        "voter_id": "",
                        "languages": [
                            "Bengali",
                            "English"
                        ],
                        "sub_caste": "Test Sub Caste"
                    },
                    "form_type": "eminent_personality",
                    "created_by_id": 11917,
                    "country_state_id": 4,
                    "remark": null,
                    "phone": "9879870984",
                    "otp": null,
                    "otp_created_at": null,
                    "token": null,
                    "aasm_state": "submitted",
                    "rejected_by_id": null,
                    "rejected_at": null,
                    "rejected_reason": null,
                    "verified_at": null,
                    "submitted_at": "2023-10-17T12:17:18.605Z",
                    "approved_by_id": null,
                    "approved_at": null,
                    "device_info": {
                        "os": "Mac",
                        "device": "Macintosh",
                        "browser": "Chrome",
                        "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
                        "deviceType": "desktop",
                        "os_version": "mac-os-x-15",
                        "orientation": "landscape",
                        "browser_version": "117.0.0.0"
                    },
                    "version": 3,
                    "channel": "Link",
                    "is_selected": false,
                    "selected_by_id": null,
                    "selection_reason": null,
                    "deleted_by_id": null,
                    "deletion_reason": null,
                    "deleted_at": null,
                    "created_at": "2023-10-17T12:17:18.584Z",
                    "updated_at": "2023-10-17T12:17:18.607Z",
                    "country_state": {
                        "id": 4,
                        "name": "Bihar",
                        "created_at": "2019-07-29T07:00:03.168Z",
                        "updated_at": "2023-10-10T08:54:03.066Z",
                        "state_code": "BR",
                        "is_deleted": false,
                        "latitude": 25.11,
                        "longitude": 85.32,
                        "zoom": 6.5,
                        "preferences": "{\"deletion_allowed\":false,\"color\":\"#fda854\",\"alliance\":\"NDA\",\"ruling_party\":\"Lead by : JD(U)\"}",
                        "deleted_at": null,
                        "capital": null,
                        "svg_path": "",
                        "office_address": "22-M,Ashok Raj Path,Patna,Bihar-843255",
                        "level_wise_deletion": {
                            "abhiyan": {
                                "zila": "false",
                                "booth": "false",
                                "mandal": "false",
                                "vibhag": "false",
                                "pradesh": "false",
                                "national": "false",
                                "vidhan_sabha": "false",
                                "shakti_kendra": "false"
                            },
                            "karyakarta": {
                                "zila": "false",
                                "booth": "false",
                                "mandal": "false",
                                "vibhag": "false",
                                "pradesh": "false",
                                "national": "false",
                                "vidhan_sabha": "false",
                                "shakti_kendra": "false"
                            },
                            "elected_representative": {
                                "ward": "true",
                                "lok_sabha": "true",
                                "rajya_sabha": "true",
                                "vidhan_sabha": "true",
                                "gram_panchayat": "true",
                                "zila_panchayat": "true",
                                "nagar_panchayat": "true",
                                "taluka_panchayat": "true",
                                "municipal_council": "true",
                                "mlc_elected_by_mla": "true",
                                "gram_panchayat_ward": "true",
                                "lok_sabha_nominated": "false",
                                "zila_panchayat_ward": "true",
                                "municipal_corporation": "true",
                                "rajya_sabha_nominated": "false",
                                "taluka_panchayat_ward": "true",
                                "mlc_governor_nominated": "true",
                                "vidhan_sabha_nominated": "true",
                                "mlc_elected_by_the_teachers": "true",
                                "mlc_elected_by_the_graduates": "true",
                                "mlc_elected_by_the_local_bodies": "true"
                            }
                        },
                        "emblem": "https://storage.googleapis.com/public-saral/4.png"
                    }
                }
            ],
            "length": 1
        }
    }

    const displayPhoneNumbers = (member) => {
        const displayingNumbers = member.data.mobiles.splice(0, 2);
        return displayingNumbers.map((number, index) => (
            <div className="col-md-6 text-container pe-0 ps-2.5">
                {index === 0 && <Phone/>}
                <p className={`ml-2 label-text ${index === 0 ? 'br-label first-number' : 'br-label2 pt-5'}`}>{number}</p>
            </div>
        ))
    }

    return (
        <>
            <div className=" hometable mt-4">
                <div className="mt-4 d-flex justify-content-between ">
                    <div className="d-flex">
                        <input className="form-control input-field" placeholder="Search by Name or Phone no."/>
                        <input className="form-control input-field ms-4" placeholder="Search by ID"/>
                    </div>
                    <div className="d-flex me-0">
                        <input className="form-control input-field" placeholder="Person file status"/>
                        <button className="downloadBtn ms-4">Download {<Download/>}</button>
                    </div>

                </div>

                {userFrom.data.members && userFrom.data.members.map((member) => (
                    <div className="table-container mt-4">
                        {console.log(member)}
                        <Grid container className="single-row pt-2">
                            <Grid item xs={3} className="gridItem">
                                <div className="row">
                                    <div className="col-md-4">
                                        <p>img</p>
                                    </div>
                                    <div className="col-md-8">
                                        <h2 className="headingName">{member.data.name}</h2>
                                        <div className="row d-flex">
                                            {/*<div className="col-md-6 d-flex  text-container">*/}
                                            {displayPhoneNumbers(member)}
                                            {/*</div>*/}

                                            <div/>
                                            <div className="d-flex">
                                                <IdBadge/>
                                            <p className="id-text">ID-No.4126</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs className="gridItem">
                                <div className="row">
                                    <div className="col-md-6 data-display">
                                        <p className="lightP">Age</p>
                                        <p>xx Years</p>
                                    </div>
                                    <div className="col-md-6 data-display">
                                        <p className="lightP">Profession</p>
                                        <p>xx</p>
                                    </div>
                                    <div className="col-md-6 data-display">
                                        <p className="lightP">Education</p>
                                        <p>xx</p>
                                    </div>

                                </div>
                            </Grid>
                            <Grid item xs className="gridItem">
                                <div className="row data-display">
                                    <p className="lightP">Address</p>
                                    <p>Value</p>
                                </div>
                            </Grid>
                            <Grid item xs className="gridItem">
                                <div className="row data-display">
                                    <p className="lightP">Form Status</p>
                                    <p>Value</p>
                                </div>
                                <div className="row data-display">
                                    <p className="lightP">Channel</p>
                                    <p>{member.channel}</p>
                                </div>

                            </Grid>
                            <Grid item xs className="gridItemLast">
                                <div className="d-flex">
                                    <div className="row data-display">
                                        <p className="lightP">Referred by</p>
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