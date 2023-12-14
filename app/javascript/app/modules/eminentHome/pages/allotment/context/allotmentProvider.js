import React, { useEffect, useState } from "react";
import AllotmentContext from "./allotmentContext";

const AllotmentProvider = ({ children }) => {
  const [assignBreadCrums, setAssignBreadCrums] = useState(false);
  const [crumbsState, setCrumbsState] = useState(false);
  const [allotmentCardDetails, setAllotmentCardDetails] = useState([]);
  const [showAssignAllotmentBtn, setShowAssignAllotmentBtn] = useState([]);

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
      }}
    >
      {children}
    </AllotmentContext.Provider>
  );
};

export default AllotmentProvider;
