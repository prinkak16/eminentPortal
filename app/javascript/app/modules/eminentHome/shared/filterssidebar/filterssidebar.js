import * as React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  FormControl,
  Input,
  InputAdornment,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import "./filterssidebar.scss";
import { useContext, useEffect, useState, useRef } from "react";
import {
  allotmentSidebarFilters,
  getData,
  getFilters,
  getFiltersFileStatus,
  getFiltersForAllotment,
  getFiltersForGOM,
  getMinistryWiseFilterData,
  getOrganizationWiseFilterData,
  getSlottingFilters,
  getVacancyWiseFilterData,
} from "../../../../api/eminentapis/endpoints";
import { HomeContext } from "../../../../context/tabdataContext";
import { debounce } from "lodash";
import { string } from "yup";
import { ApiContext } from "../../../ApiContext";
import { isValuePresent } from "../../../utils";
import AllotmentContext from "../../pages/allotment/context/allotmentContext";

export default function FiltersSidebar(props) {
  const homeContext = useContext(HomeContext);
  const { setResetFilter } = useContext(ApiContext);
  const [filtersList, setFiltersList] = useState([]);
  const [expandedFilter, setExpandedFilter] = useState("");
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [searchMinisterName, setSearchMinisterName] = useState("");
  const [searchDepartmentName, setSearchDepartmentName] = useState("");
  const [searchOrganizationName, setSearchOrganizationName] = useState("");
  const [inputSearch, setInputSearch] = useState({});
  const [filtersKey, setFiltersKey] = useState([]);
  const {assignBreadCrums} = useContext(AllotmentContext);
  const applyFilter = (appliedFilterKey, appliedKeyOptions) => {
    if (!appliedFilterKey || !appliedKeyOptions) {
      return;
    }
    const appliedFiltersValue = appliedFilters;
    const foundKey = appliedFiltersValue?.find(
        (item) => item.parent_key === appliedFilterKey
    );
    if (foundKey) {
      const newValues = foundKey.selectedValues.find(
          (item) => item === appliedKeyOptions
      );
      if (newValues) {
        foundKey.selectedValues = foundKey?.selectedValues?.filter(
            (item) => item !== appliedKeyOptions
        );
      } else {
        foundKey.selectedValues.push(appliedKeyOptions);
      }
    } else {
      appliedFiltersValue.push({
        parent_key: appliedFilterKey,
        selectedValues: [appliedKeyOptions],
      });
    }
    setAppliedFilters(appliedFiltersValue);
    let filterString = "";
    appliedFiltersValue
        .filter((item) => item.selectedValues.length > 0)
        .forEach((value) => {
          filterString += `&${value.parent_key}=${value.selectedValues.join(
              ","
          )}`;
        });
    props.setFilterString(filterString);
  };


  const handleChange = (value) => (event, isExpanded) => {
    if (filtersKey.includes(value)) {
      const keys = filtersKey.filter((item) => item !== value);
      setFiltersKey(keys);
    } else {
      setFiltersKey([...filtersKey, value]);
    }
  };



  const handleSearchFilter =((value, identifier) => {
    if (identifier === "Ministry") {
      setSearchMinisterName(value);
    } else if (identifier === "Department") {
      setSearchDepartmentName(value);
    } else if (identifier === "Organization") {
      setSearchOrganizationName(value);
    }
  });

  const handleInputSearch = (event, key) => {
    const value = event.target.value;
    setInputSearch((prevData) => {
      return { ...prevData, [key]: value };
    });
    handleSearchFilter(event.target.value, key);
  };

  const isChecked = (parentKey, optionValue) => {
    const parentOption = appliedFilters.find(
        (item) => item.parent_key === parentKey
    );
    return parentOption && parentOption.selectedValues.includes(optionValue);
  };

  const handleClearFilter = () => {
    props.setFilterString("");
    setResetFilter(true);
    setInputSearch({});
    setAppliedFilters([]);
    setSearchMinisterName("");
    setSearchDepartmentName("");
    setSearchOrganizationName("");
  };
  useEffect(() => {
    const timer = setTimeout( () => {
    props.setFilterString("");
    switch (props.tabId) {
      case "master_of_vacancies":
        if (homeContext.movTabId === "ministry_wise") {
          const params = {
            ministry_name: searchMinisterName,
          };
          getMinistryWiseFilterData(params).then((response) => {
            setFiltersList(response.data.data);
          });
        } else if (homeContext.movTabId === "psu_wise") {
          setResetFilter(true);
          const psuParams = {
            ministry_name: searchMinisterName,
            department_name: searchDepartmentName,
            organization_name: searchOrganizationName,
          };
          getOrganizationWiseFilterData(psuParams).then((response) => {
            setFiltersList(response.data.data);
          });
        } else if (homeContext.movTabId === "vacancy_wise") {
          const vacancyParams = {
            ministry_name: searchMinisterName,
            department_name: searchDepartmentName,
            organization_name: searchOrganizationName,
          };
          getVacancyWiseFilterData(vacancyParams).then((response) => {
            setFiltersList(response.data.data);
          });
        }
        break;
      case "slotting":
        const slottingParams = {
          ministry_name: searchMinisterName,
          department_name: searchDepartmentName,
          organization_name: searchOrganizationName,
        };
        getSlottingFilters(slottingParams).then((response) => {
          setFiltersList(response.data.data);
        });
        break;

      case "allotment":
        if(assignBreadCrums){
          allotmentSidebarFilters().then((response) => {
            setFiltersList(response.data.data);
          })

        }
        else{
          const alotmentParams = {
            ministry_name: searchMinisterName,
            department_name: searchDepartmentName,
          };
          getFiltersForAllotment(alotmentParams).then((response) => {
            setFiltersList(response.data.data);
          });
        }
        break;

      case "gom_management":
        getFiltersForGOM().then((response) => {
          setFiltersList(response.data.data);
        });
        break;
      case "file_status":
        const fileStatusParams = {
          ministry_name: searchMinisterName,
          department_name: searchDepartmentName,
        };
        getFiltersFileStatus(fileStatusParams).then((response) => {
          setFiltersList(response.data.data);
        });
        break;
      default:
        getFilters().then((res) => {
          setFiltersList(res.data.data);
        });
    }

    applyFilter();
      } , 1000 );

    return () => {
      clearTimeout(timer);
    }
  }, [
    props.tabId,
    homeContext.movTabId,
    searchMinisterName,
    searchDepartmentName,
    searchOrganizationName,
    assignBreadCrums
  ]);

  useEffect(() => {
    if (isValuePresent(filtersList.filters)) {
      const keys = filtersList.filters?.map((item) => item.key);
      setFiltersKey(keys);
    }
  }, [filtersList.filters]);
  return (
      <div className="filter-container">
        <div className="d-flex justify-content-between mt-4 ms-4">
          <p className="refineoption">Refine by</p>
          <p className="clearoption me-4" onClick={handleClearFilter}>
            Clear
          </p>
        </div>
        {filtersList?.filters &&
            filtersList.filters.map((filter) => (
                <Accordion
                    className={`accordion accordian-with-bt `}
                    expanded={filtersKey.includes(filter.key)}
                    onChange={handleChange(filter.key)}
                    key={filter.key}
                >
                  <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                  >
                    <Typography className="filterType ms-2">
                      {filter.display_name}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails className="filteraccord">
                    <Typography className="ms-2 filterTypeOptions">
                      {props.tabId === "master_of_vacancies" &&
                          homeContext.movTabId === "ministry_wise" &&
                          ["Ministry"].includes(filter.display_name) && (
                              <FormControl variant="outlined" className="mb-4 srchfilter">
                                <Input
                                    id={filter?.display_name}
                                    placeholder="Search"
                                    startAdornment={
                                      <InputAdornment position="start">
                                        <SearchIcon />
                                      </InputAdornment>
                                    }
                                    value={inputSearch[filter?.display_name]}
                                    onChange={(event) =>
                                        handleInputSearch(event, filter.display_name)
                                    }
                                />
                              </FormControl>
                          )}

                      {props.tabId === "master_of_vacancies" &&
                          homeContext.movTabId === "psu_wise" &&
                          ["Ministry", "Department", "Organization"].includes(
                              filter.display_name
                          ) && (
                              <FormControl variant="outlined" className="mb-4 srchfilter">
                                <Input
                                    id={filter?.display_name}
                                    placeholder="Search"
                                    startAdornment={
                                      <InputAdornment position="start">
                                        <SearchIcon />
                                      </InputAdornment>
                                    }
                                    value={inputSearch[filter?.display_name]}
                                    onChange={(e) =>
                                        handleInputSearch(e, filter.display_name)
                                    }
                                />
                              </FormControl>
                          )}
                      {props.tabId === "master_of_vacancies" &&
                          homeContext.movTabId === "vacancy_wise" &&
                          ["Ministry", "Department", "Organization"].includes(
                              filter.display_name
                          ) && (
                              <FormControl variant="outlined" className="mb-4 srchfilter">
                                <Input
                                    id={filter?.display_name}
                                    placeholder="Search"
                                    startAdornment={
                                      <InputAdornment position="start">
                                        <SearchIcon />
                                      </InputAdornment>
                                    }
                                    value={inputSearch[[filter?.display_name]]}
                                    onChange={(e) =>
                                        handleInputSearch(e, filter.display_name)
                                    }
                                />
                              </FormControl>
                          )}
                      {props.tabId === "slotting" &&
                          ["Ministry", "Department", "Organization"].includes(
                              filter.display_name
                          ) && (
                              <FormControl variant="outlined" className="mb-4 srchfilter">
                                <Input
                                    id={filter?.display_name}
                                    placeholder="Search"
                                    startAdornment={
                                      <InputAdornment position="start">
                                        <SearchIcon />
                                      </InputAdornment>
                                    }
                                    value={inputSearch[filter?.display_name]}
                                    onChange={(e) =>
                                        handleInputSearch(e, filter.display_name)
                                    }
                                />
                              </FormControl>
                          )}

                      {props.tabId === "allotment" &&
                          ["Ministry", "Department"].includes(filter.display_name) && (
                              <FormControl variant="outlined" className="mb-4 srchfilter">
                                <Input
                                    id={filter?.display_name}
                                    placeholder="Search"
                                    startAdornment={
                                      <InputAdornment position="start">
                                        <SearchIcon />
                                      </InputAdornment>
                                    }
                                    value={inputSearch[filter?.display_name]}
                                    onChange={(e) =>
                                        handleInputSearch(e, filter.display_name)
                                    }
                                />
                              </FormControl>
                          )}
                      <div className="scrollFilter">
                        {filter?.values &&
                            filter.values.map((filterOption) => (
                                <p key={filterOption.value}>
                                  <input
                                      type="checkbox"
                                      checked={isChecked(filter.key, filterOption.value)}
                                      onClick={() =>
                                          applyFilter(filter.key, filterOption.value)
                                      }
                                  />
                                  {filterOption.display_name}
                                </p>
                            ))}
                      </div>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
            ))}
      </div>
  );
}
