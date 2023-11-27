import React, {createContext, useContext, useState, useEffect} from 'react';
import { useLocation, Link } from 'react-router-dom';
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

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import {HomeContext} from "../../../../context/tabdataContext";

const MasterVacancies = ({ tabId, filterString }) => {
    const homeContext = useContext(HomeContext);
    const [value, setValue] = React.useState('1');
    const [tabData, setTabData] = useState([]);
    const [ministryId, setMinistryId] = useState(null);
    const [organizationId, setOrganizationId] = useState(null)

    const location = useLocation();
    const currentTab = parseInt(location.hash.slice(1)) || 'ministry';
    const handleChange = (event, newValue) => {
        handleValueChange(newValue);
        window.history.replaceState(null, null, `/${newValue}`);
    };
    const handleValueChange = (value) => {
        setValue(value);
        homeContext.handleMovTabsFilter(value);
    }
    const switchTabDataHandler = (tabId, ministryId, organizationId) => {
        if(tabId === 'ministry') {
            handleValueChange(tabId);
        }
        else if(tabId === 'psuwise') {
            handleValueChange(tabId);
            setMinistryId(ministryId);
        }
        else if(tabId === 'vacancywise'){
            handleValueChange(tabId);
            setOrganizationId(organizationId)
        }
    };

    useEffect(() => {
        handleChange(null, currentTab)
        const handleBeforeUnload = (event) => {
            window.history.replaceState(null, null, `/${newValue}`);
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
    }, [currentTab]);
    return (
        <>
        <Analytics tabId={tabId}/>
        <Box sx={{ width: '100%', typography: 'body1' }} className="mt-3">
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className="mastertabs d-flex justify-content-between align-items-center">
                    <TabList value={currentTab} onChange={handleChange}  aria-label="lab API tabs example">
                        <Tab label="Ministry Wise" component={Link} to="/ministryTable" value="ministry" />
                        <Tab label="PSU wise" value="psuwise" />
                        <Tab label="Vacancy Wise" value="vacancywise" />
                    </TabList>
                    <Button className="download_btn">Download <ArrowDownwardIcon/></Button>
                </Box>
                <TabPanel value="ministry"  className="p-0">
                    <MinistryTable filterString={filterString}  onSwitchTab={switchTabDataHandler} />
                </TabPanel>
                <TabPanel value="psuwise" className="p-0">
                    <PSUTable filterString={filterString} ministryId={ministryId} data={tabData} onSwitchTab={switchTabDataHandler}/>
                </TabPanel>
                <TabPanel value="vacancywise" className="p-0">
                    <VacancyTable filterString={filterString} organizationId={organizationId} data={tabData} onSwitchTab={switchTabDataHandler}/>
                </TabPanel>
            </TabContext>
        </Box>
        </>
    );
}
export default MasterVacancies;