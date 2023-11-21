import axios from 'axios';
import {apiBaseUrl} from "../api_endpoints";


export const getFilters = ()  => {
    return axios.get(apiBaseUrl + 'filters/home');
}
export const getFiltersForGOM = (params) => {
    return axios.get(apiBaseUrl + 'filters/gom_management')
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

export const uploadVacancy = (formData) => {
    return axios.post(apiBaseUrl + 'vacancy/manual_upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const fetchMobile = (number) => {
    return axios.get(apiBaseUrl + 'custom_member_forms/fetch_by_number',{
        params: {
            phone_number: number
        }
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

export const getMinistryWiseData = (params) => {
    return axios.get(apiBaseUrl + 'vacancy/list', { params });
}
export const getMinistryWiseFilterData = (params) => {
    return axios.get(apiBaseUrl + 'filters/vacancy_ministry_wise', { params });
}

export const getMinistry = () => {
    return axios.get(apiBaseUrl + 'ministry');
}

export const getMinisters = () => {
    return axios.get(apiBaseUrl + 'gom/minister_list');
}
export const getGOMTableData = () => {
    return axios.get(apiBaseUrl + 'gom/assigned_ministries')
        .then(response => {
            console.log("Data received:", response.data);
            return response.data; // You can return the data if needed
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            throw error; // Rethrow the error to handle it at the caller's end
        });
}
export const assignMinistriesAndMinister = (ministryIds, ministerId) => {
    return axios.post(apiBaseUrl + `user/${ministerId}/assign_ministries`, {
        ministry_ids: ministryIds
    })
}