import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import ReactPaginate from "react-paginate";
import "../components/allotmentTable.css";
import SearchIcon from "../../../../../../../../public/images/search.svg";
import ArrowDownward from "../../../../../../../../public/images/si_File_download.svg";
import IconPark from "../../../../../../../../public/images/icon-park_column.svg";
import EditIcon from "../../../../../../../../public/images/Edit.svg";
import { allotmentListData } from "../../../../../api/eminentapis/endpoints";
import AllotmentContext from "../context/allotmentContext";
import { faL } from "@fortawesome/free-solid-svg-icons";

function AllotmentTable({ setAssignShow, filterString }) {
  const { crumbsState, setCrumbsState, assignBreadCrums, setAssignBreadCrums } =
    useContext(AllotmentContext);

  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const itemsPerPage = 10;

  function changeHandler(data) {
    if (data.vacant / data.total == 1) {
      setAssignShow(true);
      setAssignBreadCrums(true);
    } else {
      setAssignShow(true);
      setAssignBreadCrums(true);
    }
  }

  const searchHandeler = (e) => {
    console.log(e.target.value)
        // const searchParams = {
        //   ministry_name: e.target.value,
        //   // organization_name: searchOrganizationName,
        // }
       // allotmentListData(searchParams);
  } 
  const fetchTableData = () => {
    allotmentListData(itemsPerPage * currentPage, itemsPerPage, filterString)
      .then((res) => {
        setTableData(res?.data?.data?.value);
        setIsFetching(false);
        setPageCount(Math.ceil(res.data.data.count / itemsPerPage));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchTableData();
    setIsFetching(true);
  }, [currentPage, filterString]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  return (
    <div className="allotment-table">
      <div className="wrap">
        <div className="search-box">
          <SearchIcon className="searchIcon" />
          <input
            type="text"
            placeholder="Search by PSU or Ministry"
            className="allot-searchField"
            onChange={(e) => searchHandeler(e)}
          />
        </div>
        <button className="allot-download-btn" disabled>
          Download <ArrowDownward />
        </button>
      </div>
      <div className="table_main">
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isFetching}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        <TableContainer component={Paper} className="psutable_1">
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>S.no.</TableCell>
                <TableCell>PSU/PSB</TableCell>
                <TableCell>Ministry</TableCell>
                <TableCell>Vacancy</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>PSC Listed</TableCell>
                <TableCell className="text-center">
                  <IconPark />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((data, index) => (
                <TableRow key={index + 1}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{data.org_name}</TableCell>
                  <TableCell>{data.ministry_name}</TableCell>
                  <TableCell>
                    {data.occupied === 0
                      ? data.vacant
                      : (data.total - data.vacant) / data.total}
                  </TableCell>
                  <TableCell>{data.dept_name}</TableCell>
                  <TableCell>
                    {data.is_listed === null ? "-" : data.is_listed}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <button
                      variant="contained"
                      className={
                        data.vacant / data.total == 1
                          ? (className = "assign-button")
                          : data.vacant / data.total <= 1
                          ? (className = "update-button")
                          : (className = "update-button-green")
                      }
                      onClick={() => changeHandler(data)}
                    >
                      {data.vacant / data.total == 1 ? "Assign" : "Update"}
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <div>
          <span className="d-flex justify-content-center pageCount">
            {currentPage + 1}&nbsp;of&nbsp;{pageCount}
          </span>
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

export default AllotmentTable;
