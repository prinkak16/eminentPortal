import React, { useEffect, useState } from "react";
import AllotmentContext from "./allotmentContext";

const AllotmentProvider = ({ children }) => {
  const [assignBreadCrums, setAssignBreadCrums] = useState(false);
  const [crumbsState, setCrumbsState] = useState(false);

  return (
    <AllotmentContext.Provider
      value={{
        assignBreadCrums,
        setAssignBreadCrums,
        crumbsState,
        setCrumbsState,
      }}
    >
      {children}
    </AllotmentContext.Provider>
  );
};

export default AllotmentProvider;
