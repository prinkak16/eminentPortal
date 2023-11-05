import * as React from 'react';
import {useEffect, useState} from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import "./filterssidebar.scss"
import {getFilters} from "../../../../api/eminentapis/endpoints";
import {createSearchParams, useLocation, useNavigate} from "react-router-dom";
import { useSearchParams  } from 'react-router-dom';

export default function FiltersSidebar(props) {
    const [filtersList, setFiltersList] = useState([]);
    const [expandedFilter, setExpandedFilter] = useState('');
    const [appliedFilters, setAppliedFilters] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    const navigate = useNavigate();

    useEffect(() => {
        const selectedFilters = [];
        const queryParams = decodeURIComponent(location.search).split('&').slice(1);
        queryParams.forEach(item => {
            const itemElements = item.split('=');
            const valueArr = itemElements[1].split(',').map(value => isNaN(value) ? value : parseInt(value));
            selectedFilters.push({
                parent_key: itemElements[0],
                selectedValues: valueArr
            })
        });
        let filterString = '';
        selectedFilters.filter(item => item.selectedValues.length > 0).forEach(value => {
            filterString += `&${value.parent_key}=${value.selectedValues.join(',')}`;
        });
        setAppliedFilters(selectedFilters);
        props.setFilterString(filterString);
        getFilters().then(res => {
            setFiltersList(res.data.data)
        });
        applyFilter();
    }, []);
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
        setSearchParams({query: filterString});

        props.setFilterString(filterString);
    }


    const handleChange = (value) => (event, isExpanded) => {
        if (expandedFilter === value) {
            setExpandedFilter('');
        } else {
            setExpandedFilter(value);
        }
    };

    const isChecked = (parentKey, optionValue) => {
        const parentOption = appliedFilters.find(item => item.parent_key === parentKey);
        return !!(parentOption && parentOption.selectedValues.includes(optionValue));
    }

    const handleClear = () => {
        setAppliedFilters([]);
        props.setFilterString('');
        navigate('/home');
    }

    return (
        <div>
            <div className="d-flex justify-content-between mt-4 ms-4">
                <p className="refineoption">Refine by</p>
                <p className="clearoption me-4" onClick={() => handleClear()}>Clear</p>
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
                            {filter?.values && filter.values.map((filterOption) => (
                                <p key={filterOption.value}><input type="checkbox" checked={isChecked(filter.key, filterOption.value)} onClick={() => applyFilter(filter.key, filterOption.value)}/>
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