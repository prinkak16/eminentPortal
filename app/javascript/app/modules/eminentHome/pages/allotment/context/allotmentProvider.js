import React, { useEffect, useState } from "react";
import AllotmentContext from "./allotmentContext";

const AllotmentProvider = ({ children }) => {
  const [assignBreadCrums, setAssignBreadCrums] = useState(false);
  const [crumbsState, setCrumbsState] = useState(false);
  const [allotmentCardDetails, setAllotmentCardDetails] = useState([]);
  const [showAssignAllotmentBtn, setShowAssignAllotmentBtn] = useState([]);
  const [psuIdAllotment, setPsuIdAllotment] = useState(null);
  const [stateIdAllotment, setStateIdAllotment] = useState(null);

  return (
    <AllotmentContext.Provider
      value={{
        assignBreadCrums,
        setAssignBreadCrums,
        crumbsState,
        setCrumbsState,
        allotmentCardDetails,
        setAllotmentCardDetails,
        showAssignAllotmentBtn,
        setShowAssignAllotmentBtn,
        psuIdAllotment,
        setPsuIdAllotment,
        stateIdAllotment,
        setStateIdAllotment,
      }}
    >
      {children}
    </AllotmentContext.Provider>
  );
};

export default AllotmentProvider;
