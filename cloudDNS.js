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

    console.log(request);

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

const getCurrentIP = async () => executePostRequest('/ip/get-my-ip.json');

const getRecordTypes = async (zoneType = 'domain') => {
    data = {};
    data['zone-type'] = zoneType;

    executePostRequest('/dns/get-available-record-types.json', data);
}
const listRecords = async (domain, host=null, type = null) => {
    let data = {};
    data['domain-name'] = domain;
    if (type) data['type'] = type;
    if (host) data['host'] = host;
    data['order-by'] = 'host';

    let info = await executePostRequest('/dns/records.json', data);

    let records = [];

    for (const [key, value] of Object.entries(info)) {
        //console.log(`${key}: ${value}`);
        records.push(value);
    }

    return records;
}

/*
    Available TTL's:
        60 = 1 minute
        300 = 5 minutes
        900 = 15 minutes
        1800 = 30 minutes
        3600 = 1 hour
        21600 = 6 hours
        43200 = 12 hours
        86400 = 1 day
        172800 = 2 days
        259200 = 3 days
        604800 = 1 week
        1209600 = 2 weeks
        2592000 = 1 month
*/
const addARecord = async (domain, host, ip, ttl = 900) => {
    let data = { ttl, record: ip};
    data['record-type'] = 'A';
    data['domain-name'] = domain;
    if(host) data['host'] = host;

    return executePostRequest('/dns/add-record.json', data);
}

const getARecordIds = async (domain, host) => {
    let result = await listRecords(domain, host, 'A');
    let ids = [];
    for (let i = 0; i < result.length; ++i) {
        ids.push(result[i].id);
    }
    console.log(ids);
    return ids;
}

const deleteARecord = async (domain, host) => {
    const ids = await getARecordIds(domain, host);
    const data = {};

    data['domain-name'] = domain;
    if (host) data['host'] = host;

    for (let i = 0; i < ids.length; ++i) {
        data['record-id'] = ids[i];
        await executePostRequest('/dns/delete-record.json', data);
    }
}

deleteARecord('treepadcloud.com', 'test');


//listRecords('treepadcloud.com')
//addARecord('treepadcloud.com', 'test', '8.8.8.8');
getARecordIds('treepadcloud.com', 'test');

