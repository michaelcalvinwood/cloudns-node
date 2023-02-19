const axios = require('axios');
require('dotenv').config();

const executePostRequest = async (endpoint, data = {}) => {
    let request = {
        url: `https://api.cloudns.net${endpoint}`,
        method: 'post',
        data
    }
    request.data['auth-id'] = process.env.CLOUDNS_AUTH_ID;
    request.data['auth-password'] = process.env.CLOUDNS_AUTH_PASSWORD
    let response = null;

    try {
        response = await axios(request);
    } catch (e) {
        console.error(e);
        return false;
    }
    
    console.log(response.data);
    return response.data;
}

const loginTest = async () => executePostRequest('/login/login.json');

    
loginTest();