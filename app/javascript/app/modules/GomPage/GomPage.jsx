import React, {useEffect, useRef, useState} from 'react';
import ReactPaginate from 'react-paginate';
import './GomPage.scss'
// import {SearchOffOutlined, Upload} from "@mui/icons-material";
import MultipleSelectCheckmarks from "../MultipleSelectCheckmarks/MultipleSelectCheckmarks";
import RadioSelect from "../RadioSelect/RadioSelect";
import Header from "../eminentpersonalityhome/header/header";
import UploadIcon from '../../../../../public/images/upload.svg'
import UploadFile from  '../../../../../public/images/upload_file.svg'
import Modal from "react-bootstrap/Modal";
import EditIcon from "../../../../../public/images/Edit.svg"
import CloseIcon from "../../../../../public/images/CloseIcon.svg"
import axios from "axios";
import {assignMinistriesAndMinister, getGOMTableData} from "../../api/eminentapis/endpoints";
function GomPage() {
    const [gomTableData, setGomTableData] = useState([]);
    const hiddenFileInput = useRef(null);
    const [currentPage, setCurrentPage] = useState('');
    const [wantToUpload, setWantToUpload] = useState(false);
    const [wantToEdit,setWantToEdit] = useState(false);
    const [assignUpdate, setAssignUpdate] = useState(false);
    const [ministryIds, setMinistryIds] = useState([]);
    const [ministerId, setMinisterId] = useState(null);
    const [AssignId, setAssignId] = useState([]);
    const handleDownload = (url) => {
        const link = document.createElement('a');
        link.href = 'url';
        link.download = "https://storage.googleapis.com/public-saral/minister_assitant_mapping.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    useEffect(() => {
        getGOMTableData().then((response) => {
            setGomTableData(response.data.data);
        })
    }, []);

    const handleClick = event => {
        setWantToUpload(true);
    };
    const uploadFile = () => {
        hiddenFileInput.current.click();
    }
    const handleChange = event => {
        const fileUploaded = event.target.files[0];
        handleFile(fileUploaded);
    };
    const AssignUpdate = () =>{
        assignMinistriesAndMinister(ministryIds, ministerId).then(res => {
            console.log(res);
        })
    }
    const handleMinistryIds = (ministryIds) => {
        setMinistryIds(ministryIds);
    }
    const handleMinisterId = (ministerId) => {
        setMinisterId(ministerId);
    }
    console.log(gomTableData);
    return (
        <>
            <Header/>
            <div className="mainDiv">
                {/*<div>*/}
                {/*    <Filterssidebar/>*/}
                {/*</div>*/}
                <div style={{display:"flex",paddingTop:"10px",paddingLeft:"10px",gap:"40px"}}>
                    {/*<div className="main pt-2">*/}
                    <div>
                        <p className="mb-0" style={{marginLeft:"15px"}}>Ministry<span style={{color: "#BB0E0F", fontSize: "10px"}}>★</span></p>
                        <MultipleSelectCheckmarks onSelectMinistries={handleMinistryIds} />
                    </div>
                    <div>
                        <p className="mb-0" style={{marginLeft:"15px"}}> Assign to minister<span style={{color: "#BB0E0F", fontSize: "10px"}}>★</span></p>
                        <RadioSelect onSelectMinister={handleMinisterId}/>
                    </div>
                    <button className="Assign" onClick={AssignUpdate}>
                        Assign
                    </button>
                    <button className="button-upload" onClick={handleClick}>
                        <UploadIcon/> PA/OSD mapping
                    </button>
                    <input
                        type="file"
                        accept=".csv, .xlsx"
                        onChange={handleChange}
                        ref={hiddenFileInput}
                        style={{display: 'none'}}
                    />
                </div>

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
                                <img src="SearchOutline.svg" alt="" width={'30px'} height={'30px'}/>
                                <input
                                    type="text"
                                    placeholder="Search by Ministry"
                                    className="input-field"
                                    style={{width: '100%', border: 'none', color: 'black'}}
                                />
                            </div>
                            <div style={{
                                display: "flex",
                                gap: "10px",
                                border: '1px solid black',
                                borderRadius: '10px',
                                padding: '5px 15px',
                                marginTop: ''
                            }}>
                                <img src="SearchOutline.svg" alt="" width={'30px'} height={'30px'}/>
                                <input
                                    type="text"
                                    placeholder="Search by Minister"
                                    className="input-field"
                                    style={{width: '100%', border: 'none', color: 'black'}}
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
                            {gomTableData.map((data, index) => {
                                return (
                                    <tr key={data.user_id} style={{border: "2px solid #F8F8F8", padding: "5px",height:"40px"}}>
                                        <td style={{border: "2px solid #F8F8F8", padding: "5px"}}>{index + 1}</td>
                                        <td>{data.name}</td>
                                        <td>{data.assigned_ministries.length === 0 ? ' - ' : data.assigned_ministries.join(', ')}</td>
                                        <td>{data.allocated_ministries.length === 0 ? ' - ' : data.allocated_ministries.join(', ')}</td>
                                        <td>{data.assigned_states.length === 0 ? ' - ' : data.assigned_states.join(', ')}</td>
                                        <td onClick={()=> setWantToEdit(true)}><EditIcon/></td>
                                    </tr>
                                )
                            })}
                        </table>

                    </div>

                </div>
                <div >
                    <span className="d-flex justify-content-center">{currentPage + 1}&nbsp;of&nbsp;10</span>
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel="next >"
                        containerClassName={'pagination justify-content-end'}
                        onPageChange={(selectedPage) => setCurrentPage(selectedPage.selected)}
                        pageLinkClassName={'page-link'}
                        pageClassName={'page-item'}
                        previousClassName={'page-item'}
                        previousLinkClassName={'page-link'}
                        nextClassName={'page-item'}
                        nextLinkClassName={'page-link'}
                        breakClassName={'page-item'}
                        breakLinkClassName={'page-link'}
                        activeClassName={'active'}// onPageChange={handlePageClick}
                        pageRangeDisplayed={3}
                        pageCount={10}
                        previousLabel="< previous"
                    />
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
                                <input placeholder="Enter Email" type="email"/>
                                <button className="Submit" >
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
                        <MultipleSelectCheckmarks style={{width:"200px",margin:1 }}  />
                        <div style={{display:"flex"}}>
                            <div>
                                <p>Assigned Ministers</p>
                                <MultipleSelectCheckmarks  style={{width:"200px",margin:1 }} />
                            </div>
                            <div>
                                <p>Own Ministry</p>
                                <MultipleSelectCheckmarks style={{width:"200px" ,margin:1}} />
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
                        // onClick={() => navigate('/EminentPersonality')}
                        // disabled={submitDisabled}
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
