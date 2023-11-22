import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import {useEffect} from "react";

const BackDrop = ({toggle}) => {
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        setOpen(toggle);
    }, [toggle]);

    return (
        <div>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                // onClick={toggleBackDrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}

export default BackDrop