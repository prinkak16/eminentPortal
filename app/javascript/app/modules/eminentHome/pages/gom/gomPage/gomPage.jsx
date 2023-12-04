import React, {useEffect, useRef, useState} from 'react';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactPaginate from 'react-paginate';
import './gomPage.scss'
// import {SearchOffOutlined, Upload} from "@mui/icons-material";
import MultipleSelectCheckmarks from "../multipleSelectCheckmarks/multipleSelectCheckmarks";
import RadioSelect from "../radioSelect/radioSelect";
import UploadIcon from '../../../../../../../../public/images/upload.svg'
import UploadFile from '../../../../../../../../public/images/upload_file.svg'
import Modal from "react-bootstrap/Modal";
import EditIcon from "../../../../../../../../public/images/Edit.svg"
import CloseIcon from "../../../../../../../../public/images/CloseIcon.svg"
import SearchIcon from "../../../../../../../../public/images/SearchOutline.svg"
// import axios from "axios";
import {
    assignMinistriesAndMinister,
    getGOMTableData,
    getMinisters,
    getMinistry,
    getMinistryByFilters
} from "../../../../../api/eminentapis/endpoints"
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from '@mui/material/TextField';
function GomPage({ tabId, filterString }) {
    const [gomTableData, setGomTableData] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const hiddenFileInput = useRef(null);
    const [currentPage, setCurrentPage] = useState('');
    const [wantToUpload, setWantToUpload] = useState(false);
    const [wantToEdit,setWantToEdit] = useState(false);
    const [assignUpdate, setAssignUpdate] = useState(false);
    const [ministryIds, setMinistryIds] = useState([]);
    const [ministerId, setMinisterId] = useState(null);
    const [AssignId, setAssignId] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [ministryData, setMinistryData] = useState([]);
    const itemsPerPage= 5
    const [ministerData, setMinisterData] = useState([]);
    const [assignedMinistryIds, setAssignedMinistryIds] = useState([]);
    const [ownMinistryIds, setOwnMinistryIds] = useState([]);
    const [ministerSearch, setMinisterSearch] = useState('');
    const [ministrySearch, setMinistrySearch] = useState('');
    const [editMinisterData, setEditMinisterData] = useState({
        name: '',
        assigned_ministries: [],
        allocated_ministries: [],
        assigned_states: [],
    });


    useEffect(() => {
                const params = new URLSearchParams(filterString);
                const ministerIds = params.get('minister_ids');
                const ministryIds = params.get('ministry_ids');

                const ministerIdsArray = Array.isArray(ministerIds) ? ministerIds : [ministerIds];
                const ministryIdsArray = Array.isArray(ministryIds) ? ministryIds : [ministryIds];


        if (ministerIds || ministryIds) {
                    // API call with filter parameters
                    getMinistryByFilters({ minister_ids: ministerIdsArray, ministry_ids: ministryIdsArray })
                        .then((res) => {

                            setGomTableData(res.data.data.value);

                            // Handle other data or state updates as needed
                        })
                        .catch((error) => {
                            // Handle errors as needed
                        });
                } else {
                    // Normal API call without filters
                    getMinistry().then((res) => {
                        setMinistryData(res.data.data.ministries);
                        // Handle other data or state updates as needed
                                fetchData();
                    });
                }
                axios.get('/api/v1/gom/minister_list').then((res) => {
                    setMinisterData(res.data.data.ministries);
                    // Handle other data or state updates as n
                });


            },  [filterString, ministerSearch, ministrySearch]);

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/v1/gom/assigned_ministries', {
                params: {
                    minister_name: ministerSearch,
                    ministry_name: ministrySearch,
                    limit: itemsPerPage,
                    offset: itemsPerPage*currentPage,
                },
            });
            // Update the srch results

            setGomTableData(response?.data?.data?.value);
            setPageCount(Math.ceil( response?.data?.data?.count/ itemsPerPage));


        } catch (error) {
            // Handle errors
        }
    };


            const handleAssignedMinistryChange = (ministryIds) => {
            setAssignedMinistryIds(ministryIds);
           };


            const handleOwnMinistryChange = (ministryIds) => {
            setOwnMinistryIds(ministryIds);
           };

    const handleUpdateClick = async () => {
        const ministerId = editMinisterData.ministerId;

        // Check if both assigned and own ministry arrays are empty
        if (assignedMinistryIds.length === 0 && ownMinistryIds.length === 0) {
            toast.error("Please Update Ministries!",{ position: toast.POSITION.TOP_CENTER });
            return;
        }

        try {
            // Make API call for assigned ministries if assignedMinistryIds is not empty
            if (assignedMinistryIds.length > 0) {
                await axios.post(
                    `/api/v1/user/${ministerId}/assign_ministries`,
                    { ministry_ids: assignedMinistryIds }
                );
            }

            // Make API call for own ministries if ownMinistryIds is not empty
            if (ownMinistryIds.length > 0) {
                await axios.post(
                    `/api/v1/user/${ministerId}/allocate_ministries`,
                    { ministry_ids: ownMinistryIds }
                );
            }

            fetchData();

            // Show success toast
            toast.success('Update successful!', { position: toast.POSITION.TOP_CENTER });
        } catch (error) {
            // Handle errors and show error toast
            toast.error('Error updating ministries. Please try again.', { position: toast.POSITION.TOP_CENTER });
        }
    };


        const handleDownload = (url) => {
            const link = document.createElement('a');
            link.href = 'url';
            link.download = "https://storage.googleapis.com/public-saral/minister_assitant_mapping.csv";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };


        const handleClick = event => {
            const itemsPerPage = 5;
            setPageCount(Math.ceil(apiData.length / itemsPerPage));
        };

        const handleSubmit = () => {
            // Ensure selectedFile is not null before proceeding
            if (selectedFile) {
                // You can perform actions with the selected file, for example, include it in the request payload
                const formData = new FormData();
                formData.append('file', selectedFile);

                axios.post('/api/v1/gom/manual_upload/minister_assistant_mapping', formData)
                    .then(res => {
                        setMinisterData(res.data);
                    })
                    .catch(error => {
                        // Handle errors as needed
                    });
            }
        };

    const handleEditClick = (data) => {
        setEditMinisterData({
            ministerId: data.user_id,
            name: data.name,
            assigned_ministries: data.assigned_ministries,
            allocated_ministries: data.allocated_ministries,
            assigned_states: data.assigned_states,
        });
        setWantToEdit(true);
    };
        const uploadFile = () => {
            hiddenFileInput.current.click();
        }

        const handleChange = event => {
            const fileUploaded = event.target.files[0];
            // You can add additional logic here to validate the file if needed
            // Example: Check if the file is not null
            if (fileUploaded) {
                // You can perform actions with the file, for example, set it in state
                setSelectedFile(fileUploaded);
            }
        };

    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };


    useEffect(() => {
        fetchData();
    }, [currentPage]);


        return (
            <>
                <div className="mainDiv">
                    <div className="gomtable">
                    <br/>
                    <div className="table">
                        <div className="minister-selection">
                            <div style={{
                                display: "flex",
                                justifyContent: "start",
                                borderRadius: "8px",
                                border: "1px",
                                color: "#DEDEDE",
                                marginTop: "20px",
                                paddingTop: "10px",
                                gap: "30px"
                            }}>
                                <div style={{
                                    display: "flex",
                                    gap: "10px",
                                    border: '1px solid black',
                                    borderRadius: '10px',
                                     padding: '5px 15px',
                                    marginLeft: '20px'
                                }}>
                                    <SearchIcon width={'20px'} height={'30px'} />
                                    {/*<img src={SearchIcon} alt="" width={'30px'} height={'30px'} />*/}
                                    <input
                                        type="text"
                                        placeholder="Search by Ministry"
                                        className="input-field"
                                        style={{width: '100%', border: 'none', color: 'black'}}
                                        value={ministrySearch}
                                        onChange={(e) => setMinistrySearch(e.target.value)}
                                    />
                                </div>
                                <div style={{
                                    display: "flex",
                                    gap: "10px",
                                    border: '1px solid black',
                                    borderRadius: '10px',
                                    padding: '5px 15px',
                                }}>
                                    <SearchIcon width={'20px'} height={'30px'} />

                                    {/*<img src={SearchIcon} alt="" width={'30px'} height={'30px'}/>*/}
                                    <input
                                        type="text"
                                        placeholder="Search by Minister"
                                        className="input-field"
                                        style={{width: '100%', border: 'none', color: 'black'}}
                                        value={ministerSearch}
                                        onChange={(e) => setMinisterSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            {gomTableData.length ? (
                                <table className="mt-4" style={{ color: "#343434", fontFamily: "Barlow", fontSize: "14px", fontStyle: "normal", fontWeight: "500", lineHeight: "normal" }}>
                                    <tr style={{ borderBottom: "1px solid #F8F8F8", height: "50px" }}>
                                        <th style={{ backgroundColor: "#F8F8F8", height: "50px", textAlign: "left" }}>S.No. </th>
                                        <th style={{ backgroundColor: "#F8F8F8", textAlign: "left" }}>Minister Name</th>
                                        <th style={{ backgroundColor: "#F8F8F8", textAlign: "left" }}>Assigned Ministry</th>
                                        <th style={{ backgroundColor: "#F8F8F8", textAlign: "left" }}>Their own ministry</th>
                                        <th style={{ backgroundColor: "#F8F8F8", textAlign: "left" }}>Assigned States</th>
                                        <th style={{ backgroundColor: "#F8F8F8", textAlign: "left" }}>Action</th>
                                    </tr>
                                    {gomTableData.map((data, index) => (
                                        <tr key={data} style={{ border: "2px solid #F8F8F8", padding: "5px", height: "40px" }}>
                                            <td style={{ border: "2px solid #F8F8F8", padding: "5px", textAlign: "left" }}>{index + 1}</td>
                                            <td style={{ textAlign: "left" }}>{data.name}</td>
                                            <td style={{ textAlign: "left" }}>{data.assigned_ministries.length === 0 ? ' - ' : data.assigned_ministries.join(', ')}</td>
                                            <td style={{ textAlign: "left" }}>{data.allocated_ministries.length === 0 ? ' - ' : data.allocated_ministries.join(', ')}</td>
                                            <td style={{ textAlign: "left" }}>{data.assigned_states.length === 0 ? ' - ' : data.assigned_states.join(', ')}</td>
                                            <td onClick={() => handleEditClick(data)} style={{ cursor: 'pointer', textAlign: "left" }}>
                                                <EditIcon />
                                            </td>
                                        </tr>
                                    ))}
                                </table>
                            ) : (
                                <h5 style={{marginTop: "100px"}}>{ministrySearch || ministerSearch ? `No results found for '${ministrySearch || ministerSearch}'` : "No data available"}</h5>
                            )}

                        </div>

                    </div>
                        <div>
                            <div>
                                <span className="d-flex justify-content-center" style={{ cursor: 'pointer' }}>{currentPage + 1}&nbsp;of&nbsp;{pageCount}</span>
                            </div>
                            <ReactPaginate
                                breakLabel="..."
                                nextLabel={<span style={{ cursor: 'pointer' }}>next {'>'}</span>}
                                containerClassName={'pagination justify-content-end'}
                                onPageChange={handlePageChange}
                                pageLinkClassName={'page-link'}
                                pageClassName={'page-item'}
                                previousClassName={'page-item'}
                                previousLinkClassName={'page-link'}
                                nextClassName={'page-item'}
                                nextLinkClassName={'page-link'}
                                breakClassName={'page-item'}
                                breakLinkClassName={'page-link'}
                                activeClassName={'active'}
                                pageRangeDisplayed={3}
                                pageCount={pageCount}
                                previousLabel={<span style={{ cursor: 'pointer' }}>{'<'} previous</span>}
                            />
                        </div>
                    </div>
                </div>

                <Modal
                    // contentClassName="deleteModal"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={wantToUpload}
                >
                    <Modal.Body>
                        <div>
                            <div className="d-flex justify-content-between">
                                <h6 >Upload .csv or Excel file</h6>
                                <p style={{cursor: "pointer"}} onClick={()=> setWantToUpload(false)}><CloseIcon/></p>
                            </div>
                            <div >
                                <div className="uploadBox">
                                    <div className="d-flex justify-content-center mt-4 " style={{height:"70px", width:"70px", backgroundColor:"#D3D3D3", borderRadius:"50%", marginLeft:"200px", alignItems:"center"}}>

                                        <UploadFile onClick={()=> uploadFile()}/>
                                    </div>
                                    <p className="d-flex justify-content-center">Drag and Drop .CSV or Excel file here </p>
                                    <p className="d-flex justify-content-center">or</p>
                                    <p className="d-flex justify-content-center">Click here to upload</p>
                                    <input
                                        type="file"
                                        ref={hiddenFileInput}
                                        onChange={handleChange}
                                        style={{ display: 'none' }}
                                    />
                                    <input placeholder="Enter Email" type="email"/>
                                    <button className="Submit" onClick={handleSubmit} >
                                        Submit
                                    </button>
                                </div>
                                <p style={{marginLeft:"300px", color:"blue",cursor:"pointer"}} onClick={()=>handleDownload("url from api")}>Download sample file</p>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>

                <Modal
                    // contentClassName="deleteModal"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={wantToEdit}
                    contentClassName="update-modal"
                >
                    <Modal.Body>
                        <div>
                            <div className="d-flex justify-content-between">
                                <h3>Update</h3>
                                <p style={{cursor: "pointer"}} onClick={()=> setWantToEdit(false)}><CloseIcon/></p>
                            </div>
                            <p>Minister Name</p>
                            <Autocomplete
                                id="minister-autocomplete"
                                options={ministerData}
                                getOptionLabel={(option) => option.name}
                                value={ministerData.find((minister) => minister.id === editMinisterData.ministerId) || null}
                                disabled
                                sx={{ width: '225px', marginLeft: '5px'}}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        InputProps={{ endAdornment: <></> }}  // Set endAdornment to an empty fragment
                                    />
                                )}
                            />

                            <div style={{ display: "flex" }}>
                                <div style={{ marginTop: "10px" }}>
                                    <p>Assigned Ministries</p>
                                    <MultipleSelectCheckmarks
                                        data={ministryData}
                                        initialValue={editMinisterData?.assigned_ministries}
                                        onSelectMinistries={handleAssignedMinistryChange}
                                        style={{ width: "225px", margin: 1 }}
                                    />
                                </div>
                                <div style={{ marginTop: "10px" }}>
                                    <p>Own Ministry</p>
                                    <MultipleSelectCheckmarks
                                        data={ministryData}
                                        initialValue={ editMinisterData?.allocated_ministries}
                                        onSelectMinistries={handleOwnMinistryChange}
                                        style={{ width: "225px", margin: 1 }}
                                    />
                                </div>
                            </div>

                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            className="Cancel-btn"
                            style={{cursor: "pointer"}} onClick={()=> setWantToEdit(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="Update-btn"
                            onClick={handleUpdateClick}
                            // disabled={assignedMinistryIds.length === 0 && ownMinistryIds.length === 0}
                        >
                            Update
                        </button>
                    </Modal.Footer>
                </Modal>

                    {/*</div>*/}
                </>
            );
        }

        export default GomPage;
