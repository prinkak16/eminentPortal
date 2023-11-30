import React from "react";
import Header from "../../../../../eminentpersonalityhome/header/header";
import Reactangle from "../../../../../../../../../public/images/Rectangle.svg"
import Ellipse from "../../../../../../../../../public/images/Ellipse.svg"
import './AllotAssign.css'
// import '../../../hometable/hometable.css'
import HomeTable from "../../../hometable/hometable";


function AllotAssign() {
  return (
    <div>
      <div className="allot-card-container">
        <div className="allot-b1">
            <Reactangle className="icon-rect"/>
        </div>
        <div className="allot-b2">
          <div className="allot-c1">
            <div className="card-cell1">
              <span className="card-span">PSU Name</span>
              <p className="para">Law Enforcement Traning Institute</p>
            </div>
            <div className="card-cell2">
              <span className="card-span">Ministry Name</span>
              <p className="para">Ministry of Interior / Home Affairs</p>
            </div>
            <div className="card-cell3">
              <span className="card-span">Headquarter</span>
              <p className="para">New Delhi</p>
            </div>
            <div className="card-cell4">
              <span className="card-span">Vacancy</span>
              <p className="para">3</p>
            </div>
          </div>
          <div className="allot-c2">
            <span className="card-remark">Remarks</span>
            <p className="para-remark"><pre><Ellipse />   At-least one women required and 1 social worker.</pre></p>
          </div>
        </div>
      </div>

      
    </div>
  );
}
export default AllotAssign;
