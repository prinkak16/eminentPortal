import axios from "axios";
import {apiBaseUrl, allSteps, fileUpload} from "../api_endpoints";
// export const getFormData = (data) => {
//     console.log('data', data);
//   return axios.post(apiBaseUrl + allSteps, data)
//       .then((response) => {
//           // console.log('API response:', response.data);
//       })
//       .catch((error) => {
//           // console.error('API error:', error);
//       });
// }
export const getFormData = async (data) => {
    const formData =  {
        "form_type": "eminent_personality",
        "data": data,
        "device_info": {
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
            "os": "Mac",
            "browser": "Chrome",
            "device": "Macintosh",
            "os_version": "mac-os-x-15",
            "browser_version": "117.0.0.0",
            "deviceType": "desktop",
            "orientation": "landscape"
        },
        "is_draft": true,
        "version": 3,
        "form_step": 1,
        "state_id": 4,
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
export const getPartyData = axios.get(apiBaseUrl + 'metadata/state_party_list');
// export const getPinCodeData = axios.get(`https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:${pincode}`)

const params = {
    location_type: 'State',
    location_id: 1,
    required_location_type: 'AssemblyConstituency',
};

export const getAssemblyData = (assembly) => {
    return axios.get(apiBaseUrl + 'metadata/get_required_locations' + assembly)
}