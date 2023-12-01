import React, { useState } from "react";
import Header from "../../../../../eminentpersonalityhome/header/header";
import Reactangle from "../../../../../../../../../public/images/Rectangle.svg";
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
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Pencil from "../../../../../../../../../public/images/pencil.svg";

function AllotAssign() {
  const [isOpen, setIsOpen] = useState(false);
  const [dataArray, setDataArray] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    console.log(open);
  };

  console.log(open);
  const handleClose = () => setOpen(false);

  const limit = 5;

  const [value, setValue] = useState(0);
  console.log(value);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleDrawer = (open) => () => {
    setIsOpen(open);
  };

  const handleModal = () => {
    setIsOpen(true);
    setValue(1);
    setOpen(false);
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

  const Vacancy = 3;

  const crossHandeler = (e, data) => {
    setDataArray(dataArray.filter((item) => item.id !== data.id));
  };

  const Conditional = () => {
    switch (value) {
      case 0:
        return (
          <>
            <div className="vacancy-div">
              <span>Total Vacancy</span>
              <span>{Vacancy}</span>
            </div>
            <div className="table-main-container">
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
                                <img className="img" src={member.profile} />
                              </div>
                            </div>
                            <div className="col-md-8">
                              <h2 className="headingName">{member.name}</h2>
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
                              <p>{member.age}</p>
                            </div>
                            <div className="col-md-6 data-display">
                              <p className="text-labels">Profession</p>
                              <p>{member.profession}</p>
                            </div>
                            <div className="col-md-6 data-display">
                              <p className="text-labels">Education</p>
                              <p>{member.education}</p>
                            </div>
                          </div>
                        </Grid>
                        <Grid item xs className="gridItem">
                          <div className="row data-display">
                            <p className="text-labels">Address</p>
                            <p>{member.address}</p>
                          </div>
                        </Grid>
                        <Grid item xs className="gridItemLast">
                          <div className="d-flex">
                            <div className="row data-display">
                              <p className="text-labels">Referred by</p>
                              <p>{member.referredBy}</p>
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
            <div className="Remark-div">
              <span className="remark-span">Remark</span>
              <div className="textarea-div">
              <textarea className="textarea-field"></textarea>
              <div className="btn-div">
              <button className="update-btn-1"><Pencil className="pencil"/></button>
              </div>
              
              </div>
              
            </div>
          </>
        );
        break;

      case 2:
        return <h1>History</h1>;
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
          <button className="drawer-btn" onClick={() => setIsOpen(false)}>
            <Arrow className="arrow-pic" />
          </button>
          <h3>Assign positions</h3>
        </div>
        <div className="drawer-tab">
          <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
            <Tabs value={value} onChange={handleChange}>
              <Tab label="Added Eminent" className="assign-tab" />
              <Tab label="Assigned" className="assign-tab" />
              <Tab label="History" className="assign-tab" />
            </Tabs>
          </Box>
        </div>
        <Conditional />
      </div>
    </Box>
  );

  const tableData = [
    {
      name: "Narendra Huda",
      phone: 8656457625,
      id: 4121,
      age: "44 years",
      profession: "Doctor",
      education: "MBBS",
      address: "2641, Tower f, 12th Avenue, Gaur city 2 Andhara Pradesh",
      formStatus: "complete",
      referredBy: "Shri Ratan Dubey",
      profile: "/",
    },
    {
      name: "Narendra Huda",
      phone: 8656457625,
      id: 4122,
      age: "44 years",
      profession: "Doctor",
      education: "MBBS",
      address: "2641, Tower f, 12th Avenue, Gaur city 2 Andhara Pradesh",
      formStatus: "complete",
      referredBy: "Shri Ratan Dubey",
      profile: "/",
    },
    {
      name: "Narendra Huda",
      phone: 8656457625,
      id: 4123,
      age: "44 years",
      profession: "Doctor",
      education: "MBBS",
      address: "2641, Tower f, 12th Avenue, Gaur city 2 Andhara Pradesh",
      formStatus: "complete",
      referredBy: "Shri Ratan Dubey",
      profile: "/",
    },
    {
      name: "Narendra Huda",
      phone: 8656457625,
      id: 4124,
      age: "44 years",
      profession: "Doctor",
      education: "MBBS",
      address: "2641, Tower f, 12th Avenue, Gaur city 2 Andhara Pradesh",
      formStatus: "complete",
      referredBy: "Shri Ratan Dubey",
      profile: "/",
    },
    {
      name: "Narendra Huda",
      phone: 8656457625,
      id: 4125,
      age: "44 years",
      profession: "Doctor",
      education: "MBBS",
      address: "2641, Tower f, 12th Avenue, Gaur city 2 Andhara Pradesh",
      formStatus: "complete",
      referredBy: "Shri Ratan Dubey",
      profile: "/",
    },
  ];

  const checkboxHandle = (e, data) => {
    setDataArray((prevDataArray) => {
      if (e.target.checked) {
        return [...prevDataArray, data];
      } else {
        return prevDataArray.filter((item) => item.id !== data.id);
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
                      Law Enforcement Training Institute
                    </span>
                  </p>
                </div>
                <div className="modal-3">
                  <textarea
                    placeholder="Write something…"
                    className="modal-textarea"
                  />
                </div>

                <div className="modal-4">
                  <button className="modal-btn-sure" onClick={handleModal}>
                    Sure
                  </button>
                </div>
                <div className="modal-5">
                  <button className="modal-btn-cancel">Cancel</button>
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
      <div className="allot-card-container">
        <div className="allot-b1">
          <Reactangle className="icon-rect" />
        </div>
        <div className="allot-b2">
          <div className="allot-c1">
            <div className="card-cell1">
              <span className="card-span">PSU Name</span>
              <p className="para">Law Enforcement Traning Institute</p>
            </div>
            <div className="card-cell2">
              <span className="card-span">Ministry Name</span>
              <p className="para">Ministry of Interior / Home Affairs</p>
            </div>
            <div className="card-cell3">
              <span className="card-span">Headquarter</span>
              <p className="para">New Delhi</p>
            </div>
            <div className="card-cell4">
              <span className="card-span">Vacancy</span>
              <p className="para">{Vacancy}</p>
            </div>
          </div>
          <div className="allot-c2">
            <span className="card-remark">Remarks</span>
            <p className="para-remark">
              <pre>
                <Ellipse /> At-least one women required and 1 social worker.
              </pre>
            </p>
          </div>
        </div>
      </div>

      <div className="middle-div">
        <div className="search-container">
          <div className="search-box search-cont-1">
            <SearchIcon className="searchIcon" />
            <input
              type="text"
              placeholder="Search by Name or phone no.,Id"
              className="allot-searchField search-field-1"
            />
          </div>
          <div className="search-box search-cont-2">
            <SearchIcon className="searchIcon" />
            <input
              type="text"
              placeholder="Search by Referred"
              className="allot-searchField search-field-2"
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
                        <img className="img" src={member.profile} />
                      </div>
                    </div>
                    <div className="col-md-8">
                      <h2 className="headingName">{member.name}</h2>
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
                      <p>{member.age}</p>
                    </div>
                    <div className="col-md-6 data-display">
                      <p className="text-labels">Profession</p>
                      <p>{member.profession}</p>
                    </div>
                    <div className="col-md-6 data-display">
                      <p className="text-labels">Education</p>
                      <p>{member.education}</p>
                    </div>
                  </div>
                </Grid>
                <Grid item xs className="gridItem">
                  <div className="row data-display">
                    <p className="text-labels">Address</p>
                    <p>{member.address}</p>
                  </div>
                </Grid>
                <Grid item xs className="gridItem">
                  <div className="row data-display">
                    <p className="text-labels">Form Status:</p>
                    <p>{member.formStatus}</p>
                  </div>
                </Grid>
                <Grid item xs className="gridItemLast">
                  <div className="d-flex">
                    <div className="row data-display">
                      <p className="text-labels">Referred by</p>
                      <p>{member.referredBy}</p>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </div>
          ))}
        <div>
          <p className="d-flex justify-content-center">
            {currentPage + 1}&nbsp;of&nbsp;{" "}
            {tableData.length ? Math.ceil(tableData.length / limit) : ""}
          </p>
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"...."}
            pageCount={Math.ceil(tableData.length / limit)}
            marginPagesDisplayed={1}
            pageRangeDisplayed={5}
            onPageChange={(selectedPage) =>
              setCurrentPage(selectedPage.selected)
            }
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
      </div>
    </div>
  );
}
export default AllotAssign;
