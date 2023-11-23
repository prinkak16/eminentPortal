import React, {createContext, useContext, useState, useEffect} from 'react';
import {
    Box,
    Tab,
    Button
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Analytics from '../../shared/analytics/analytics'
import MinistryTable from "./components/ministrytable";
import PSUTable from "./components/psutable";
import VacancyTable from "./components/vacancytable";
import './masterofvacancies.css'
import axios from "axios";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import {HomeContext} from "../../../../context/tabdataContext";

const DUMMY_DATA = []
const MasterVacancies = ({ tabId, filterString }) => {
    const homeContext = useContext(HomeContext);

    const [value, setValue] = React.useState('1');
    const [tabData, setTabData] = useState([]);
    const [ministryId, setMinistryId] = useState(null);
    const [organizationId, setOrganizationId] = useState(null)
    const handleChange = (event, newValue) => {
        setValue(newValue);
        homeContext.handleMovTabsFilter(newValue);
    };
    const switchTabDataHandler = (tabId, ministryId, organizationId) => {
        if(tabId === '1') {
            setValue(tabId);
        }
        else if(tabId === '2') {
            setValue(tabId);
            setMinistryId(ministryId);
            console.log('ministryId', ministryId)
        }
        else if(tabId === '3'){
            setValue(tabId);
            setOrganizationId(organizationId)
            console.log('organizationId', organizationId)
        }
    };
    return (
        <>
        <Analytics tabId={tabId}/>
        <Box sx={{ width: '100%', typography: 'body1' }} className="mt-3">
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className="mastertabs d-flex justify-content-between align-items-center">
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Ministry Wise" value="1" />
                        <Tab label="PSU wise" value="2" />
                        <Tab label="Vacancy Wise" value="3" />
                    </TabList>
                    <Button className="download_btn">Download <ArrowDownwardIcon/></Button>
                </Box>
                <TabPanel value="1"  className="p-0">
                    <MinistryTable filterString={filterString} onSwitchTab={switchTabDataHandler} />
                </TabPanel>
                <TabPanel value="2" className="p-0">
                    <PSUTable filterString={filterString} ministryId={ministryId} data={tabData} onSwitchTab={switchTabDataHandler}/>
                </TabPanel>
                <TabPanel value="3" className="p-0">
                    <VacancyTable filterString={filterString} organizationId={organizationId} data={tabData} onSwitchTab={switchTabDataHandler}/>
                </TabPanel>
            </TabContext>
        </Box>
        </>
    );
}
export default MasterVacancies;