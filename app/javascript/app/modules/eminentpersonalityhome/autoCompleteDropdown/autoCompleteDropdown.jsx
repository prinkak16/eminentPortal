import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import {TextField} from "@mui/material";
import './autoCompleteDropdown.css'

const AutoCompleteDropdown = ({listArray,name, onChangeValue ,selectedValue, compareValue = 'name',width = '10rem', borderNone}) => {
    const onChange = (event, value) => {
        onChangeValue(value)
    }
    return (
        <div>
            <Autocomplete
                style={{minWidth: width}}
                className={`auto-complete-dropdown-${borderNone}`}
                id="combo-box-demo"
                options={listArray}
                value={listArray.find(value => value.id === selectedValue) || null}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => compareValue === 'time' ? option.time : option.name || ""}
                onChange={onChange}
                blurOnSelect={true}
                renderInput={(params) => <TextField {...params} label={`Select ${name}`}
                />}
            />
        </div>
    )
}

export default AutoCompleteDropdown