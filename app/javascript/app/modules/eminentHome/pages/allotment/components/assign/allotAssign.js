import React, { useState, useEffect, useContext } from "react";
import Header from "../../../../../eminentpersonalityhome/header/header";
import Reactangle from "../../../../../../../../../public/images/building_icon.svg";
import Ellipse from "../../../../../../../../../public/images/Ellipse.svg";
import "./allotAssign.css";
// import '../../../hometable/hometable.css'
import HomeTable from "../../../hometable/hometable";
import SearchIcon from "../../../../../../../../../public/images/search.svg";
import { Grid } from "@mui/material";
import IdBadge from "../../../../../../../../../public/images/idbadge.svg";
import Checkbox from "@mui/material/Checkbox";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ReactPaginate from "react-paginate";
import Arrow from "../../../../../../../../../public/images/Vector.svg";
// import HisIcon from "../../../../../../../../../public/images/Vector 153.svg";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Backdrop, CircularProgress } from "@mui/material";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Pencil from "../../../../../../../../../public/images/pencil.svg";
import History from "../../../../../../../../../public/images/History.svg";
import UnassignModal from "./unassignModal";
import EllipseBlue from "../../../../../../../../../public/images/Ellipse_blue.svg";
import Frame from "../../../../../../../../../public/images/Frame.svg";
import AllotmentContext from "../../context/allotmentContext";
import { debounce } from "lodash";
import {
  allotmentEminentList,
  assignAllotment,
  getAssignedAllotment,
  allotmentHistoryData,
  allotmentCardData,
} from "../../../../../../api/eminentapis/endpoints";
import {
  calculateAge,
  dobFormat,
  isValuePresent,
  showSuccessToast,
} from "../../../../../utils";
import { toast } from "react-toastify";
import { cleanDigitSectionValue } from "@mui/x-date-pickers/internals/hooks/useField/useField.utils";

