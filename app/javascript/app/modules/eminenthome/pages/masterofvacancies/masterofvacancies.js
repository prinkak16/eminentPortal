import * as React from 'react';
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
import {useEffect, useState} from "react";
import './masterofvacancies.css'
import axios from "axios";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const DUMMY_DATA = []
const MasterVacancies=({tabId})=> {
    const [value, setValue] = React.useState('1');
    const [tabData, setTabData] = useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setTabData(DUMMY_DATA);
    };
    const switchTabDataHandler = (tabId, ministryId, departmentId = null) => {
        if(tabId=='1'){
            setValue(tabId);
        }
        else if(tabId=='2'){
            setValue(tabId);
            const ministryData= DUMMY_DATA.filter(data=>data.ministryId===ministryId);
            setTabData(ministryData);
        }
        else if(tabId=='3'){
            setValue(tabId);
            const ministryData= DUMMY_DATA.find(data=>data.ministryId===ministryId);
            const departmentData = ministryData.departments.filter(department=>department.departmentId === departmentId)
            const data = [{...ministryData, departments: departmentData}]
            console.log(data);
            setTabData(data)
        }

        // const ministryData = DUMMY_DATA.filter(data => data.ministryId === ministryId);
        // setTabData(ministryData);
    };
    useEffect(() => {
        axios.get('https://vacancies-dummy-apis-default-rtdb.firebaseio.com/ministries.json')
            .then(response => {
                for (let key in response.data) {
                    DUMMY_DATA.push({
                        ministryId: key,
                        ...response.data[key]
                    })
                }
                setTabData(DUMMY_DATA);

            })
    }, []);
    console.log(DUMMY_DATA);
    return (
        <>
            {/*<h5>Position Analytics</h5>*/}

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
                    <MinistryTable data={tabData} onSwitchTab={switchTabDataHandler} />
                </TabPanel>
                <TabPanel value="2" className="p-0">
                    <PSUTable  data={tabData} onSwitchTab={switchTabDataHandler}/>
                </TabPanel>
                <TabPanel value="3" className="p-0">
                    <VacancyTable data={tabData} onSwitchTab={switchTabDataHandler}/>
                </TabPanel>
            </TabContext>
        </Box>
        </>
    );
}
export default MasterVacancies;