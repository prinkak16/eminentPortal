import React, {useEffect, useState} from "react";
import "./analytics.css"
import Usergroup from "../../../../../../../public/images/usergroup.svg";
import TotalEminent from '../../../../../../../public/images/totalEminent.svg'
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Incompletefile from './../../../../../../../public/images/incomplete.svg';
import iconUrl from './../../../../../../../public/images/plus.svg';
import TotalVacancy from './../../../../../../../public/images/total-mov.svg'
import OccupiedVacancy from './../../../../../../../public/images/occupied-mov.svg'
import VacantVacancy from './../../../../../../../public/images/vacant_mov.svg'
import {getSlottingAnalytics, getVacancyAnalytics, statsData} from "../../../../api/eminentapis/endpoints";
import Tooltip from "@mui/material/Tooltip";
const Analytics = (props) => {
    const {analyticsHeading, icon, label} = props
    const [showSeeMore, setShowSeeMore] = useState(false);
    const [homeStats,setHomeStats] = useState([]);
    useEffect(()=>{
        switch (props.tabId) {
            case 'home_table':
                statsData().then(res => {
                    setHomeStats(res.data.data);
                })
                break;
            case 'allotment':
                statsData().then(res => {
                    setHomeStats(res.data.data);
                })
                break;
            case 'master_of_vacancies':
                getVacancyAnalytics().then(res=>{
                    setHomeStats(res.data.data)
                })
                break;
            case 'slotting':
                getSlottingAnalytics().then(res=>{
                    setHomeStats(res.data.data)
                })
                break;
        }
    },[])

    const tooltipTitle =
        {
            'Total Eminent Personality': 'Total count of eminents.',
            'Total Completed Form': 'Forms which are submitted.',
            'Total Incompleted Form': 'Forms with empty mandatory fields.'
        }

    const createAnalyticCard = () => {
        return Object.keys(homeStats).map(value=>{
            let label = '';
            let iconType = 'svg'
            let icon = null;
                switch (props.tabId){
                    case 'home_table':
                    switch (value) {
                        case'overall': {
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
                        'incomplete'
                        : {
                            label = 'Total Incompleted Form';
                            iconType = 'png';
                            icon = 'https://storage.googleapis.com/public-saral/public_document/IncompleteFileIcon1.png';
                            break;
                        }

                    }
                    break;

                    case 'allotment':
                        switch (value) {
                            case'incomplete': {
                                label = 'Total Slotted Position';
                                icon = <Incompletefile/>;
                                break;
                            }
                            case
                            'completed'
                            : {
                                label = 'Assigned';
                                icon = <TotalEminent/>;
                                break;
                            }
                            case
                            'overall'
                            : {
                                label = 'Yet to assign';
                                icon = <Usergroup/>;
                                break;
                            }

                        }
                        break;

                    case 'master_of_vacancies':
                        switch (value) {
                            case'total': {
                                label = 'Total Position';
                                icon = <TotalVacancy/>;
                                break;
                            }
                            case'occupied': {
                                label = 'Occupied';
                                icon = <OccupiedVacancy/>;
                                break;
                            }
                            case'vacant': {
                                label = 'Vacant';
                                icon = <VacantVacancy/>;
                                break;
                            }
                        }
                        break;
                    case 'slotting':
                        switch (value) {
                            case'total': {
                                label = 'Total Position';
                                icon = <TotalVacancy/>;
                                break;
                            }
                            case'slotted': {
                                label = 'Slotted';
                                icon = <OccupiedVacancy/>;
                                break;
                            }
                            case'unslotted': {
                                label = 'Unslotted';
                                icon = <VacantVacancy/>;
                                break;
                            }
                        }

            }
            return <div className="col" key={value}>
               <div className="card">
                   <Tooltip title={tooltipTitle[label]} placement="top" arrow>
                       <div className="card-body d-flex p-0">
                           <div> {iconType === 'svg' ?
                               <p className="align-middle">{icon}</p>
                               :
                               <img className={`analytics-icon-image ${label}`} src={icon} alt={label}/>
                           }
                           </div>
                           <div className="ms-4">
                               <p className="cardlabel mb-0">{label}</p>
                               <p className="cardvalue">{homeStats[value]}</p>
                           </div>
                       </div>
                   </Tooltip>
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
