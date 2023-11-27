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

      {/* {tableData?.data?.data?.members && tableData?.data?.data?.members.map((member) => (

<div className="table-container mt-4" key={member.id}>
    <Grid container className="single-row">
        <Grid item xs={3} className="gridItem min-width-24rem">
            <div className="row">
                <div className="col-md-4 pe-0">
                    <div className='imgdiv circle'>
                        <img className='img' src={member.data.photo}/>
                    </div>
                </div>
                <div className="col-md-8">
                    <h2 className="headingName">{member.data.name}</h2>
                    <div className="row d-flex">
                        {displayPhoneNumbers(member)}
                        <div/>
                        <div className="d-flex">
                            <IdBadge/>
                            <p className="id-text">ID No. - {member.id}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Grid>
        <Grid item xs className="gridItem education-profession-container">
            <div className="row">
                <div className="col-md-6 data-display">
                    <p className="text-labels">Age</p>
                    <p>{member.data.dob ? `${calculateAge(dobFormat(member.data.dob))} Years` : ''}</p>
                </div>
                <div className="col-md-6 data-display">
                    <p className="text-labels">Profession</p>
                    <p>{getUserProfession(member.data.professions)}</p>
                </div>
                <div className="col-md-6 data-display">
                    <p className="text-labels">Education</p>
                    <p>{getUserEducation(member.data.educations)}</p>
                </div>

            </div>
        </Grid>
        <Grid item xs className="gridItem">
            <div className="row data-display">
                <p className="text-labels">Address</p>
                <p>{getAddress(member.data.address)}</p>
            </div>
        </Grid>
        <Grid item xs className="gridItem">
            <div className="row data-display">
                <p className="text-labels">Form Status:</p>
                <p>{member.aasm_state}</p>
            </div>
            <div className="row data-display">
                <p className="text-labels">Channel:</p>
                <p>{member.channel}</p>
            </div>

        </Grid>
        <Grid item xs className="gridItemLast">
            <div className="d-flex">
                <div className="row data-display">
                    <p className="text-labels">Referred by</p>
                    <p>{member.data.reference?.name}</p>
                    <p>{member.data.reference?.mobile}</p>

                </div>
               </div>
        </Grid>

    </Grid>
</div>

))} */}
    </div>
  );
}
export default AllotAssign;
