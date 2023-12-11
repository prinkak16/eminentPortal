import React, { useState } from 'react';
import AllotmentContext from './allotmentContext';

const AllotmentProvider = ({ children }) => {
  const [assignBreadCrums, setAssignBreadCrums] = useState(false);

  return (
    <AllotmentContext.Provider value={{ assignBreadCrums, setAssignBreadCrums }}>
      {children}
    </AllotmentContext.Provider>
  );
};

export default AllotmentProvider;

