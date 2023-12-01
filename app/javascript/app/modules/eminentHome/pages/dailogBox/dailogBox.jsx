import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {useEffect} from "react";
import './dailogBox.scss'
import DrawerRectangle from '../../../../../../../public/images/drawerRectangle.svg'

const DialogBox = ({openDialogue, list, onClose}) => {
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
                          Update Status
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <div className='list-container'>
                            {list && list.map((item) => (
                               <div className='dialog-list-container'>
                                   <input className='dialog-list-input' type='radio' />
                                   <span className='dialog-list-item'>{item}</span>
                               </div>
                            ))}
                        </div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default DialogBox;
