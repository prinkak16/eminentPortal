
import React, {useContext, useState} from 'react';
import Saral from '../../../../../../public/images/Logo.svg'
import HeaderArrowDown from '../../../../../../public/images/downarrow.svg';
import './header.scss';
import {Select, MenuItem,Box,InputLabel,FormControl} from "@mui/material";
import axios from "axios";
import Menu from '@mui/material/Menu';
import FaceIcon from '@mui/icons-material/Face';
import LogoutIcon from '@mui/icons-material/Logout';
import {useNavigate} from 'react-router-dom';
import {ApiContext} from "../../ApiContext";
import UserIcon from '../../../../../../public/images/user-profile-icon1.svg';
import {eminentAdminDetails, eminentAdminLogout} from "../../../api/stepperApiEndpoints/stepperapiendpoints";
function Header({userData}){
    const {isCandidateLogin, setAuthToken} = useContext(ApiContext)
    const logout = () => {
      if (isCandidateLogin) {
          localStorage.setItem('auth_token', '')
          setAuthToken('')
      } else {
          eminentAdminLogout().then((res) => {
              window.location.reload()
          })
      }
    };
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    return(
  

        <div className='saral-notify-header'>
            <div className='header-left-part' onClick={() =>  navigate('/')} >
                <Saral/>
                <span className='bjp-text'>भारतीय जनता पार्टी</span>
            </div>

            <div className='header-right-part'>
                <div className='navbar-profile'>
                    <UserIcon />
                    <span>
                        <span className="d-block">{userData?.name}</span><br/>
                    </span>
                    <HeaderArrowDown className='profile-arrow-svg' onClick={handleOpen}/>
                </div>
                <Menu
                    className='logout-navbar'
                    id="demo-positioned-menu"
                    aria-labelledby="demo-positioned-button"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    marginThreshold='16'
                    anchorOrigin={{
                        vertical: 'bottom',

                    }}
                    transformOrigin={{
                        vertical: 'top',

                        horizontal: 'right',
                    }}
                >
                    <MenuItem className='logout-navbar-text' >{<><FaceIcon/>&emsp;Profile</>}</MenuItem>
                    <MenuItem className='logout-navbar-text' onClick={() => logout()}>{<><LogoutIcon/>&emsp;Logout</>}</MenuItem>
                </Menu>
            </div>
        </div>



    )
}

export default Header;