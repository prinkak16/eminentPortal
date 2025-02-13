import React, { useState, useEffect } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import './multipleSelectCheckmarks.scss';
import { getMinistry } from '../../../../../api/eminentapis/endpoints';
import SearchIcon from '../../../../../../../../public/images/SearchOutline.svg';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export default function MultipleSelectCheckmarks({ style, onSelectMinistries, data,initialValue}) {
    console.log('initail value in multi select ', initialValue)
    const [personName, setPersonName] = useState(initialValue??[]);
    const [ministryData, setMinistryData] = useState([]);
    const [ministryIds, setMinistryIds] = useState([]);

    const getMinistryData = () => {
        getMinistry().then((res) => {
            setMinistryData(res.data.data.ministries);
        });
    };

    useEffect(() => {
        getMinistryData();
    }, []);

    const calculateRemainingCount = (selected) => {
        const remainingCount = selected.length - 1;
        return remainingCount > 0 ? `+ ${remainingCount}` : '';
    };


    const handleChange = (event) => {
        setPersonName(event.target.value);
        const temp = [];
        for (const name of event.target.value) {
            const id = ministryData.find((ministry) => ministry.name === name)?.id;
            temp.push(id);
        }
        setMinistryIds(temp);
        onSelectMinistries(temp);
    };

    return (
        <FormControl sx={!style ? { m: 1, width: 400 } : style}>
            <InputLabel id="demo-multiple-checkbox-label">Select Ministry</InputLabel>
            <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={personName}
                onChange={handleChange}
                input={<OutlinedInput label="Select Ministry" />}
                renderValue={(selected) => {
                    if (selected.length === 0) {
                        return 'Select Ministry';
                    } else if (selected.length === 1) {
                        return selected[0];
                    } else {
                        return `${selected[0]} ${calculateRemainingCount(selected)}`;

                    }
                }}

                MenuProps={MenuProps}
            >
                {data.map((ministry) => (
                    <MenuItem key={ministry.id} value={ministry.name}>
                        <Checkbox checked={personName.indexOf(ministry.name) > -1} />
                        <ListItemText primary={ministry.name} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
