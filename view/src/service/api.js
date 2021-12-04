import axios from 'axios';
import config from "../config"

function api(options = { withAuth: true }) {
    if (options.withAuth) {
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = { Authorization: `${authToken}` };
    }
    return axios
}

export async function getTodos() {
    return api()
        .get(config.API + '/todos')
        .then((response) => {
            return response.data
        })
        .catch((err) => {
            console.log("getTodos", err);
            return false
        });
}

export async function getUsers() {
    const response = await api().get(config.API + '/users')
    return response.data
}

export async function getOffers(userId) {
    const response = await api().get(config.API + '/todos/' + userId)
    return response.data
}

export async function getOffer(offerId) {
    const response = await api().get(config.API + '/offer/' + offerId)
    return response.data
}

export async function addOffer(offer) {
    const response = await api().post(config.API + '/offer/', offer)
    return response.data
}

export async function editOffer(offerId, offerDetails) {
    const response = await api().put(config.API + '/offer/' + offerId, offerDetails)
    return response.data
}

export async function removeOffer(offerId) {
    const response = await api().delete(config.API + '/offer/' + offerId)
    return response.data
}

