import React, {useEffect, useState} from "react";
import Analytics from "../../shared/analytics/analytics";
import SearchIcon from "../../../../../../../public/images/search.svg";
import Download from "../../../../../../../public/images/download.svg";
import PhotoDialog from "../../../eminentpersonalityhome/photo-dialog/photo-dialog";
import debounce from "lodash/debounce";
import './fileStatus.scss'
import Phone from "../../../../../../../public/images/phone.svg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons";
import DialogBox from "../dailogBox/dailogBox";
import VerticalLinearStepper from "../verticalStepper/verticalStepper";

const FileStatus = () => {
    const [profilePhotoUrl, setProfilePhotoUrl] = useState('')
    const [searchValue, setSearchValue] =useState('')
    const [searchType, setSearchType] =useState('')
    const [searchedName, setSearchedName] = useState('');
    const [searchId, setSearchId] = useState('');
    const [updateStatus,setUpdateStatus] = useState(false)
    const [eminentStatus, setEminentStatus] =useState(null)
    const [openHistory, setOpenHistory] = useState(null)

    const onSearchNameId = (e, isNameSearch = true) => {
        const value = e.target.value;
        setSearchValue(value);
        setSearchType(isNameSearch ? 'Name' : 'id');
    };

    useEffect(() => {
        const delayedSearch = debounce(() => {
            if (searchType === 'Name') {
                setSearchedName(searchValue);
            } else if (searchType === 'id') {
                setSearchId(searchValue);
            }
        }, 1000);

        delayedSearch();

        return delayedSearch.cancel;
    }, [searchValue, searchType]);

    const clearPhotoUrl = () => {
        setProfilePhotoUrl('')
    }

    const fileStatus = [1, 2, 'A', 'C', 4, 'D', 'G']
    const tableData = [
        {
            id:'BJ949394PK',
            photo: 'https://images.unsplash.com/photo-1683009427513-28e163402d16?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            name:'Narendra Huda',
            mobiles: [9999222231,9999222230],
            ministry: 'Ministry Ministry of Interior / Home Affairs',
            psu: 'PSU Law Enforcement Training Institute',
            type: 'Type Maharatna',
            user_id: 'BJ949394PK',
            aasm_status:'In progress',
            file_status: '2',
            file_remarks:'The Remarks will appear here'
        },
        {
            id:'BJ949394PK',
            photo: 'https://images.unsplash.com/photo-1682687219573-3fd75f982217?q=80&w=1975&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            name:'Harendra Huda',
            mobiles: [9999222231,9999222230],
            ministry: 'Ministry Ministry of Interior / Home Affairs',
            psu: 'PSU Law Enforcement Training Institute',
            type: 'Type Maharatna',
            user_id: 'BJ949394PK',
            aasm_status:'Reject',
            file_status: '2',
            file_remarks:'The Remarks will appear here'
        },
        {
            id:'BJ949394PK',
            photo: 'https://images.unsplash.com/photo-1682695797873-aa4cb6edd613?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHw2fHx8ZW58MHx8fHx8',
            name:'Gajendra Huda',
            mobiles: [9999222231,9999222230],
            ministry: 'Ministry Ministry of Interior / Home Affairs',
            psu: 'PSU Law Enforcement Training Institute',
            type: 'Type Maharatna',
            user_id: 'BJ949394PK',
            aasm_status:'Verified',
            file_status: '2',
            file_remarks:'The Remarks will appear here'
        }

    ]

    const openDialogBox = (status) => {
        setUpdateStatus(true);
        setEminentStatus(status)
    }

    const closeDialog = () => {
        setUpdateStatus(false)
    }

    const handleUpdateDetails  = (selectedItem, input ) => {
        console.log(selectedItem, input)
    }

    const fileHistory = [
            {
                "label": "A",
                "description": "Mon Feb 07 2000 03:03:43 PM"
            },
            {
                "label": "B",
                "description": "Sun Jan 02 2005 03:05:20 AM"
            },
            {
                "label": "C",
                "description": "Mon Sep 12 1994 07:30:37 AM"
            },
            {
                "label": "D",
                "description": ""
            },
            {
                "label": "E",
                "description": ""
            }
    ]

    const showHistory = (id) => {
        if (openHistory === id) {
            setOpenHistory(null)
        } else {
            setOpenHistory(id)
        }
    }

    return (
        <div className='file-status-component'>
            <Analytics tabId={'home_table'} assignShow={true} title="File status Analytics" />
            <div className='file-status-table mt-5'>
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
                {profilePhotoUrl &&
                    <PhotoDialog imageUrl={profilePhotoUrl} openDialogue={profilePhotoUrl} onClose={clearPhotoUrl}/>
                }
                    <DialogBox openDialogue={updateStatus} list={fileStatus} onClose={closeDialog} status={eminentStatus} saveData={handleUpdateDetails}/>
            </div>
            <div className='mt-5 border pb-4'>
                {tableData && tableData.map((item, index) => (
                    <div key={index} className={`mt-4 w-95  ${index +1 !== tableData.length && 'eminent-container pb-4'}`}>
                            <p className={`eminent-status-tag ${item.aasm_status}-tag`}>{item.aasm_status}</p>
                        <div key={index * index} className='eminent-details-container d-flex'>
                            <div className='eminent-image-container ml-1rem' >
                                <img className='eminent-image' src={item.photo} alt='eminent-image'/>
                            </div>
                            <div className='eminent-initial-details'>
                                <p><b>{item.name}</b></p>
                                <div className='eminent-mobile-container'>
                                    <Phone/>
                                    {item.mobiles && item.mobiles?.slice(0, 2).map((number, index) => (
                                        <span className={`ml-2 ${index === 0 ? 'br-label eminent-first-number' : 'pt-5 ml-1rem'}`} >{number}</span>
                                    ))}
                                </div>
                                <span className='eminent-user-id'> <span className='user-id-tag'>User ID : </span>{item.id}</span>
                            </div>

                            <div className='eminent-other-details d-flex'>
                                <span className='vertical-row'></span>
                                <div className='eminent-ministry-container padding-assign'>
                                    <span className='user-id-tag d-block'>Ministry</span>
                                    <span className='fw-bold'>{item.ministry}</span>
                                </div>
                                <span className='vertical-row'></span>
                                <div className='eminent-psu-container padding-assign'>
                                    <span className='user-id-tag d-block'>PSU</span>
                                    <span className='fw-bold'>{item.psu}</span>
                                </div>
                                <span className='vertical-row'></span>
                                <div className='eminent-type-container padding-assign'>
                                    <span className='user-id-tag d-block'>PSU</span>
                                    <span className='fw-bold'>{item.type}</span>
                                </div>
                                <div className='ml-auto'>
                                    <button className='eminent-update-button' onClick={() => openDialogBox(item.file_status)
                                        }>Update</button>
                                </div>
                            </div>
                        </div>
                        <div className='d-flex mt-3'>
                            <div className='eminent-file-status ml-1rem'>
                                <span className='user-id-tag d-block'>Current Status</span>
                                <div className='d-flex mt-2'>
                                     <span className='status-btn'>
                                         <span ></span>
                                      </span>
                                    <span>{item.file_status}</span>
                                </div>
                            </div>
                            <div className='eminent-file-remark ml-1rem'>
                                <span className='user-id-tag d-block '>Remarks</span>
                                <span className='mt-2'>{item.file_remarks}</span>
                            </div>
                            <div className='ml-auto mt-auto'>
                                <button className='view-history-button' onClick={() => showHistory(item.id)}>View Application History
                                    <span
                                        className={`${openHistory === item.id ? 'rotate-180' : ''}`}><FontAwesomeIcon
                                        icon={faChevronDown}/>
                                    </span>
                                </button>
                            </div>
                        </div>
                        {openHistory === item.id &&
                            <VerticalLinearStepper stepperList={fileHistory}/>
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FileStatus