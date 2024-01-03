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
import Math, { debounce } from "lodash";
import { toast } from "react-toastify";

import {
  allotmentCardData,
  allotmentListData,
} from "../../../../../api/eminentapis/endpoints";
import AllotmentContext from "../context/allotmentContext";
import {checkPermission} from "../../../../utils";
function AllotmentTable({ setAssignShow, filterString }) {
  const {
    crumbsState,
    setCrumbsState,
    assignBreadCrums,
    setAssignBreadCrums,
    allotmentCardDetails,
    setAllotmentCardDetails,
    setPsuIdAllotment,
    stateIdAllotment,
    setStateIdAllotment,
  } = useContext(AllotmentContext);

  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const itemsPerPage = 10;

  function changeHandler(data, id) {
    setPsuIdAllotment(id);
    setStateIdAllotment(data.assigned_state_id);
    if (data.vacant / data.total == 1) {
      setAssignShow(true);
      setAssignBreadCrums(true);
    } else {
      setAssignShow(true);
      setAssignBreadCrums(true);
    }
  }

  const searchHandeler = debounce((e) => {
    const searchParams = {
      query: e.target.value,
    };
    allotmentListData(searchParams, filterString).then(
      (res) => {
        setTableData(res?.data?.data?.value);
        setIsFetching(false);
        setPageCount(Math.ceil(res.data.data.count / itemsPerPage));
      },
      (error) => {
        setIsFetching(false);
        setTableData([]);
        // display toast with error
      }
    );
  }, 500);

  const fetchTableData = () => {
    const tableParams = {
      offset: itemsPerPage * currentPage,
      limit: itemsPerPage,
    };

    allotmentListData(tableParams, filterString)
      .then((res) => {
        setTableData(res?.data?.data?.value);
        setIsFetching(false);
        setPageCount(Math.ceil(res.data.data.count / itemsPerPage));
      })
      .catch((error) => {
        toast(error);
        setIsFetching(false);
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

        {tableData.length === 0 ? (
          <div style={{ color: "black" }}>No PSU or Ministry found.</div>
        ) : (
          <div>
            <TableContainer component={Paper} className="psutable_1">
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>S.no.</TableCell>
                    <TableCell>PSU/PSB</TableCell>
                    <TableCell>Ministry</TableCell>
                    <TableCell>Vacancy</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Assigned State</TableCell>
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
                        {data.total - data.vacant === 0
                          ? data.total
                          : `${data.total - data.vacant}/${data.total}`}
                      </TableCell>
                      <TableCell>{data.dept_name}</TableCell>
                      <TableCell>{data.assigned_states}</TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {checkPermission('Allotment', 'Assign') &&
                          <button
                            variant="contained"
                            className={
                              data.total === data.vacant
                                ? "assign-button"
                                : data?.vacant > 0
                                ? "update-button"
                                : "update-button-green"
                            }
                            onClick={(id) => changeHandler(data, data.org_id)}
                          >
                            {data.vacant / data.total == 1 ? "Assign" : "Update"}
                          </button>
                        }
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
        )}
      </div>
    </div>
  );
}

export default AllotmentTable;
