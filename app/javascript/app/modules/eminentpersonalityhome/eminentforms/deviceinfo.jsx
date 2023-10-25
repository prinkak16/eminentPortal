import React from 'react';
import {DeviceInfoProvider} from '../context/deviceinfocontext';
// import PersonalDetails from '../eminentforms/personaldetails'

function DeviceInfo() {
    return (
        <DeviceInfoProvider>
            <div>
                {/*<PersonalDetails />*/}
            </div>
        </DeviceInfoProvider>
    );
}

export default DeviceInfo;