function AllotAssign() {
  const [isOpen, setIsOpen] = useState(false);
  const [dataArray, setDataArray] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [System, setSystem] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedMember, setSelectedMember] = useState([]);
  const [remark, setRemark] = useState(null);
  const [assignedData, setAssignedData] = useState([]);
  const [assignedRemark, setAssignedRemark] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [historyId, setHistoryId] = useState(null);
  const [tabSelect, setTabSelect] = useState(null);
  const [cardDetail, setCardDetail] = useState([]);
  const {
    allotmentCardDetails,
    setAllotmentCardDetails,
    showAssignAllotmentBtn,
    setShowAssignAllotmentBtn,
    psuIdAllotment,
    setPsuIdAllotment,
    stateIdAllotment,
    setStateIdAllotment,
  } = useContext(AllotmentContext);

  const cardDetails = () => {
    const params = { psu_id: psuIdAllotment, state_id: stateIdAllotment };
    allotmentCardData(params)
      .then((res) => {
        setCardDetail(res.data.data);
      })
      .catch((err) => {
        toast(err);
      });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Optional: Add smooth scrolling animation
    });
  };

  useEffect(() => {
    scrollToTop();
  }, []);
  const eminentList = () => {
    setIsFetching(true);
    const eminentParams = {
      offset: itemsPerPage * currentPage,
      limit: itemsPerPage,
    };
    allotmentEminentList(eminentParams)
      .then((res) => {
        setTableData(res.data.data.members);
        setIsFetching(false);
        setPageCount(Math.ceil(res.data.data.length / itemsPerPage));
      })
      .catch((err) => {
        toast(err);
        setIsFetching(false);
      });
  };

  useEffect(() => {
    eminentList();
  }, [currentPage]);

  useEffect(() => {
    cardDetails();
  }, []);

  const assignedList = (psuIdAllotment) => {
    const assignParams = {
      psu_id: psuIdAllotment,
    };
    getAssignedAllotment(assignParams)
      .then((res) => {
        setAssignedData(res.data.data);
        setAssignedRemark(res.data.allotment_remarks);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    assignedList(psuIdAllotment);
  }, [System, tabSelect]);

  const getHistory = (psuIdAllotment) => {
    const historyparams = {
      psu_id: psuIdAllotment,
    };
    allotmentHistoryData(historyparams)
      .then((res) => {
        setHistoryData(res.data.data);
      })
      .catch((err) => {
        toast(err);
      });
  };

  useEffect(() => {
    getHistory(psuIdAllotment);
  }, [tabSelect]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
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

  const getUserProfession = (professions) => {
    return isValuePresent(professions) ? professions[0].profession : "";
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

  const handleChangeSearch = debounce((e) => {
    const searchParams = {
      query: e.target.value,
    };

    allotmentEminentList(searchParams)
      .then((res) => {
        setTableData(res.data.data.members);
        setIsFetching(false);
        setPageCount(Math.ceil(res.data.data.length / itemsPerPage));
      })
      .catch((err) => {
        setIsFetching(false);
      });
  }, 500);

  const searchNameHandeler = (e) => {
    handleChangeSearch(e);
  };

  const handleSearch = debounce((e) => {
    const searchParams = {
      referred_by: e.target.value,
    };

    allotmentEminentList(searchParams)
      .then((res) => {
        setTableData(res.data.data.members);
        setIsFetching(false);
        setPageCount(Math.ceil(res.data.data.length / itemsPerPage));
      })
      .catch((err) => {
        setIsFetching(false);
      });
  }, 500);

  const searchReferredHandeler = (e) => {
    handleSearch(e);
  };

  const textareaHandeler = (e) => {
    setRemark(e.target.value);
  };
  const handleClose = () => setOpen(false);

  const itemsPerPage = 10;

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setTabSelect(newValue);
  };
  const toggleDrawer = (open) => () => {
    showSuccessToast(
      "You have successfull added the position in the verify section"
    );
    setIsOpen(open);
  };

  const handleModal = () => {
    const data = {
      selected_members: selectedMember,
      psu_id: psuIdAllotment,
      remarks: remark,
    };

    assignAllotment(data).then(
      (response) => {
        // setIsOpen(true);
        if (response?.data?.success) {
          eminentList();
          cardDetails();
          assignedList(psuIdAllotment);
          setDataArray([]);
          setOpen(false);
        }
        setValue(1);
        setOpen(false);
        toast(response.data.message);
      },
      (error) => {
        // setIsOpen(false);
        setOpen(false);
        toast(error.response.data.message);
      }
    );
  };

  const unassignHandeler = (id) => {
    setHistoryId(id);
    setSystem(true);
  };

  const assignedHandeler = () => {
    setIsOpen(true);
    setValue(1);
    setTabSelect(1);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "500px",
    bgcolor: "background.paper",
    border: "none",
    boxShadow: 24,
    p: 4,
    height: "465px",
    borderRadius: "5px",
  };

  const Vacancy = cardDetail?.vacant_vacancy_count;

  const crossHandeler = (e, data) => {
    setDataArray(dataArray.filter((item) => item.id !== data.id));
    setSelectedMember(selectedMember.filter((id) => id !== data.id));
  };

  const Conditional = () => {
    switch (value) {
      case 0:
        return (
          <>
            <div className="vacancy-div">
              <span>Total Vacant</span>
              <span>{Vacancy}</span>
            </div>
            <div className="table-main-container">
              {dataArray.length === 0 && (
                <span style={{ fontWeight: "500", fontSize: "larger" }}>
                  No Added Eminent.
                </span>
              )}
              {dataArray &&
                dataArray.map((member) => (
                  <div className="user-table-1">
                    <div
                      className="table-container mt-4 table-container-1 remove-border"
                      key={member.id}
                    >
                      <button
                        className="cross-btn"
                        onClick={(e) => crossHandeler(e, member)}
                      >
                        x
                      </button>
                      <Grid container className="single-row ">
                        <Grid item xs={3} className="gridItem min-width-24rem">
                          <div className="row">
                            <div className="col-md-4 pe-0">
                              <div className="imgdiv circle">
                                <img className="img" src={member.data.photo} />
                              </div>
                            </div>
                            <div className="col-md-8">
                              <h2 className="headingName">
                                {member.data.name}
                              </h2>
                              <div className="row d-flex">
                                <p>Phone : {member.phone}</p>
                                <div />
                                <div className="d-flex">
                                  <IdBadge />
                                  <p className="id-text">
                                    ID No. - {member.id}
                                  </p>
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
                              <p>
                                {getUserProfession(member.data.professions)}
                              </p>
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
                        <Grid item xs className="gridItemLast">
                          <div className="d-flex">
                            <div className="row data-display">
                              <p className="text-labels">Referred by</p>
                              <p>{member.data.reference?.name}</p>
                            </div>
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  </div>
                ))}
            </div>
            <div className="assign-all-btn-div">
              <button
                className="assign-all-btn"
                disabled={dataArray.length == 0}
                onClick={handleOpen}
              >
                {dataArray.length < 2 ? "Assign" : "Assign All"}
              </button>
            </div>
          </>
        );
        break;
      case 1:
        return (
          <>
            <br />
            <span className="remark-span">Remark</span>
            <div className="textarea-div">
              {assignedRemark?.map((data) => (
                <ul style={{ marginTop: "0", marginBottom: "0" }}>
                  <li key={data?.index} style={{ fontWeight: "400" }}>
                    {data}
                  </li>
                </ul>
              ))}

              {/* <textarea className="textarea-field"></textarea>
                <div className="btn-div">
                  <button className="update-btn-1">
                    <Pencil className="pencil" />
                  </button>
                </div> */}
            </div>
            <div className="table-main-container">
              {assignedData.length === 0 && (
                <span style={{ fontWeight: "500", fontSize: "larger" }}>
                  No Eminents Assigned yet.
                </span>
              )}
              {assignedData &&
                assignedData.map((member) => (
                  <div className="user-table-1">
                    <div
                      className="table-container mt-4 table-container-1 remove-border"
                      key={member.member_data.id}
                    >
                      <Grid container className="single-row ">
                        <Grid item xs={3} className="gridItem min-width-24rem">
                          <div className="row">
                            <div className="col-md-4 pe-0">
                              <div className="imgdiv circle">
                                <img
                                  className="img"
                                  src={member.member_data.data.photo}
                                />
                              </div>
                            </div>
                            <div className="col-md-8">
                              <h2 className="headingName">
                                {member.member_data.data.name}
                              </h2>
                              <div className="row d-flex">
                                <p>
                                  Phone : {member.member_data.data.mobiles[0]},{" "}
                                  {member.member_data.data.mobiles[1]}
                                </p>
                                <div />
                                <div className="d-flex">
                                  <IdBadge />
                                  <p className="id-text">
                                    ID No. - {member.member_data.id}
                                  </p>
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
                                {member?.member_data?.data?.dob
                                  ? `${calculateAge(
                                      dobFormat(member?.member_data.data?.dob)
                                    )} Years`
                                  : ""}
                              </p>
                            </div>
                            <div className="col-md-6 data-display">
                              <p className="text-labels">Profession</p>
                              <p>
                                {getUserProfession(
                                  member.member_data.data.professions
                                )}
                              </p>
                            </div>
                            <div className="col-md-6 data-display">
                              <p className="text-labels">Education</p>
                              <p>
                                {getUserEducation(
                                  member.member_data.data.educations
                                )}
                              </p>
                            </div>
                          </div>
                        </Grid>
                        <Grid item xs className="gridItem">
                          <div className="row data-display">
                            <p className="text-labels">Address</p>
                            <p>
                              {getAddress(member?.member_data.data?.address)}
                            </p>
                          </div>
                        </Grid>
                        <Grid item xs className="gridItemLast">
                          <div className="d-flex">
                            <div className="row data-display">
                              <p className="text-labels">Referred by</p>
                              <p>{member.member_data.data.reference?.name}</p>
                            </div>
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                    <div className="UnAssign-allotment-div">
                      <button
                        className="UnAssign-allotment-btn"
                        onClick={() => unassignHandeler(member.member_data.id)}
                      >
                        Unassign
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </>
        );
        break;
      case 2:
        return (
          <div className="allot-history-div-1">
            {historyData &&
              historyData.map((data) => {
                const isAssigned = data.allotment_status === "Assigned";
                const date = new Date(data.created_at).toLocaleString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });
                return (
                  <div className="allot-history-div" key={data?.index}>
                    <span>
                      <EllipseBlue />{" "}
                      {isAssigned &&
                        `${data.vacancy_designation} of vacancy (${data.vacancy_id}) in ${data.psu_name} is Assigned to "${data.member_name}" at ${date}`}
                      {!isAssigned &&
                        `${data.vacancy_designation} of vacancy (${data.vacancy_id}) in ${data.psu_name} ${data.allotment_status} at ${date}`}
                    </span>
                  </div>
                );
              })}
          </div>
        );
        break;

      default:
        return <h1>none</h1>;
    }
  };
  const drawerContent = (
    <Box
      sx={{
        width: 955,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      {/* Add your content here */}
      <div className="drawer-container">
        <div className="drawer-head">
          <button
            className="drawer-btn"
            onClick={() => {
              setIsOpen(false);
              setValue(0);
            }}
          >
            <Arrow className="arrow-pic" />
          </button>
          <h3>{value === 0 ? "Assign Positions" : "Assigned Positions"}</h3>
        </div>
        <div className="drawer-tab">
          <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
            <Tabs value={value} onChange={handleChange}>
              <Tab label="Added Eminent" className="assign-tab" />
              <Tab label="Assigned" className="assign-tab" />
              <Tab label={<>{<History />} History</>} className="assign-tab" />
            </Tabs>
          </Box>
        </div>
        <Conditional />
      </div>
    </Box>
  );

  const checkboxHandle = (e, data) => {
    setDataArray((prevDataArray) => {
      if (e.target.checked) {
        return [...prevDataArray, data];
      } else {
        return prevDataArray.filter((item) => item.id !== data.id);
      }
    });
    setSelectedMember((preData) => {
      if (e.target.checked) {
        return [...preData, data.id];
      } else {
        return preData.filter((id) => id !== data.id);
      }
    });
  };

  const isEqual = (item) => {
    for (let i = 0; i < dataArray.length; i++) {
      if (JSON.stringify(dataArray[i]) === JSON.stringify(item)) {
        return true;
      }
    }
    return false;
  };

  return (
    <div>
      <UnassignModal
        System={System}
        setSystem={setSystem}
        historyId={historyId}
        eminentList={eminentList}
        cardDetails={cardDetails}
        setDataArray={setDataArray}
        psuName={cardDetail?.psu_name}
      />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            {/* Add your modal content here */}
            <div>
              <div className="modal-head-123">
                <button className="cross-btn-1" onClick={() => setOpen(false)}>
                  x
                </button>
              </div>
              <div className="modal-body-123">
                <div className="modal-1">
                  <h4>Are you sure you want to assign a position?</h4>
                </div>
                <div className="modal-2">
                  <p style={{ fontWeight: "400" }}>
                    PSU Name -{" "}
                    <span style={{ fontWeight: "600" }}>
                      {cardDetail?.psu_name}
                    </span>
                  </p>
                </div>
                <div className="modal-3">
                  <textarea
                    placeholder="Write something in 50 letters..."
                    className="modal-textarea"
                    onChange={(e) => textareaHandeler(e)}
                    maxLength={75}
                  />
                </div>

                <div className="modal-4">
                  <button className="modal-btn-sure" onClick={handleModal}>
                    Sure
                  </button>
                </div>
                <div className="modal-5">
                  <button
                    className="modal-btn-cancel"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>

      <div>
        <SwipeableDrawer
          anchor="right"
          open={isOpen}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
        >
          {drawerContent}
        </SwipeableDrawer>
      </div>
      {showAssignAllotmentBtn ? (
        <div className="btn-absolute">
          <Button className="Assigned-Position-btn" onClick={assignedHandeler}>
            <big>
              <Frame className="frame-icon-allotment" /> Assigned Position
            </big>
          </Button>
        </div>
      ) : null}

      <div className="allot-card-container">
        <div className="allot-b1">
          <Reactangle className="icon-rect" />
        </div>
        <div className="allot-b2">
          <div className="allot-c1">
            <div className="card-cell1">
              <span className="card-span">PSU Name</span>
              <p className="para">{cardDetail?.psu_name}</p>
            </div>
            <div className="card-cell2">
              <span className="card-span">Ministry Name</span>
              <p className="para">{cardDetail?.ministry_name}</p>
            </div>
            <div className="card-cell3">
              <span className="card-span">Assigned State</span>
              <p className="para">{cardDetail?.location}</p>
            </div>
            <div className="card-cell4">
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span className="card-span">Total Vacancy</span>
                <p className="para">{cardDetail?.total_vacancy_count}</p>
              </div>
              {cardDetail?.total_vacancy_count -
                cardDetail?.vacant_vacancy_count !==
                0 && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span className="card-span">Assigned positions</span>
                  <p className="para">
                    {cardDetail?.total_vacancy_count -
                      cardDetail?.vacant_vacancy_count}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="allot-c2">
            <span className="card-remark">Remarks</span>
            <p className="para-remark">
              <pre>
                <Ellipse /> {cardDetail?.slotting_remark}.
              </pre>
            </p>
          </div>
        </div>
      </div>

      <div className="note-allotment-div">
        Note: Below mentioned list has names & details of “Approved
        Eminents”only.
      </div>

      <div className="middle-div">
        <div className="search-container">
          <div className="search-box search-cont-1">
            <SearchIcon className="searchIcon" />
            <input
              type="text"
              placeholder="Search by Name or phone no.,Id"
              className="allot-searchField search-field-1"
              onChange={(e) => searchNameHandeler(e)}
            />
          </div>
          <div className="search-box search-cont-2">
            <SearchIcon className="searchIcon" />
            <input
              type="text"
              placeholder="Search by Referred"
              className="allot-searchField search-field-2"
              onChange={(e) => searchReferredHandeler(e)}
            />
          </div>
        </div>

        {dataArray.length !== 0 ? (
          <button className="verify-btn" onClick={toggleDrawer(true)}>
            <big>
              {dataArray.length} Candidate selected <u>Go to verify</u>
            </big>
          </button>
        ) : null}
      </div>

      <div className="user-table">
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isFetching}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        {tableData &&
          tableData.map((member) => (
            <div className="table-container mt-4" key={member.id}>
              <Grid container className="single-row">
                <Checkbox
                  className="allotassign-checkbox"
                  disabled={dataArray.length === Vacancy && !isEqual(member)}
                  checked={isEqual(member)}
                  onChange={(e) => checkboxHandle(e, member)}
                />
                <Grid item xs={3} className="gridItem min-width-24rem">
                  <div className="row">
                    <div className="col-md-4 pe-0">
                      <div className="imgdiv circle">
                        <img className="img" src={member.data.photo} />
                      </div>
                    </div>
                    <div className="col-md-8">
                      <h2 className="headingName">{member.data.name}</h2>
                      <div className="row d-flex">
                        <p>Phone : {member.phone}</p>
                        <div />
                        <div className="d-flex">
                          <IdBadge />
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
                          ? `${calculateAge(dobFormat(member.data.dob))} Years`
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
                    <p>{member.aasm_state}</p>
                  </div>
                </Grid>
                <Grid item xs className="gridItemLast">
                  <div className="d-flex">
                    <div className="row data-display">
                      <p className="text-labels">Referred by</p>
                      <p>{member.data.reference?.name}</p>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </div>
          ))}
        <div>
          <p className="d-flex justify-content-center">
            {currentPage + 1}&nbsp;of&nbsp;{pageCount}
          </p>
          <ReactPaginate
            breakLabel="..."
            nextLabel="next >"
            containerClassName={"pagination justify-content-end"}
            onPageChange={handlePageChange}
            pageLinkClassName={"page-link"}
            pageClassName={"page-item"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
            pageRangeDisplayed={3}
            pageCount={pageCount}
            previousLabel="< previous"
          />
        </div>
      </div>
    </div>
  );
}
export default AllotAssign;
