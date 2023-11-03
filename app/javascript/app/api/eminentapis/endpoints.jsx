import axios from 'axios';
import {apiBaseUrl} from "../api_endpoints";

export const getFilters = ()  => {
    return axios.get(apiBaseUrl + 'metadata/config/home');
}

export const getData = (filters = '') => {
    return axios.get(apiBaseUrl + 'custom_member_forms/list?type=eminent_personality' + filters);
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

export const fetchMobile = (number) => {
    return axios.get(apiBaseUrl + 'custom_member_forms/fetch_by_number?phone_number=' + number);
}