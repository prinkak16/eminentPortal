import React, {useEffect, useRef, useState} from 'react';
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
                            console.error('Error fetching ministry data by filters:', error);
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
                    console.log(res.data.data.ministries, ' checking');
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
            console.error(error);
        }
    };


            const handleAssignedMinistryChange = (ministryIds) => {
            setAssignedMinistryIds(ministryIds);
           };


            const handleOwnMinistryChange = (ministryIds) => {
            setOwnMinistryIds(ministryIds);
           };

        const handleUpdateClick = () => {

            const ministerId = editMinisterData.ministerId;

            try {
                // Make API call for assigned ministries
                const assignedMinistriesResponse =  axios.post(
                    `/api/v1/user/${ministerId}/assign_ministries`,
                    { ministry_ids: assignedMinistryIds}

                );
                console.log('Assigned Ministries API Response:', assignedMinistriesResponse.data);

                // Make API call for own ministries after the first call is complete
                const ownMinistriesResponse =  axios.post(
                    `/api/v1/user/${ministerId}/allocate_ministries`,
                    { ministry_ids: ownMinistryIds }
                );
                console.log('Allocate Ministries API Response:', ownMinistriesResponse.data);

                // Update state or perform any other actions if needed
                // For example:
                // setAssignedMinistryIds([]);
                // setOwnMinistryIds([]);

            } catch (error) {
                console.error('Error updating ministries:', error);
                // Handle errors as needed
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
        // const test=()=>{
        //     getGOMTableData().then((response) => {
        //         setGomTableData(response.data.value);
        //         console.log('test', gomTableData)
        //     })
        // }
        // useEffect(() => {
        //     test()
        // }, []);

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
                        console.error("Error fetching minister list:", error);
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
  console.log(editMinisterData,'id');
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


    console.log(gomTableData);
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
                            <table className="mt-4">
                                <tr style={{borderBottom: "1px solid #F8F8F8", height:"50px"}}>
                                    <th style={{backgroundColor: "#F8F8F8", height:"50px"}}>S.No. </th>
                                    <th style={{backgroundColor: "#F8F8F8"}}>Minister Name</th>
                                    <th style={{backgroundColor: "#F8F8F8"}}>Assigned Ministry</th>
                                    <th style={{backgroundColor: "#F8F8F8"}}>Their own ministry</th>
                                    <th style={{backgroundColor: "#F8F8F8"}}>Assigned States</th>
                                    <th style={{backgroundColor: "#F8F8F8"}}>Action</th>
                                </tr>
                                {gomTableData.length && gomTableData.map((data, index) => {
                                    return (
                                        <tr key={data} style={{border: "2px solid #F8F8F8", padding: "5px",height:"40px"}}>
                                            <td style={{border: "2px solid #F8F8F8", padding: "5px"}}>{index + 1}</td>
                                            <td>{data.name}</td>
                                            <td>{data.assigned_ministries.length === 0 ? ' - ' : data.assigned_ministries.join(', ')}</td>
                                            <td>{data.allocated_ministries.length === 0 ? ' - ' : data.allocated_ministries.join(', ')}</td>
                                            <td>{data.assigned_states.length === 0 ? ' - ' : data.assigned_states.join(', ')}</td>
                                            <td onClick={() => handleEditClick(data)}>
                                                <EditIcon />
                                            </td>

                                        </tr>
                                    )
                                })}
                            </table>

                        </div>

                    </div>
                        <div>
                            <div>

                            <span className="d-flex justify-content-center">{currentPage + 1}&nbsp;of&nbsp;{pageCount}</span>
                            </div>
                            <ReactPaginate
                                breakLabel="..."
                                nextLabel="next >"
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
                                previousLabel="< previous"
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
                                sx={{ width: '200px'}}
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
                                        intialValue={editMinisterData.assigned_ministries}
                                        onSelectMinistries={handleAssignedMinistryChange}
                                        style={{ width: "200px", margin: 1 }}
                                    />
                                </div>
                                <div style={{ marginTop: "10px" }}>
                                    <p>Own Ministry</p>
                                    <MultipleSelectCheckmarks
                                        data={ministryData}
                                        intialValue={editMinisterData.allocated_ministries}
                                        onSelectMinistries={handleOwnMinistryChange}
                                        style={{ width: "200px", margin: 1 }}
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
