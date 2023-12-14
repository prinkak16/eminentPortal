import React, {useEffect, useState} from "react";
import Analytics from "../../shared/analytics/analytics";
import SearchIcon from "../../../../../../../public/images/search.svg";
import PhotoDialog from "../../../eminentpersonalityhome/photo-dialog/photo-dialog";
import debounce from "lodash/debounce";
import './fileStatus.scss'
import Phone from "../../../../../../../public/images/phone.svg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons";
import DialogBox from "../dailogBox/dailogBox";
import VerticalLinearStepper from "../verticalStepper/verticalStepper";
import {isValuePresent, showErrorToast} from "../../../utils";
import axios from "axios";
import {apiBaseUrl} from "../../../../api/api_endpoints";

const FileStatus = () => {
    const [profilePhotoUrl, setProfilePhotoUrl] = useState('')
    const [searchValue, setSearchValue] =useState('')
    const [searchType, setSearchType] =useState('')
    const [searchedName, setSearchedName] = useState('');
    const [searchId, setSearchId] = useState('');
    const [updateStatus,setUpdateStatus] = useState(false)
    const [eminentStatus, setEminentStatus] =useState(null)
    const [openHistory, setOpenHistory] = useState(null)
    const [fileStatuses, setFileStatuses] =useState([])
    const [eminentData, setEminentData] = useState([])
    const [fileStatusId, setFileStatusId] =useState(null)

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

    const getFileStatuses = () => {
        return axios.get(apiBaseUrl + 'file_status/file_status_level',{
        }).then(
            (res) => {
                if (res.data.status) {
                    setFileStatuses(res.data.data)
                }
            }
        )
    }

    const getAssignedEminent = () => {
        return axios.get(apiBaseUrl + 'file_status/file_status_members',{
            params: {
                offset: 0
            }
        }).then(
            (res) => {
                if (res.data.status) {
                    setEminentData(res.data.data)
                }
            }
        )
    }

    useEffect(() => {
        getFileStatuses()
        getAssignedEminent()
    },[])


    const updateFileStatus = (fs_id, fs_description, fs_level_id) => {
        let url = '';
        const formData = new FormData();
        formData.append("fs_id", fs_id);
        formData.append("fs_description", fs_description);
        formData.append("fs_level_id", fs_level_id);

        axios.post(apiBaseUrl + 'file_status/update_file_status', formData)
            .then(response => {
                url = response;
                console.log(url);
            })
            .catch(error => {
                showErrorToast(error.response.data.message);
            });
    };


    const openDialogBox = (status, fsId) => {
        setFileStatusId(fsId)
        setUpdateStatus(true);
        setEminentStatus(status)
    }

    const closeDialog = () => {
        setFileStatusId(null)
        setUpdateStatus(false)
    }

    const handleUpdateDetails  = (selectedItem, input, fs_id) => {
        updateFileStatus(selectedItem, input, fileStatusId)
    }



    const showHistory = (id) => {
        if (openHistory === id) {
            setOpenHistory(null)
        } else {
            setOpenHistory(id)
        }
    }

    const userPhoto = (photo) => {
      return   isValuePresent(photo) ? photo :'https://storage.googleapis.com/public-saral/public_document/form_banners/certificate/images/photoIconV2.png'
    }

    return (
        <div className='file-status-component'>
            <Analytics tabId={'home'} assignShow={true} title="File status Analytics" />
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
                    <DialogBox openDialogue={updateStatus} list={fileStatuses} onClose={closeDialog} status={eminentStatus} saveData={handleUpdateDetails} fileStatusId={fileStatusId}/>
            </div>
            <div className='mt-5 border pb-4'>
                {eminentData && eminentData.map((item, index) => (
                    <div key={index} className={`mt-4 w-95  ${index +1 !== eminentData.length && 'eminent-container pb-4'}`}>
                            <p className={`eminent-status-tag ${item.file_state}-tag`}>{item.file_state}</p>
                        <div key={index * index} className='eminent-details-container d-flex'>
                            <div className='eminent-image-container ml-1rem' >
                                <img className='eminent-image' src={userPhoto(item.photo)} alt='eminent-image'/>
                            </div>
                            <div className='eminent-initial-details'>
                                <p><b>{item.name}</b></p>
                                <div className='eminent-mobile-container'>
                                    <Phone/>
                                    {item.mobiles && item.mobiles?.slice(0, 2).map((number, index) => (
                                        <span className={`ml-2 ${index === 0 ? 'eminent-first-number' : 'pt-5 ml-1rem'} ${item.mobiles.length > 1 ? 'br-label' : ''}`} >{number}</span>
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
                                    <button className='eminent-update-button' onClick={() => openDialogBox(item.file_status.status_id, item.fs_id)
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
                                    <span>{item.file_status.status}</span>
                                </div>
                            </div>
                            <div className='eminent-file-remark ml-1rem'>
                                <span className='user-id-tag d-block state-remark '>Remarks</span>
                                <span className='mt-2'>{item.file_status.description}</span>
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
                            <VerticalLinearStepper stepperList={item.file_history}/>
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FileStatus