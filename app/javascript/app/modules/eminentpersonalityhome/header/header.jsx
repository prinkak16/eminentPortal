
import React, {useContext, useState} from 'react';
import Saral from '../../../../../../public/images/Logo.svg'
import HeaderArrowDown from '../../../../../../public/images/downarrow.svg';
import './header.scss';
import {Select, MenuItem,Box,InputLabel,FormControl,Tab} from "@mui/material";
import axios from "axios";
import {Menu} from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';
import LogoutIcon from '@mui/icons-material/Logout';
import {useNavigate} from 'react-router-dom';
import {ApiContext} from "../../ApiContext";
import UserIcon from '../../../../../../public/images/user-profile-icon1.svg';
import {eminentAdminDetails, eminentAdminLogout} from "../../../api/stepperApiEndpoints/stepperapiendpoints";
import { Link } from "react-router-dom";
import {HomeContext} from "../../../context/tabdataContext";
import Tabs from "@mui/material/Tabs";
function Header({userData}){
    const {
        setTabId,
        tabId
    } = useContext(HomeContext)
    const {isCandidateLogin, setAuthToken} = useContext(ApiContext)
    const logout = () => {
      if (isCandidateLogin) {
          localStorage.setItem('auth_token', '')
          setAuthToken('')
      } else {
          eminentAdminLogout().then((res) => {
              localStorage.removeItem('user_permissions');
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

    const handleLogoClick = () => {

        setTabId('home');
    };

    return(
  

        <div className='saral-notify-header'>
            <Link to='/' className='header-left-part' onClick={handleLogoClick}>
                <Saral/>
                <span className='bjp-text'>भारतीय जनता पार्टी</span>
            </Link>

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
                    <MenuItem className='logout-navbar-text' ><Link to="profile">{<><FaceIcon/>&emsp;Profile</>}</Link></MenuItem>
                    <MenuItem className='logout-navbar-text' onClick={() => logout()}>{<><LogoutIcon/>&emsp;Logout</>}</MenuItem>
                </Menu>
            </div>
        </div>
    )
}

export default Header;