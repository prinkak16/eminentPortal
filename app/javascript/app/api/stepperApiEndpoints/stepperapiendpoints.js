import axios from "axios";
import {apiBaseUrl, allSteps, fileUpload} from "../api_endpoints";
export const getFormData = async (data, activeStep) => {
    const formData =  {
        "form_type": "eminent_personality",
        "data": data,
        "device_info": userDeviceInfo(),
        "is_draft": true,
        "version": 3,
        "form_step": activeStep,
        "state_id": 30,
        "channel": "Link"
    }
    try {
        const response = await axios.post(apiBaseUrl + allSteps, formData);
        console.log('API response:', response.data);
    } catch (error) {
        console.error('API error:', error);
    }
}

export const getFileUpload = async (file, pdfUrl) => {
    let url = ''
    const formData = new FormData();
    formData.append("file", file);
    try {
        url = await axios.post(apiBaseUrl + fileUpload, formData);
    } catch (error) {
        console.log("Error:", error);
    }

    return url
}

export const getStepCtgry = axios.get(apiBaseUrl + 'metadata/categories');
export const getReligionData = axios.get(apiBaseUrl + 'metadata/religions');
export const getGenderData = axios.get(apiBaseUrl + 'metadata/genders');
export const getStateData = axios.get(apiBaseUrl + 'metadata/states');
export const getEducationData = axios.get(apiBaseUrl + 'metadata/educations');
export const getPartyData = axios.get(apiBaseUrl + 'metadata/state_party_list');;


const params = {
    location_type: 'State',
    location_id: 1,
    required_location_type: 'AssemblyConstituency',
};

export const getAssemblyData = (assembly) => {
    return axios.get(apiBaseUrl + 'metadata/get_required_locations' + assembly)
}

export const getLocationsData = (params) => {
    return axios.get(apiBaseUrl + 'metadata/get_required_locations' + params)
}

// export const sendOtp = (phoneNumber) => {
//     return axios.post(apiBaseUrl + 'custom_member_forms/send_otp?form_type=eminent_personality&phone=' + phoneNumber)
// }


export const sendOtp = async (phoneNumber) => {
    let url = ''
    const formData = new FormData();
    formData.append("form_type", 'eminent_personality');
    formData.append("phone", phoneNumber);
    try {
        url = await axios.post(apiBaseUrl + 'custom_member_forms/send_otp', formData);
    } catch (error) {
        alert(`Error: ${error.response.data.message}`);
    }
    return url
}

export const validateOtp = async (phoneNumber, otp) => {
    let url = ''
    const formData = new FormData();
    formData.append("form_type", 'eminent_personality');
    formData.append("phone", phoneNumber);
    formData.append("otp", otp);
    try {
        url = await axios.post(apiBaseUrl + 'custom_member_forms/validate_otp', formData);
    } catch (error) {
        alert(`Error: ${error.response.data.message}`);
    }
    return url
}

const userDeviceInfo =  () => {
    return  {
        "userAgent": navigator.userAgent,
        "os": navigator.platform,
        "browser": getBrowserInfo(navigator.userAgent),
        "device": getDevice(navigator.userAgent),
        "os_version": getOSVersion(),
        "browser_version": getBrowserVersion(),
        "deviceType": getDeviceType(),
        "orientation": getDeviceOrientation()
    }
}

function getDeviceType() {
    const userAgent = navigator.userAgent;

    if (userAgent.match(/Mobile/i)) {
        return "mobile";
    } else if (userAgent.match(/Tablet|iPad/i)) {
        return "tablet";
    } else {
        return "desktop";
    }
}

function getBrowserInfo(userAgent) {
    // Use regular expressions to extract browser name and version
    const match = userAgent.match(/(Chrome|Safari|Firefox|Edge)\/(\S+)/);
    if (match) {
        return match[1];
    }
    return 'Unknown';
}

function getDevice(userAgent) {
    // Check user agent for known device types
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
        return 'tablet';
    } else if (/Mobile|Android|iPhone|BlackBerry|(Opera Mini)/.test(userAgent)) {
        return 'mobile';
    }
    return 'desktop';
}

function getOSVersion() {
    const userAgent = navigator.userAgent;
    const windowsMatch = userAgent.match(/Windows NT (\d+\.\d+)/);
    if (windowsMatch) return "Windows " + windowsMatch[1];
    const macMatch = userAgent.match(/Mac OS X (\d+_\d+)/);
    if (macMatch) return "macOS " + macMatch[1].replace("_", ".");
    if (userAgent.includes("Linux")) return "Linux";
    return "";
}

function getBrowserVersion() {
    const ua = navigator.userAgent;
    const match = ua.match(/(Chrome|Firefox|Safari|Edge)\/([\d.]+)/);
    return match ? match[2] : "";
}

function getDeviceOrientation() {
    if (window.matchMedia("(orientation: portrait)").matches) {
        return "portrait";
    } else if (window.matchMedia("(orientation: landscape)").matches) {
        return "landscape";
    } else {
        return "unknown";
    }
}


