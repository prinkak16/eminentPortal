import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {useEffect, useState} from "react";
import './dailogBox.scss'
import DrawerRectangle from '../../../../../../../public/images/drawerRectangle.svg'

const DialogBox = ({openDialogue, list, status, onClose, saveData, fileStatusId}) => {
    const [open, setOpen] = React.useState(false);
    const [input, setInput] = useState('')
    const [selectedItem, setSelectedItem] = useState(status)

    useEffect(() => {
        setOpen(openDialogue);
    }, [openDialogue]);

    const handleSave = () => {
        saveData(selectedItem, input, fileStatusId)
        handleClose()
    }
    const handleClose = () => {
        setOpen(false);
        onClose(false)
        setInput('')
        setSelectedItem(null)
    };

    const handleInput = (e) => {
        setInput(e.target.value)
    }

    const setListItem = (id) => {
        setSelectedItem(id)
    }

    useEffect(() => {
        setSelectedItem(status)
    },[status])

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
                                <div className='dialog-list-container' onClick={() => setListItem(item.id)}>
                                    <input className='dialog-list-input' checked={selectedItem === item.id} type='radio'/>
                                    <span className='dialog-list-item' >{item.name}</span>
                                </div>
                            ))}
                        </div>

                        <div className='eminent-text-container'>
                            <textarea className='eminent-status-update-text'
                                      onChange={handleInput}
                                      placeholder='Write something...'>
                            </textarea>
                        </div>
                        <div className='button-container d-flex'>
                            <button className='eminent-update-button' onClick={handleSave}>Update</button>
                            <button className='eminent-cancel-button' onClick={handleClose}>Cancel</button>
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
