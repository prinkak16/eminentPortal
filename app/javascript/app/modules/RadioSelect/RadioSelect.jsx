import React,{useState,useEffect} from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import  {getMinisters} from "../../api/eminentapis/endpoints";

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

export default function RadioSelect({onSelectMinister}) {
    const [personName, setPersonName] = useState([]);
    const[ministersName, setMinistersName]= useState([])
    const handleChange = (event) => {
        setPersonName([event.target.value]);
        const id = ministersName.find(minister => minister.name === event.target.value)?.id;
        onSelectMinister(id);
    };
    const getMinitstersNameData=()=>{
        getMinisters().then((res)=>{
            setMinistersName(res.data.data.ministries)
        })
    }
    useEffect(() => {
        getMinitstersNameData()
    }, []);
    return (
        <div>
            <FormControl sx={{ m: 1, width: 400 }}>
                <InputLabel id="demo-multiple-checkbox-label">Select Ministers</InputLabel>
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
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

                    {ministersName.map((ministerName) => (
                        <MenuItem key={ministerName.id} value={ministerName.name}>
                            <Radio checked={personName.indexOf(ministerName.name) ==  1} />
                            <ListItemText primary={ministerName.name} />
                        </MenuItem>
                    ))}

                </Select>


            </FormControl>
        </div>
    );
}