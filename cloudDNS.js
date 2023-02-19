const axios = require('axios');
require('dotenv').config();

const loginTest = async () => {
    let request = {
        url: 'https://api.cloudns.net/login/login.json',
        method: 'post',
        data: {}
    }
    request.data['auth-id'] = process.env.CLOUDNS_AUTH_ID;
    request.data['auth-password'] = process.env.CLOUDNS_AUTH_PASSWORD

    let response = null;

    // console.log(request);
    // return;

    try {
        response = await axios(request);
    } catch (e) {
        console.error(e);
        return false;
    }
    
    console.log(response.data);
    return response.data;
}

loginTest();