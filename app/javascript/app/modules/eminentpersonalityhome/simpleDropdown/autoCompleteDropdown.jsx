import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import {TextField} from "@mui/material";
import './autoCompleteDropdown.css'
import {isValuePresent} from "../../utils";

const AutoCompleteDropdown = ({listArray,name, onChangeValue ,selectedValue, dropDownType, formIndex, classes, disabled}) => {
    const onChange = (event, value) => {
        onChangeValue(value, name, dropDownType,formIndex)
    }

    return (
        <div>
            <Autocomplete
                placeholder={name}
                disabled={disabled}
                className={classes}
                value={selectedValue}
                onChange={onChange}
                id="autocomplete"
                options={listArray}
                renderInput={(params) => <TextField {...params}  placeholder={`Select ${name}`} />}
            />
        </div>
    )
}

export default AutoCompleteDropdown