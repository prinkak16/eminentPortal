import React, {useContext, useEffect, useState} from "react";
import "./hometable.css";
import Phone from "./../../../../../../../public/images/phone.svg";
import {
    Backdrop,
    Button, CircularProgress,
    FormLabel,
    Grid,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import Download from "./../../../../../../../public/images/download.svg";
import Icon from "./../../../../../../../public/images/icon.svg";
import Typography from "@mui/material/Typography";
import Popper from "@mui/material/Popper";
import PopupState, {bindToggle, bindPopper} from "material-ui-popup-state";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import IdBadge from "./../../../../../../../public/images/idbadge.svg";
import SearchIcon from "./../../../../../../../public/images/search.svg";
import debounce from "lodash/debounce";
import {
    deleteMember, excel_download,
    getData,
    updateState,
} from "../../../../api/eminentapis/endpoints";
import ReactPaginate from "react-paginate";
import Modal from "react-bootstrap/Modal";
import {useNavigate} from "react-router-dom";
import {ClickAwayListener} from "@mui/base";
import {Link} from "react-router-dom";
import Analytics from "../../shared/././analytics/analytics";
import {
    calculateAge,
    capitalizeString,
    checkPermission,
    dobFormat,
    downloadFile,
    formattedDate,
    isValuePresent
} from "../../../utils";
import PhotoDialog from "../../../eminentpersonalityhome/photo-dialog/photo-dialog";
import {ApiContext} from "../../../ApiContext";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {toast} from 'react-toastify';
import DownloadButton from "../../shared/downloadbutton/downloadButton";

const HomeTable = (props) => {
    const {resetFilter, setEminentData} = useContext(ApiContext);
    const [searchedName, setSearchedName] = useState("");
    const [tableData, setTableData] = useState(null);
    const [searchId, setSearchId] = useState("");
    const [currentPage, setCurrentPage] = useState("");
    const [deleteMemberId, setDeleteMemberId] = useState(null);
    const [reasonToDelete, setReasonToDelete] = useState("");
    const [deleteDisabled, setDeleteDisabled] = useState(true);
    const [wantToChangeStatus, setWantToChangeStatus] = useState(false);
    const [reasonToUpdateState, setReasonToUpdateState] = useState("");
    const [currStatus, setCurrStatus] = useState("");
    const [currId, setCurrId] = useState("");
    const [openPhoto, setOpenPhoto] = useState(true);
    const [openList, setOpenList] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [searchType, setSearchType] = useState("");
    const navigate = useNavigate();
    const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
    const [showFreeze, setShowFreeze] = useState(false);
    const [callAnalyticsApi, setCallAnalyticsApi] = useState(false)
    const [isFetching, setIsFetching] = useState(false);
    const offset = 0;
    const limit = 10;
    const displayPhoneNumbers = (member) => {
        const displayingNumbers = member.data.mobiles.splice(0, 2);
        return displayingNumbers.map((number, index) => (
            <div className="col-md-6 text-container pe-0 ps-2.5" key={member.id}>
                {index === 0 && <Phone/>}
                <p
                    className={`ml-2 label-text ${
                        index === 0 ? "br-label first-number" : "br-label2 pt-5"
                    }`}
                >
                    {number}
                </p>
            </div>
        ));
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                event.target.id !== "list-container" &&
                event.target.id !== "list-icon-button" &&
                event.target.id !== "list-icon" &&
                event.target.id !== "submitted"
            ) {
                setOpenList(null);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);


    const deleteCurrentMember = (deleteId) => {
        setDeleteMemberId(deleteId);
    };

    useEffect(() => {
        if (reasonToDelete && reasonToDelete.length > 0) {
            setDeleteDisabled(false);
        }
    }, [reasonToDelete]);

    const updateCurrentState = (id, status) => {
        setWantToChangeStatus(true);
        setCurrId(id);
        setCurrStatus(status);
    };
    const updateCurrentStatus = () => {
        const newState = {
            id: currId,
            aasm_state: currStatus === "freeze" ? "approve" : "reject",
            rejection_reason: reasonToUpdateState,
        };
        updateState(newState)
            .then((res) => {
                setWantToChangeStatus(false);
                prepareToGetDisplayData();
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const deleteMem = () => {
        let deleteString = `id=${deleteMemberId}`;
        if (reasonToDelete && reasonToDelete.length > 0) {
            deleteString += `&reason=${reasonToDelete}`;
        }
        deleteMember(deleteString)
            .then((res) => {
                prepareToGetDisplayData();
                setDeleteMemberId(null);
                setCallAnalyticsApi(true)
                setTimeout(() => {
                    setCallAnalyticsApi(false)
                }, "1000");
            })
            .catch((err) => {
                console.log("Error With Deleting Member", err);
            });
    };

    const prepareToGetDisplayData = () => {
        let searched = props?.filterString || '';

        if (searchedName && searchedName.length > 0) {
            searched += `&query=${searchedName}`;
        }
        if (searchId && searchId.length > 0) {
            searched += `&search_by_id=${searchId}`;
        }
        let pageString = "";
        let offset = currentPage * limit;
        pageString = `&offset=${offset}&limit=${limit}`;
        tableDataDisplay(searched + pageString);
    };

    useEffect(() => {
        prepareToGetDisplayData();
    }, [searchedName, props.filterString, searchId, currentPage, resetFilter]);

    const onSearchNameId = (e, isNameSearch = true) => {
        const value = e.target.value;
        setSearchValue(value);
        setSearchType(isNameSearch ? "Name" : "id");
    };

    useEffect(() => {
        const delayedSearch = debounce(() => {
            if (searchType === "Name") {
                setSearchedName(searchValue);
            } else if (searchType === "id") {
                setSearchId(searchValue);
            }
        }, 1000);

        delayedSearch();

        return delayedSearch.cancel;
    }, [searchValue, searchType]);
    const tableDataDisplay = (searchedUser) => {
        getData(searchedUser)
            .then((res) => {
                setTableData(res);
            })
            .catch((err) => {
                setTableData(null);
                console.log(err);
            });
    };

    const openDocument = (filePath) => {
        window.open(filePath);
    };

    const handleDownload = (url) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = "ExamplePdf.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const editUser = (number, member) => {
        localStorage.setItem("eminent_number", number);
        localStorage.setItem("view_mode", "edit");
        navigate(
            {
                pathname: "/eminent_form",
            },
            {
                state: {
                    eminent_number: number,
                    user_data: member,
                    view_mode: "edit",
                },
            }
        );
    };

    const viewUser = (number, userData) => {
        localStorage.setItem("eminent_number", number);
        localStorage.setItem("view_mode", "view");
        navigate(
            {
                pathname: "/eminent_form",
            },
            {
                state: {
                    eminent_number: number,
                    user_data: userData,
                    view_mode: "view",
                },
            }
        );
    };

    const getUserProfession = (professions) => {
        if (isValuePresent(professions)) {
            const mainProfession = professions.find((profession) => profession.main_profession === true);
            return mainProfession ? mainProfession.profession : "";
        } else {
            return "";
        }
    };

    const getUserEducation = (educations) => {
        let education = "";
        for (const item in educations) {
            if (educations[item].highest_qualification) {
                return educations[item].qualification;
            }
        }
        return education;
    };

    const getAddress = (address) => {
        const customAddress = isValuePresent(address) ? address[0] : "";
        if (isValuePresent(customAddress))
            return `${presentFields(customAddress.flat)}
         ${presentFields(customAddress.street)} ${presentFields(
                customAddress.district
            )}
          ${presentFields(customAddress.state)} ${presentFields(
                customAddress.pincode,
                true
            )}`;
    };

    const presentFields = (field, isLastEntry) => {
        return isValuePresent(field)
            ? `${field}${isValuePresent(isLastEntry) ? "" : ","}`
            : "";
    };

    const showList = (id) => {
        openList === id ? setOpenList(null) : setOpenList(id);
    };

    const clearPhotoUrl = () => {
        setProfilePhotoUrl("");
    };

    const handleExcelDownload = () => {
        setIsFetching(true);
        excel_download(props.filterString).then(response => {
            setIsFetching(false);
            // Create a Blob from the binary data
            const blobData = new Blob([response.data], { type: 'application/octet-stream' });
            const fileName = 'eminent_excel_download as on ' + formattedDate(new Date())
            downloadFile(blobData, fileName);
        }).catch(error => {
            setIsFetching(false);
            toast('An error occurred while eminent download.')
        });
    }
    return (
        <>
            <Backdrop
                open={isFetching}
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}>
                <CircularProgress color="inherit"/>
            </Backdrop>
            <Analytics tabId={props.tabId} getAnalitics={callAnalyticsApi} title="Eminent Analytics"/>
            <div className=" hometable mt-4 mb-4">
                <div className="mt-4 d-flex justify-content-between ">
                    <div className="d-flex">
                        <div className="d-flex search-field">
                            <SearchIcon className="search-icon"/>
                            <input
                                className="input-field"
                                placeholder="Search by Name or Phone no."
                                onChange={(e) => onSearchNameId(e)}
                            />
                        </div>
                        <div className="d-flex search-field ms-5">
                            <SearchIcon className="search-icon"/>
                            <input
                                className="input-field "
                                placeholder="Search by ID"
                                onChange={(e) => onSearchNameId(e, false)}
                            />
                        </div>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                        <DownloadButton handleExcelDownload={handleExcelDownload}/>
                    </div>
                    {profilePhotoUrl && (
                        <PhotoDialog
                            imageUrl={profilePhotoUrl}
                            openDialogue={profilePhotoUrl}
                            onClose={clearPhotoUrl}
                        />
                    )}
                </div>
                {tableData?.data?.data?.members.length > 0 ? (
                    <div>
                        {tableData?.data?.data?.members &&
                            tableData?.data?.data?.members.map((member) => (
                                <div className="table-container mt-4" key={member.id}>
                                    <Grid container className="single-row">
                                        <Grid item xs={3} className="gridItem min-width-24rem">
                                            <div className="row">
                                                <div
                                                    className="col-md-4 pe-0"
                                                    onClick={() => setProfilePhotoUrl(member.data.photo)}
                                                >
                                                    <div className="imgdiv circle">
                                                        <img className="img" src={member.data.photo}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-8">
                                                    <h2 className="headingName">{member.data.name}</h2>
                                                    <div className="row d-flex">
                                                        {member.data?.mobiles &&
                                                            member.data?.mobiles
                                                                ?.slice(0, 2)
                                                                .map((number, index) => (
                                                                    <div
                                                                        className="col-md-6 text-container pe-0 ps-2.5"
                                                                        key={member.id}
                                                                    >
                                                                        {index === 0 && <Phone/>}
                                                                        <p
                                                                            className={`ml-2 label-text ${
                                                                                index === 0
                                                                                    ? "br-label first-number"
                                                                                    : "br-label2 pt-5"
                                                                            }`}
                                                                        >
                                                                            {number}
                                                                        </p>
                                                                    </div>
                                                                ))}
                                                        <div/>
                                                        <div className="d-flex">
                                                            <IdBadge/>
                                                            <p className="id-text">ID No. - {member.id}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid
                                            item
                                            xs
                                            className="gridItem education-profession-container"
                                        >
                                            <div className="row">
                                                <div className="col-md-6 data-display">
                                                    <p className="text-labels">Age</p>
                                                    <p>
                                                        {member.data.dob
                                                            ? `${calculateAge(
                                                                dobFormat(member.data.dob)
                                                            )} Years`
                                                            : ""}
                                                    </p>
                                                </div>
                                                <div className="col-md-6 data-display">
                                                    <p className="text-labels">Profession</p>
                                                    <p>{getUserProfession(member.data.professions)}</p>
                                                </div>
                                                <div className="col-md-6 data-display">
                                                    <p className="text-labels">Education</p>
                                                    <p>{getUserEducation(member.data.educations)}</p>
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item xs className="gridItem">
                                            <div className="row data-display">
                                                <p className="text-labels">Address</p>
                                                <p>{getAddress(member.data.address)}</p>
                                            </div>
                                        </Grid>
                                        <Grid item xs className="gridItem">
                                            <div className="row data-display">
                                                <p className="text-labels">Form Status:</p>
                                                <p>{capitalizeString(member.aasm_state)}</p>
                                            </div>
                                            <div className="row data-display">
                                                <p className="text-labels">Channel:</p>
                                                <p>{member.channel}</p>
                                            </div>
                                        </Grid>
                                        <Grid item xs className="gridItemLast">
                                            <div className="d-flex">
                                                <div className="row data-display">
                                                    <p className="text-labels">Referred by</p>
                                                    <p>{member.data.reference?.name}</p>
                                                    <p>{member.data.reference?.mobile}</p>
                                                </div>
                                                <div className="edit-box-container" id="list-container">
                                                    <p id="list-icon-button" className="popupicon">
                                                        <Icon
                                                            id="list-icon"
                                                            onClick={() => showList(member.id)}
                                                        />
                                                    </p>
                                                    {openList === member.id && (
                                                        <Paper className="home-edit-list">
                                                            <div className="edit-user-container">
                                                                <Typography
                                                                    sx={{p: 2}}
                                                                    className="tableiconlist"
                                                                >
                                                                    {checkPermission('Home', 'Edit') &&(
                                                                        <p
                                                                            onClick={() =>
                                                                                editUser(member.phone, member)
                                                                            }
                                                                        >
                                                                            Edit
                                                                        </p>
                                                                    )}
                                                                    {checkPermission('Home', 'ViewDocument') &&
                                                                    <p
                                                                        onClick={() =>
                                                                            viewUser(member.phone, member)
                                                                        }
                                                                    >
                                                                        View
                                                                    </p>
                                                                    }
                                                                    {member.data.attachment && (

                                                                        <p
                                                                            onClick={() =>
                                                                                openDocument(member.data.attachment)
                                                                            }
                                                                        >
                                                                            View Documents
                                                                        </p>
                                                                    )}
                                                                    {checkPermission('Home', 'Delete') && (
                                                                    <p
                                                                        onClick={() =>
                                                                            deleteCurrentMember(member.id)
                                                                        }
                                                                    >
                                                                        Delete
                                                                    </p>
                                                                    )}
                                                                    {member.aasm_state === "submitted" && (
                                                                        <div
                                                                            id="submitted"
                                                                            className="btn-group dropstart"

                                                                        >
                                                                            <p
                                                                                type="button"
                                                                                id="submitted"
                                                                                className="dropdown-toggle"
                                                                                data-bs-toggle="dropdown"
                                                                                data-mdb-toggle="dropdown"
                                                                                aria-expanded="false"

                                                                            >
                                                                                Freeze/ Re-edit
                                                                            </p>
                                                                            <ul className="dropdown-menu">
                                                                                {checkPermission('Home', 'Freeze') &&
                                                                                <li
                                                                                    className="ms-4"
                                                                                    onClick={() =>
                                                                                        updateCurrentState(
                                                                                            member.id,
                                                                                            "freeze"
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    Freeze
                                                                                </li>
                                                                                }
                                                                                {checkPermission('Home', 'ReEdit') &&
                                                                                <li
                                                                                    className="ms-4"
                                                                                    onClick={() =>
                                                                                        updateCurrentState(
                                                                                            member.id,
                                                                                            "re-edit"
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    Re-edit
                                                                                </li>
                                                                                }
                                                                            </ul>


                                                                        </div>
                                                                    )}
                                                                    {member.data.attachment &&  checkPermission('Home', 'Download') &&(
                                                                        <p
                                                                            onClick={() =>
                                                                                handleDownload(member.data.attachment)
                                                                            }
                                                                        >
                                                                            Download
                                                                        </p>
                                                                    )}
                                                                </Typography>
                                                            </div>
                                                        </Paper>
                                                    )}
                                                </div>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </div>
                            ))}
                    </div>
                ) : (
                    <div className="blank-eminent-container">
                        {searchValue ? (
                            <span>
                Your search - {searchValue} did not match any eminent{" "}
                                {searchType}
              </span>
                        ) : (
                            <span>No eminent found</span>
                        )}
                    </div>
                )}
            </div>
            <div>
                <p className="d-flex justify-content-center">
                    {currentPage + 1}&nbsp;of&nbsp;{" "}
                    {tableData?.data?.data.length
                        ? Math.ceil(tableData?.data?.data.length / limit)
                        : 1}
                </p>
                <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    breakLabel={"...."}
                    pageCount={Math.ceil(tableData?.data?.data.length / limit)}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={5}
                    onPageChange={(selectedPage) => setCurrentPage(selectedPage.selected)}
                    containerClassName={"pagination justify-content-end"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    breakClassName={"page-link"}
                    breakLinkClassName={"page-item"}
                    activeClassName={"active"}
                />
            </div>
            <Modal
                contentClassName="addModal"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={wantToChangeStatus}
            >
                <Modal.Body>
          <textarea
              className="ps-2 reasontext"
              rows={3}
              cols={40}
              placeholder="Write your reason here"
              onChange={(e) => setReasonToUpdateState(e.target.value)}
          />
                </Modal.Body>
                <Modal.Footer>
                    <p className="cancelbtn" onClick={() => setWantToChangeStatus(false)}>
                        Cancel
                    </p>
                    <button className="btn" onClick={() => updateCurrentStatus()}>
                        Submit
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
          <textarea
              className="ps-2 reasontext"
              rows={3}
              cols={40}
              placeholder="Write your reason here"
              onChange={(e) => setReasonToDelete(e.target.value)}
          />
                </Modal.Body>
                <Modal.Footer>
                    <p className="cancelbtn" onClick={() => setDeleteMemberId(null)}>
                        Cancel
                    </p>
                    <button
                        className="btn btn-danger"
                        disabled={deleteDisabled}
                        onClick={() => deleteMem()}
                    >
                        Delete
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
export default HomeTable;
