import axios from 'axios';
import {apiBaseUrl} from "../api_endpoints";


export const getFilters = ()  => {
    return axios.get(apiBaseUrl + 'filters/home');
}
// export const getVacancy
export const getData = (filters = '') => {
    return axios.get(apiBaseUrl + 'custom_member_forms/list?type=eminent_personality' + filters);
}
export const getVacancyAnalytics=()=>{
    return axios.get(apiBaseUrl + 'vacancy/position_analytics');
}
export const statsData = () => {
    return axios.get(apiBaseUrl + '/stats/home');
}

export const deleteMember = (deleteId) => {
    return axios.delete(apiBaseUrl + 'custom_member_forms/delete_member?' + deleteId  );
}

export const updateState = (updatedState) => {
    return axios.post(apiBaseUrl + 'custom_member_forms/update_aasm_state', updatedState);
}
export  const  uploadVacancy=(formData, config)=>{
    return axios.post(apiBaseUrl + 'vacancy/manual_upload', formData);
}

export const fetchMobile = (config,number) => {
    return axios.get(apiBaseUrl + 'custom_member_forms/fetch_by_number',{
        params: {
            phone_number: number
        },
        headers: config?.headers
    });
}

export const fetchUser = (config) => {
    return axios.get(apiBaseUrl + 'eminent/fetch',{
        params: {
        },
        headers: config?.headers
    });
}
export  const getSlottingTable =()=>{
    return axios.get('https://slottingpage-default-rtdb.firebaseio.com/slottingTable.json')
}
export const getSlottingPsuData=()=> {
    return axios.get('https://psudetails-default-rtdb.asia-southeast1.firebasedatabase.app/psudetail.json')
}