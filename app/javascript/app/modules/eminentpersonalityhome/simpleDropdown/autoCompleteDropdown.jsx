import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import {TextField} from "@mui/material";
import './autoCompleteDropdown.css'

const AutoCompleteDropdown = ({listArray,name, onChangeValue ,selectedValue, dropDownType, formIndex}) => {
    const onChange = (event, value) => {
        onChangeValue(value, name, dropDownType,formIndex)
    }
    return (
        <div>
            <Autocomplete
                value={selectedValue}
                onChange={onChange}
                id="autocomplete"
                options={listArray}
                renderInput={(params) => <TextField {...params} label={`Select ${name}`} variant="outlined" />}
            />
        </div>
    )
}

export default AutoCompleteDropdown