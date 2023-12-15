import * as React from "react";
import {
  Button,
  Tab,
  Box,
  TextField,
  styled,
  InputLabel,
  Typography,
} from "@mui/material";
import HomeTable from "../../pages/hometable/hometable";
import { useState, useContext, useEffect, useRef } from "react";
import MasterVacancies from "../../pages/masterofvacancies/masterVacancies";
import "./tabs.css";
import Modal from "react-bootstrap/Modal";
import {
  fetchMobile,
  getData,
  uploadVacancy,
} from "../../../../api/eminentapis/endpoints";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import SlottingTabPage from "../../pages/slotting/slotting";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import GomPage from "../../pages/gom/gomPage/gomPage";
import Allotment from "../../../eminentHome/pages/allotment/allotment";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import UploadIcon from "../../../../../../../public/images/upload.svg";
import CloseIcon from "../../../../../../../public/images/CloseIcon.svg";
import UploadFile from "../../../../../../../public/images/upload_file.svg";
import FileStatus from "../../pages/fileStatus/fileStatus";
import Tabs from "@mui/material/Tabs";
import {checkPermission, isValuePresent, convertToCamelCase} from "../../../utils";
import AllotmentContext from "../../pages/allotment/context/allotmentContext";
import {getUserPermissions} from "../../../../api/stepperApiEndpoints/stepperapiendpoints";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function BasicTabs({
  onSwitchTab,
  filterString,
  openFilter,
  clearFilter,
}) {
  const [basicTabId, setBasicTabId] = useSearchParams({
    basicTabId: "home",
  });
  const [value, setValue] = React.useState(basicTabId.get("basicTabId"));
  const [wantToAddNew, setWantToAddNew] = useState(false);
  const [inputNumber, setInputNumber] = useState("");
  const [existingData, setExistingData] = useState(null);
  const [errorNumber, setErrorNumber] = useState("");
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [show, setShow] = useState(false);
  const [userData, setUserData] = useState();
  const [wantToUpload, setWantToUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [fileName, setFileName] = useState("");
  const [excelFile, setExcelFile] = useState();
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [eminentMsg, setEminentMsg] = useState("");
  const navigate = useNavigate();

  const [userPermissions, setUserPermissions] = useState()

  useEffect(() => {
    if (isValuePresent(localStorage.getItem('user_permissions'))) {
      setUserPermissions(JSON.parse(localStorage.getItem('user_permissions')))
      console.log(JSON.parse(localStorage.getItem('user_permissions')))
    } else  {
      getUserPermissions().then(
          (res) => {
            if (res.data.success) {
              localStorage.setItem('user_permissions', JSON.stringify(res.data.data))
              setUserPermissions(res.data.data)
            }
          }
      )
    }
  },[])
  const notify = () => toast("CSV file Uploaded successfully");
  const { assignBreadCrums, setAssignBreadCrums } =
    useContext(AllotmentContext);

  const hiddenFileInput = useRef(null);
  const handleEmailChange = (e) => {
    const inputValue = e.target.value;
    setEmail(inputValue);
    if (inputValue && isValidEmail === false) {
      setIsValidEmail(true);
    }
  };

  useEffect(() => {
    if (value !== 2) {
      setAssignBreadCrums(false);
    }
  }, [value]);
  const handleClose = () => {
    setShow(false);
    setEmail("");
    setFileName("");
  };
  const handleShow = () => setShow(true);
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleClick = (event) => {
    setWantToUpload(true);
  };

  const uploadExcel = (event) => {
    const file = event.target.files[0];
    const allowedExtensions = [".csv"];

    if (file) {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (allowedExtensions.includes("." + fileExtension)) {
        setFileName(file.name);
        setExcelFile(file);
      } else {
        alert("Please upload CSV files with .csv extension.");
      }
    }
  };
  const handleCsvfile = (filteredFiles) => {
    const file = filteredFiles[0];
    if (file) {
      setFileName(file.name);
      setExcelFile(file);
    }
  };
  const handleFileUpload = (files) => {
    // Assuming you want to handle only one file, you can access it using files[0]
    const file = files[0];

    if (file) {
      // You can set the selected file to state
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleSubmitUpload = () => {
    if (!email) {
      toast.error("Error: Please enter an email");
      return;
    }

    if (!selectedFile) {
      toast.error("Error: Please select a file to upload");
      return;
    }

    if (!validateEmail(email)) {
      setIsValidEmail(false);
      toast.error("Error: Please enter a valid email");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    fetch(
      `/api/v1/gom/manual_upload/minister_assistant_mapping?email=${email}`,
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast.success("File uploaded successfully");
        } else {
          toast.error("Error: Please upload Valid File");
          setSelectedFile(null);
        }
      })
      .catch((error) => {
        // Handle other errors if needed
        toast.error("Error during file upload");
      })
      .finally(() => {
        // Close the modal or perform any cleanup
        setWantToUpload(false);
        setSelectedFile(null);
        setEmail(""); // Reset email holder to an empty string
      });
  };

  const handleSubmit = () => {
    if (excelFile && validateEmail(email)) {
      setIsValidEmail(true);
      const formData = new FormData();
      formData.append("file", excelFile);
      formData.append("email", email);
      uploadVacancy(formData).then((response) => response.json());
      setShow(false);
      notify();
      setEmail("");
      setFileName("");
    } else {
      setIsValidEmail(false);
    }
  };
  const fileUrl =
    "https://storage.googleapis.com/public-saral/mapping_vacancy.csv";
  const downloadSampleVacancy = () => {
    window.open(fileUrl, "_blank");
  };
  const isValidNumber = (number) => {
    const regex = /^[5-9]\d{9}$/;
    return regex.test(number);
  };

  const uploadFile = () => {
    hiddenFileInput.current.value = null;
    hiddenFileInput.current.click();
  };
  const changeInputNumber = (number) => {
    setInputNumber(number.replace(/[^0-9]/g, ""));
    setEminentMsg("");
    if (number && number.length === 10 && isValidNumber(number)) {
      fetchMobile(number)
        .then((res) => {
          setEminentMsg(res.data?.message);
          setUserData(res?.data?.data);
          setSubmitDisabled(false);
        })
        .catch((err) => {
          setSubmitDisabled(true);
          setEminentMsg(err.response.data.message);
        });
      setSubmitDisabled(true);
    } else if (number && number.length === 10 && !isValidNumber(number)) {
      setEminentMsg("Please enter a valid number");
    }
    setExistingData(null);
    setSubmitDisabled(!number || number.length < 10 || !isValidNumber(number));
  };
  const handleChange = (event, newValue) => {
    if (checkPermission('Eminent', convertToCamelCase(newValue))) {
      handleBasicTabChange({ basicTabId: newValue });
      setValue(newValue);
      onSwitchTab(newValue);
    }
  };

  const handleDownload = () => {
    const url =
      "https://storage.googleapis.com/public-saral/minister_assitant_mapping_o.csv";
    window.location.href = url;
  };

  const navigateForm = () => {
    localStorage.setItem("eminent_number", userData.phone);
    navigate(
      {
        pathname: "/eminent_form",
      },
      {
        state: {
          eminent_number: userData.phone,
          user_data: userData,
        },
      }
    );
  };

  const cancelAddNew = () => {
    setWantToAddNew(false);
    setInputNumber("");
    setEminentMsg("");
  };

  const handleChangeUpload = (event) => {
    const fileUploaded = event.target.files[0];
    handleFile(fileUploaded);
  };

  const handleFile = (file) => {
    setSelectedFile(file);
  };

  let buttonContent;
  if (value === "home") {
    if (isValuePresent(!openFilter)) {
      buttonContent = (
        <button className="addNewBtn" onClick={() => setWantToAddNew(true)}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6V11H6C5.44772 11 5 11.4477 5 12C5 12.5523 5.44772 13 6 13H11V18C11 18.5523 11.4477 19 12 19C12.5523 19 13 18.5523 13 18V13H18C18.5523 13 19 12.5523 19 12C19 11.4477 18.5523 11 18 11H13V6Z"
              fill="white"
            />
          </svg>
          Add New
        </button>
      );
    } else {
      buttonContent = null;
    }
  } else if (value === "master_of_vacancies") {
    if (!isValuePresent(openFilter)) {
      buttonContent = (
        <>
          <Button
            className="downloadBtn"
            variant="primary"
            onClick={handleShow}
          >
            <ArrowUpwardIcon /> Upload CSV File
          </Button>

          <Modal
            show={show}
            onHide={handleClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Upload CSV File
              </Modal.Title>
            </Modal.Header>
            <Modal.Body
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDragLeave={(e) => {}}
              onDrop={(e) => {
                e.preventDefault();
                const files = e.dataTransfer.files;
                const allowedFileTypes = ["csv"];
                const filteredFiles = Array.from(files).filter((file) => {
                  const fileType = file.name.split(".").pop().toLowerCase();
                  return allowedFileTypes.includes(fileType);
                });
                handleCsvfile(filteredFiles);
              }}
            >
              <ToastContainer />
              <div className="excel-upload d-flex align-items-center flex-column w-100">
                <div className="upload-excel-button d-flex flex-column">
                  <Button component="label" variant="contained">
                    <div className="excel-icon-name">
                      <span className="material-icons">
                        <UploadFile />
                      </span>
                      <div id="excel-file-name">{fileName}</div>
                    </div>
                    <VisuallyHiddenInput
                      accept=".csv"
                      onChange={uploadExcel}
                      type="file"
                    />
                    <br />
                    <Typography>Drag and Drop CSV file here </Typography>
                    <Typography>or</Typography>
                    <Typography>
                      <b>click here to upload</b>
                    </Typography>
                  </Button>
                  <TextField
                    variant="outlined"
                    placeholder="Enter email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    error={!isValidEmail}
                    helperText={
                      !isValidEmail
                        ? "No CSV file selected or Invalid email format "
                        : ""
                    }
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn" onClick={handleClose}>
                Cancel
              </button>
              <button
                className="btn addNewSubmit"
                onClick={() => handleSubmit()}
              >
                Submit
              </button>
              <button className="btn" onClick={downloadSampleVacancy}>
                Download sample file
              </button>
            </Modal.Footer>
          </Modal>
        </>
      );
    } else {
      buttonContent = null;
    }
  } else if (value === "gom_management") {
    if (!isValuePresent(openFilter)) {
      buttonContent = (
        <>
          <button className="button-upload" onClick={handleClick}>
            <UploadIcon /> PA/OSD mapping
          </button>
          <input
            key={wantToUpload}
            type="file"
            accept=".csv, .xlsx"
            onChange={handleChangeUpload}
            ref={hiddenFileInput}
            style={{ display: "none" }}
          />
          <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={wantToUpload}
          >
            <Modal.Body
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDragLeave={(e) => {}}
              onDrop={(e) => {
                e.preventDefault();
                const files = e.dataTransfer.files;
                handleFileUpload(files);
              }}
            >
              <div>
                <div className="d-flex justify-content-between">
                  <h6>Upload .csv or Excel file</h6>
                  <p
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setWantToUpload(false);
                      setSelectedFile(null);
                      handleEmailChange({ target: { value: "" } });
                    }}
                  >
                    <CloseIcon />
                  </p>
                </div>
                <div>
                  <div className="uploadBox">
                    <div
                      onClick={() => uploadFile()}
                      style={{ cursor: "pointer" }}
                    >
                      <div
                        className="d-flex justify-content-center mt-4 "
                        style={{
                          height: "70px",
                          width: "70px",
                          backgroundColor: "#D3D3D3",
                          borderRadius: "50%",
                          marginLeft: "200px",
                          alignItems: "center",
                        }}
                      >
                        <UploadFile style={{ cursor: "pointer" }} />
                      </div>

                      <p
                        className="d-flex justify-content-center"
                        style={{ cursor: "pointer" }}
                      >
                        Drag and Drop .CSV or Excel file here{" "}
                      </p>
                      <p
                        className="d-flex justify-content-center"
                        style={{ cursor: "pointer" }}
                      >
                        or
                      </p>
                      <p
                        className="d-flex justify-content-center"
                        style={{ cursor: "pointer" }}
                      >
                        Click here to upload
                      </p>
                      {selectedFile && (
                        <p style={{ marginLeft: "50px", color: "green" }}>
                          Selected File: {selectedFile.name}
                        </p>
                      )}
                    </div>
                    <input
                      placeholder="Enter Email"
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(e)}
                      required
                      style={{ width: "300px", marginLeft: "15px" }} // Adjust the width value as needed
                    />
                    <button
                      style={{ marginLeft: "20px" }}
                      className="Submit"
                      onClick={handleSubmitUpload}
                    >
                      Submit
                    </button>
                  </div>
                  <p
                    style={{
                      marginLeft: "300px",
                      color: "blue",
                      cursor: "pointer",
                    }}
                    onClick={() => handleDownload()}
                  >
                    Download sample file
                  </p>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </>
      );
    } else {
      buttonContent = null;
    }
  } else if (value === "file_status") {
    buttonContent = null;
  }


    const handleBasicTabChange = (basicTabValue) => {
        setBasicTabId(basicTabValue);
    };

  const AntTabs = styled(Tabs)({
    borderBottom: "1px solid #e8e8e8",
    "& .MuiTabs-indicator": {},
  });

  const AntTab = styled((props) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
      textTransform: "none",
      minWidth: 0,
      [theme.breakpoints.up("sm")]: {
        minWidth: 0,
      },
      fontWeight: theme.typography.fontWeightRegular,
      marginRight: theme.spacing(1),
      color: "rgba(0, 0, 0, 0.85)",
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
      "&.Mui-selected": {
        backgroundColor: "#383737",
        color: "#fff",
        fontWeight: theme.typography.fontWeightMedium,
      },
      "&.Mui-focusVisible": {
        backgroundColor: "#d1eaff",
      },
    })
  );

  const tabsView = () => {
    return ( <TabList onChange={handleChange} aria-label="lab API tabs example" className='testing-tabList'>
                {checkPermission('Eminent','Home') && <Tab label="Home" value="home"/>}
                {checkPermission('Eminent','Allotment') && <Tab label="Allotment" value="allotment"/>}
                {checkPermission('Eminent','FileStatus') && <Tab label="File Status" value="file_status"/>}
                {checkPermission('Eminent','MasterOfVacancies') && <Tab label="Master of Vacancies" value="master_of_vacancies"/>}
                {checkPermission('Eminent','Slotting') && <Tab label="Slotting" value="slotting"/>}
                {checkPermission('Eminent','GomManagement') && <AntTab label="GoM MANAGEMENT" value="gom_management"/>}
          </TabList>)
  }

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box
            sx={{ borderBottom: 1, borderColor: "divider" }}
            className="hometabs d-flex justify-content-between align-items-center"
          >
            {tabsView()}
            {buttonContent}
          </Box>
          <TabPanel value="home">
            <HomeTable
              filterString={filterString}
              tabId={value}
              clearFilter={clearFilter}
            />
          </TabPanel>

          <TabPanel value="allotment">
            <Allotment filterString={filterString} tabId={value} />
          </TabPanel>
          <TabPanel value="file_status">
            <FileStatus filterString={filterString} tabId={value} />
          </TabPanel>
          <TabPanel value="master_of_vacancies">
            <MasterVacancies filterString={filterString} tabId={value} />
          </TabPanel>
          <TabPanel value="slotting">
            <SlottingTabPage filterString={filterString} tabId={value} />
          </TabPanel>
          <TabPanel value="gom_management">
            <GomPage
              filterString={filterString}
              clearFilter={clearFilter}
              tabId={value}
            />
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
          <label>
            Mobile Number<span className="text-danger">*</span>
          </label>
          <input
            className="addNewInput ps-2"
            type="tel"
            maxLength={10}
            value={inputNumber}
            placeholder="Enter mobile number"
            onChange={(e) => changeInputNumber(e.target.value)}
          />
          {eminentMsg && <span>{eminentMsg}</span>}
          {errorNumber && errorNumber.length > 0 && <span>{errorNumber}</span>}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn" onClick={cancelAddNew}>
            Cancel
          </button>
          <button
            className="btn addNewSubmit"
            onClick={navigateForm}
            disabled={submitDisabled}
          >
            Submit
          </button>
        </Modal.Footer>
      </Modal>
    </Box>
  );
}
