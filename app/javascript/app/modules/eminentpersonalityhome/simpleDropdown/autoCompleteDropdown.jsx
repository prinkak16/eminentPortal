import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import {TextField} from "@mui/material";
import './autoCompleteDropdown.css'
import {isValuePresent} from "../../utils";

const AutoCompleteDropdown = ({listArray,name, onChangeValue ,selectedValue, dropDownType, formIndex, classes, disabled}) => {
    const onChange = (event, value) => {
        onChangeValue(value, name, dropDownType,formIndex)
    }

    const onInputChange = (event, newInputValue) => {
        // Call onChangeValue to update the selected value as the user types
        onChangeValue(newInputValue, name, dropDownType, formIndex);
    };

    return (
        <div>
            <Autocomplete
                placeholder={name}
                disabled={disabled}
                className={classes}
                value={selectedValue}
                onChange={onChange}
                onInputChange={onInputChange}
                id="autocomplete"
                freeSolo={true}
                options={listArray}
                filterOptions={(options, { inputValue }) => {
                    // If the user has input text, include it in the options
                    if (inputValue && !listArray.includes(inputValue)) {
                        options.push(inputValue);
                      options = options.filter(option =>
                            option.toLowerCase().startsWith(inputValue.toLowerCase()));

                    }

                  return options;
                }
                }
                renderInput={(params) => <TextField {...params}  placeholder={`Select ${name}`} />}
            />
        </div>
    )
}

export default AutoCompleteDropdown