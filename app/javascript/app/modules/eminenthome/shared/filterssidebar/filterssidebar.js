import * as React from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
    FormControl,
    Input,
    InputAdornment
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import "./filterssidebar.scss"
import {useContext, useEffect, useState} from "react";
import {
    getData,
    getFilters,
    getFiltersForGOM,
    getMinistryWiseFilterData,
    getOrganizationWiseFilterData,
    getVacancyWiseFilterData
} from "../../../../api/eminentapis/endpoints";
import {HomeContext} from "../../../../context/tabdataContext";
import {debounce} from "lodash";
import {string} from "yup";

export default function FiltersSidebar(props) {
    const homeContext = useContext(HomeContext);
    const [filtersList, setFiltersList] = useState([]);
    const [expandedFilter, setExpandedFilter] = useState('');
    const [appliedFilters, setAppliedFilters] = useState([]);
    const [searchMinisterName, setSearchMinisterName] = useState('');
    const [searchDepartmentName, setSearchDepartmentName] = useState('');
    const [searchOrganizationName, setSearchOrganizationName] = useState('');
    const applyFilter = (appliedFilterKey, appliedKeyOptions) => {
        if (!appliedFilterKey || !appliedKeyOptions) {
            return;
        }
        const appliedFiltersValue = appliedFilters;
        const foundKey = appliedFiltersValue?.find((item) => item.parent_key === appliedFilterKey)
        if (foundKey) {
            const newValues = foundKey.selectedValues.find((item) => item === appliedKeyOptions);
            if (newValues) {
                foundKey.selectedValues = foundKey?.selectedValues?.filter((item) => item !== appliedKeyOptions);
            } else {
                foundKey.selectedValues.push(appliedKeyOptions);
            }
        } else {
            appliedFiltersValue.push({
                parent_key: appliedFilterKey,
                selectedValues: [appliedKeyOptions]
            });
        }
        setAppliedFilters(appliedFiltersValue);
        let filterString = '';
        appliedFiltersValue.filter(item => item.selectedValues.length > 0).forEach(value => {
            filterString += `&${value.parent_key}=${value.selectedValues.join(',')}`;
        });
        props.setFilterString(filterString);
    }
    useEffect(() => {
        console.log('Home context value: ', homeContext.movTabId)

        switch (props.tabId) {
            case '4':
                if (homeContext.movTabId === 'ministry') {
                    const params = {
                        ministry_name: searchMinisterName,
                    }
                    getMinistryWiseFilterData(params).then(response => {
                        setFiltersList(response.data.data)
                    })
                } else if (homeContext.movTabId === 'psuwise' ) {
                    const psuParams = {
                        ministry_name: searchMinisterName,
                        department_name: searchDepartmentName,
                        organization_name: searchOrganizationName,
                    }
                    getOrganizationWiseFilterData(psuParams).then(response => {
                        setFiltersList(response.data.data);
                    })
                } else if (homeContext.movTabId === 'vacancywise') {
                    const vacancyParams = {
                        ministry_name: searchMinisterName,
                        department_name: searchDepartmentName,
                        organization_name: searchOrganizationName,
                    }
                    getVacancyWiseFilterData(vacancyParams).then(response => {
                        setFiltersList(response.data.data)
                    })
                }
                break;
            case '6':
                getFiltersForGOM().then(response => {
                    setFiltersList(response.data.data)
                })
                break;
            default:
                getFilters().then(res => {
                    setFiltersList(res.data.data)
                });
        }
        applyFilter();
    }, [props.tabId, homeContext.movTabId, searchMinisterName, searchDepartmentName, searchOrganizationName]);

    const handleChange = (value) => (event, isExpanded) => {
        if (expandedFilter === value) {
            setExpandedFilter('');
        } else {
            setExpandedFilter(value);
            setExpandedFilter(value);
        }
    };

    const handleSearchFilter = debounce((event, identifier) => {
        const inputValue = event.target.value;
        if (identifier === 'Ministry') {
            setSearchMinisterName(inputValue);
        } else if (identifier === 'Department') {
            setSearchDepartmentName(inputValue)
        }
        else if (identifier === 'Organization') {
            setSearchOrganizationName(inputValue)
        }
    }, 1000)

    const isChecked = (parentKey, optionValue) => {
        const parentOption = appliedFilters.find(item => item.parent_key === parentKey);
        return parentOption && parentOption.selectedValues.includes(optionValue);
    }
    return (
        <div>
            <div className="d-flex justify-content-between mt-4 ms-4">
                <p className="refineoption">Refine by</p>
                <p className="clearoption me-4" onClick={() => setAppliedFilters([])}>Clear</p>
            </div>
            {filtersList?.filters && filtersList.filters.map((filter) => (
                <Accordion className={`accordion ${expandedFilter === filter.key ? 'accordian-with-bt' : ''}`}
                           expanded={expandedFilter === filter.key} onChange={handleChange(filter.key)}
                           key={filter.key}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <Typography className="filterType ms-2">
                            {filter.display_name}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails className='filteraccord'>
                        <Typography className="ms-2 filterTypeOptions">
                            {(props.tabId === '4' && homeContext.movTabId === 'ministry' && ['Ministry'].includes(filter.display_name)) &&
                                <FormControl variant="outlined" className="mb-4 srchfilter">
                                    <Input
                                        id="input-with-icon-adornment"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <SearchIcon/>
                                            </InputAdornment>
                                        }
                                        onChange={() => handleSearchFilter(event, 'Ministry')}
                                    />
                                </FormControl>
                            }

                            {(props.tabId === '4' && homeContext.movTabId === 'psuwise' && ['Ministry', 'Department', 'Organization'].includes(filter.display_name)) &&
                                <FormControl variant="outlined" className="mb-4 srchfilter">
                                    <Input
                                        id="input-with-icon-adornment"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <SearchIcon/>
                                            </InputAdornment>
                                        }
                                        onChange={() => handleSearchFilter(event, filter.display_name)}
                                    />
                                </FormControl>
                            }
                            {(props.tabId === '4' && homeContext.movTabId === 'vacancywise' && ['Ministry', 'Department', 'Organization'].includes(filter.display_name)) &&
                                <FormControl variant="outlined" className="mb-4 srchfilter">
                                    <Input
                                        id="input-with-icon-adornment"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <SearchIcon/>
                                            </InputAdornment>
                                        }
                                        onChange={() => handleSearchFilter(event, filter.display_name)}
                                    />
                                </FormControl>
                            }
                            {filter?.values && filter.values.map((filterOption) => (
                                <p key={filterOption.value}><input type="checkbox"
                                                                   checked={isChecked(filter.key, filterOption.value)}
                                                                   onClick={() => applyFilter(filter.key, filterOption.value)}/>
                                    {filterOption.display_name}
                                </p>
                            ))
                            }
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            ))}


        </div>
    );
}