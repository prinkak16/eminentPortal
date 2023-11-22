import React, {useEffect, useState} from "react";
import "./analytics.css"
import Usergroup from "../../../../../../../public/images/usergroup.svg";
import TotalEminent from '../../../../../../../public/images/totalEminent.svg'
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Incompletefile from './../../../../../../../public/images/incomplete.svg';
import iconUrl from './../../../../../../../public/images/plus.svg';
import {getVacancyAnalytics, statsData} from "../../../../api/eminentapis/endpoints";
const Analytics = (props) => {
    const {analyticsHeading, icon, label} = props
    const [showSeeMore, setShowSeeMore] = useState(false);
    const [homeStats,setHomeStats] = useState([]);
    useEffect(()=>{
        switch (props.tabId) {
            case '1':
                statsData().then(res => {
                    setHomeStats(res.data.data);
                })
                break;
            case '4':
                getVacancyAnalytics().then(res=>{
                    setHomeStats(res.data.data)
                })
                break;
            case '5':
                getVacancyAnalytics().then(res=>{
                    setHomeStats(res.data.data)
                })
                break;
        }
    },[])

    const createAnalyticCard = () => {
        return Object.keys(homeStats).map(value=>{
            let label = '';
            let iconType = 'svg'
            let icon = null;
                switch (props.tabId){
                    case '1':
                    switch (value) {
                        case'incomplete': {
                            label = 'Total Eminent Personality';
                            icon = <TotalEminent/>;
                            break;
                        }
                        case
                        'completed'
                        : {
                                    label = 'Total Completed Form';
                            iconType = 'png';
                            icon = 'https://storage.googleapis.com/public-saral/public_document/checklist (1) 1.png';
                            break;
                        }
                        case
                        'overall'
                        : {
                            label = 'Total Incompleted Form';
                            iconType = 'png';
                            icon = 'https://storage.googleapis.com/public-saral/public_document/IncompleteFileIcon1.png';
                            break;
                        }

                    }
                    break;
                    case '4':
                        switch (value) {
                            case'total': {
                                label = 'Total Position';
                                icon = <Incompletefile/>;
                                break;
                            }
                            case'occupied': {
                                label = 'Occupied';
                                icon = <Incompletefile/>;
                                break;
                            }
                            case'vacant': {
                                label = 'Vacant';
                                icon = <Usergroup/>;
                                break;
                            }
                        }
                        break;
                    case '5':
                        switch (value) {
                            case'total': {
                                label = 'Total Position';
                                icon = <Incompletefile/>;
                                break;
                            }
                            case'occupied': {
                                label = 'Slotted';
                                icon = <Incompletefile/>;
                                break;
                            }
                            case'vacant': {
                                label = 'Unslotted';
                                icon = <Usergroup/>;
                                break;
                            }
                        }

            }
            return <div className="col" key={value}>
               <div className="card">
                   <div className="card-body d-flex p-0">
                       <div> {iconType === 'svg' ?
                           <p className="align-middle">{icon}</p>
                           :
                           <img className={`analytics-icon-image ${label}`}src={icon} alt={label}/>
                       }
                       </div>
                       <div className="ms-4">
                           <p className="cardlabel mb-0">{label}</p>
                           <p className="cardvalue">{homeStats[value]}</p>
                       </div>
                   </div>
               </div>
           </div>
        })
    }

    return (
        <>
            <div className="analyticsDiv">
                <div className="headdiv">
                    <p className="analyticsHeading">Eminent Analytics</p>
                </div>

                <div className="d-flex grid gap-0 column-gap-4 row me-5">
                    {createAnalyticCard()}
                </div>
                <div>

                    {/*<div onClick={()=> setShowSeeMore(!showSeeMore)} className='d-flex mt-3 justify-content-end'>*/}
                    {/*    <p className="see-more-button">See More</p>*/}
                    {/*    <ExpandMoreIcon className='expandicon'/>*/}
                    {/*</div>*/}

                    { showSeeMore &&
                        <div className="card seemorecard">
                           <div className="card-body"> More Analytics </div>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}
export default Analytics;
