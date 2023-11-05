// import React, {useState} from 'react';
// import './header.scss';
// import Saral from '../../../../app/images/logo.png'
// import HeaderArrowDown from '../../../../app/images/logo.png';
// import {Select, MenuItem,Box,InputLabel,FormControl} from "@mui/material";
// import axios from "axios";
// import Menu from '@mui/material/Menu';
// // import LogoutIcon from '@mui/icons-material/Logout';
// import {useNavigate} from 'react-router-dom';
// // import {baseUrl, logoutUrl} from "../../../controllers/utilis/Api";
//
// const Header = () => {
//     // const clearCacheData = () => {
//     //     axios.get(baseUrl + logoutUrl).then(() => {
//     //         window.location.replace((document.getElementById("app").getAttribute("data-url")));
//     //     });
//     // };
//     const navigate = useNavigate();
//
//     const [anchorEl, setAnchorEl] = useState(null);
//     const open = Boolean(anchorEl);
//     const handleOpen = (event) => {
//         setAnchorEl(event.currentTarget);
//     };
//     const handleClose = () => {
//         setAnchorEl(null);
//     };
//
//     return (
//         <div className='saral-notify-header'>
//             <div className='header-left-part' onClick={() =>  navigate('/voice-note')} >
//                 <Saral/>
//                 <span className='bjp-text'>भारतीय जनता पार्टी</span>
//             </div>
//
//             <div className='header-right-part'>
//                 <div className='navbar-profile'>
//                     {/*<span>{JSON.parse(document.getElementById("app").getAttribute("data-user")).name}</span>*/}
//                     <HeaderArrowDown/>
//                 </div>
//                 <Menu
//                     className='logout-navbar'
//                     id="demo-positioned-menu"
//                     aria-labelledby="demo-positioned-button"
//                     anchorEl={anchorEl}
//                     open={open}
//                     onClose={handleClose}
//                     marginThreshold='16'
//                     anchorOrigin={{
//                         vertical: 'bottom',
//
//                     }}
//                     transformOrigin={{
//                         vertical: 'top',
//                         horizontal: 'right',
//                     }}
//                 >
//                     <MenuItem className='logout-navbar-text' onClick={() => clearCacheData()}>{<>&emsp;Logout</>}</MenuItem>
//                 </Menu>
//             </div>
//         </div>
//     );
// };
//
// export default Header;

import React, {useState} from 'react';
import Saral from '../../../../../../public/images/Logo.svg'
import HeaderArrowDown from '../../../../../../public/images/downarrow.svg';
import './header.scss';
import {Select, MenuItem,Box,InputLabel,FormControl} from "@mui/material";
import axios from "axios";
import Menu from '@mui/material/Menu';
import FaceIcon from '@mui/icons-material/Face';
import LogoutIcon from '@mui/icons-material/Logout';
import {useNavigate} from 'react-router-dom';
function Header(){




    const clearCacheData = () => {
        // axios.get(baseUrl + logoutUrl).then(() => {
        //     window.location.replace((document.getElementById("app").getAttribute("data-url")));
        // });
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
            <div className='header-left-part' onClick={() =>  navigate('/voice-note')} >
                <Saral/>
                <span className='bjp-text'>भारतीय जनता पार्टी</span>
            </div>

            <div className='header-right-part'>
                <div className='navbar-profile'>
                    {/*<span>{JSON.parse(document.getElementById("app").getAttribute("data-user")).name}</span>*/}
                    <span>
                        <span className="d-block">Ram Prasad</span><br/>
                        {/*<span>Level</span>*/}
                    </span>

                    <HeaderArrowDown onClick={handleOpen}/>
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
                    <MenuItem className='logout-navbar-text' onClick={() => clearCacheData()}>{<><FaceIcon/>&emsp;Profile</>}</MenuItem>
                    <MenuItem className='logout-navbar-text' onClick={() => clearCacheData()}>{<><LogoutIcon/>&emsp;Logout</>}</MenuItem>
                </Menu>
            </div>
        </div>



    )
}

export default Header;