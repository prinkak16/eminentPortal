import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import "./filterssidebar.scss"
import {useEffect, useState} from "react";
import {getData, getFilters} from "../../../../api/eminentapis/endpoints";

export default function FiltersSidebar(props) {
    const [filtersList, setFiltersList] = useState([]);
    const [expandedFilter, setExpandedFilter] = useState('');
    const [appliedFilters, setAppliedFilters] = useState([]);
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
        console.log(appliedFilters);
    }

    useEffect(() => {
        getFilters().then(res => {
            setFiltersList(res.data.data)
        });
        applyFilter();
    }, []);

    const handleChange = (value) => (event, isExpanded) => {
        if (expandedFilter === value) {
            setExpandedFilter('');
        } else {
            setExpandedFilter(value);
        }
    };

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
                           expanded={expandedFilter === filter.key} onChange={handleChange(filter.key)}>
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