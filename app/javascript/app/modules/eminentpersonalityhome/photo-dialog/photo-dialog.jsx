import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {useEffect} from "react";
import './photo-drawer.css'
import DrawerRectangle from '../../../../../../public/images/drawerRectangle.svg'

const PhotoDialog = ({openDialogue, imageUrl, onClose}) => {
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        setOpen(openDialogue);
    }, [openDialogue]);


    const handleClose = () => {
        setOpen(false);
        onClose(false)
    };

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    <DrawerRectangle/>
                    Profile Photo
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <div className="drawer-img-container">
                            <img className="drawer-img" key={imageUrl} src={imageUrl}/>
                        </div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default PhotoDialog;
