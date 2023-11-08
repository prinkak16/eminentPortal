
import React, {useState, useEffect, useRef} from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import './MultipleSelectCheckmarks.scss'
import {getMinistry} from "../../../../../api/eminentapis/endpoints"
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

export default function MultipleSelectCheckmarks({style, onSelectMinistries}) {
    // console.log('style is ',style)
    const [personName, setPersonName] = useState([]);
    const [ministryData, setMinistryData] = useState([]);
    const [ministryIds, setMinistryIds] = useState([]);

    const getMinistryData=()=>{
        getMinistry().then((res)=>{
            setMinistryData(res.data.data.ministries);
        })
    }
    useEffect(() => {
        getMinistryData()
    }, []);
    const handleChange = (event) => {
        setPersonName(event.target.value);
        const temp = [];
        for (const name of event.target.value) {
            const id = ministryData.find(ministry => ministry.name === name)?.id
            temp.push(id);
        }
        setMinistryIds(temp);
    };
    const selectHandler = (identifier) => {
        if (identifier === 'DONE') {
            onSelectMinistries(ministryIds)
            console.log('Done button clicked');
        } else if (identifier === 'CANCEL') {
            console.log('cancel button clicked');
        }
    }

    return (
        <FormControl sx={!style? {m:1,width: 400} :style} >
            <InputLabel id="demo-multiple-checkbox-label">Select Ministry</InputLabel>
            <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={personName}
                onChange={handleChange}
                input={<OutlinedInput label="Select Ministry" />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
            >
                <div style={{
                    display: "flex",
                    gap: "10px",
                    // border: '1px solid black',
                    // borderRadius: '10px',
                    backgroundColor: "#F8F8F8",
                    padding: '5px 15px',
                    marginLeft: '20px'
                }}>
                    <input
                        type="text"
                        placeholder="Search"
                        className="input-field"
                        style={{width: '90%', border: 'none', color: 'black'}}
                    />
                    <img src="SearchOutline.svg" alt="" width={'25px'} height={'25px'}/>

                </div>

                {ministryData.map((ministry) => (
                    <MenuItem key={ministry.id} value={ministry.name}>
                        <Checkbox checked={personName.indexOf(ministry.name) > -1} />
                        <ListItemText primary={ministry.name} />
                    </MenuItem>
                ))}
                <div>
                    <button id="btn-1" onClick={() => {
                        selectHandler('DONE')
                    }}>Done</button>
                    <button id="btn-2" style={{cursor: "pointer"}}
                            onClick={() => {
                                setSelectOpen(false)
                        selectHandler('CANCEL')
                    }}>Cancel</button>
                </div>
            </Select>
        </FormControl>
    );
}