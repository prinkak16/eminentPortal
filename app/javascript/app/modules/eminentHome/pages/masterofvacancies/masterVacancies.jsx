import React, {createContext, useContext, useState, useEffect} from 'react';
import {useNavigate, useLocation, useSearchParams} from 'react-router-dom';
import {
    Box,
    Tab,
    Button, Backdrop, CircularProgress
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Analytics from '../../shared/analytics/analytics'
import MinistryTable from "./components/ministryTable";
import PsuTable from "./components/psuTable";
import VacancyTable from "./components/vacancyTable";
import './masterVacancies.css'

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import {HomeContext} from "../../../../context/tabdataContext";
import {downloadMOV} from "../../../../api/eminentapis/endpoints";
import {downloadFile} from "../../../utils";
import {toast} from 'react-toastify';

const MasterVacancies = ({ tabId, filterString }) => {
    const [masterTabName, setMasterTabName] = useSearchParams({basicTabId: '4', masterOfVacancies: 'ministry_wise'});
    const homeContext = useContext(HomeContext);
    const [value, setValue] = React.useState(masterTabName.get('masterOfVacancies'));
    const [tabData, setTabData] = useState([]);
    const [ministryId, setMinistryId] = useState(null);
    const [organizationId, setOrganizationId] = useState(null)
    const [movSearchParams , setMovSearchParams] = useSearchParams();
    const [isFetching, setIsFetching] = useState(false);

    const handleChange = (event, newValue) => {
        setMinistryId(null);
        setOrganizationId(null)
        handleValueChange(newValue);
        handleMasterTabName(newValue);
    };
    const handleValueChange = (value) => {
        setValue(value);
        homeContext.handleMovTabsFilter(value);
    }
    const switchTabDataHandler = (tabId, ministryId, organizationId) => {
        if(tabId === 'ministry_wise') {
            handleValueChange(tabId);
        }
        else if(tabId === 'psu_wise') {
            handleValueChange(tabId);
            setMinistryId(ministryId);
        }
        else if(tabId === 'vacancy_wise'){
            handleValueChange(tabId);
            setOrganizationId(organizationId)
        }
    };

    useEffect(() => {
        homeContext.handleMovTabsFilter('ministry_wise');
        switchTabDataHandler(movSearchParams.get('masterOfVacancies'))
    }, []);

    const handleMasterTabName = (tabValue) => {
        setMasterTabName({basicTabId: masterTabName.get('basicTabId'), masterOfVacancies: tabValue})
    }

    const downloadMOVData = () => {
        setIsFetching(true);
        downloadMOV().then(response => {
            setIsFetching(false);
            // Create a Blob from the binary data
            const blobData = new Blob([response.data], { type: 'application/octet-stream' });
            downloadFile(blobData, 'mov_data');
        }, error => {
            setIsFetching(false);
            if (error.response.status === 401) {
                toast('You are not authorized to download');
            }
        })
    }

    return (
        <>
            <Backdrop
                open={isFetching}
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}>
                <CircularProgress color="inherit"/>
            </Backdrop>
            <Analytics tabId={tabId} title="Postiton Analytics"/>
            <Box sx={{ width: '100%', typography: 'body1' }} className="mt-3">
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className="mastertabs d-flex justify-content-between align-items-center">
                        <TabList onChange={handleChange}  aria-label="lab API tabs example">
                            <Tab label="Ministry Wise" value="ministry_wise" />
                            <Tab label="PSU wise" value="psu_wise" />
                            <Tab label="Position Wise" value="vacancy_wise" />
                        </TabList>
                        <Button className="download_btn" onClick={downloadMOVData}>Download <ArrowDownwardIcon/></Button>
                    </Box>
                    <TabPanel value="ministry_wise"  className="p-0">
                        <MinistryTable filterString={filterString} ministryId={ministryId} onSwitchTab={switchTabDataHandler} />
                    </TabPanel>
                    <TabPanel value="psu_wise" className="p-0">
                        <PsuTable filterString={filterString} ministryId={ministryId} data={tabData} onSwitchTab={switchTabDataHandler}/>
                    </TabPanel>
                    <TabPanel value="vacancy_wise" className="p-0">
                        <VacancyTable filterString={filterString} organizationId={organizationId} data={tabData} onSwitchTab={switchTabDataHandler}/>
                    </TabPanel>
                </TabContext>
            </Box>
        </>
    );
}
export default MasterVacancies;