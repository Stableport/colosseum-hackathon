require('dotenv').config();
const axios = require('axios')
const { v4 : uuid } = require('uuid')
const crypto = require("crypto-js");

const apiKey = process.env.API_KEY
const secretKey = process.env.API_SECRET
axios.defaults.baseURL = 'https://sandbox.api.yellowcard.io';

const httpAuth = (path, method, body) => {

    const date = new Date().toISOString();
    const hmac = crypto.algo.HMAC.create(crypto.algo.SHA256, secretKey);

    hmac.update(date, 'utf8')
    hmac.update(path, 'utf8')
    hmac.update(method, 'utf8')

    if(body) {
        let bodyHmac = crypto.SHA256(JSON.stringify(body)).toString(crypto.enc.Base64)
        hmac.update(bodyHmac)
    }

    const hash = hmac.finalize();
    const signature = crypto.enc.Base64.stringify(hash)


    return {
        "X-YC-Timestamp": date,
        "Authorization": `YcHmacV1 ${apiKey}:${signature}`
    }
}

axis.interceptors.request.use(
    (config) => {
        let hash = httpAuth(config.url, config.method.toUpperCase(), config.data)
        config.headers['Authorization'] = hash['Authorization']
        config.headers['X-YC-Timestamp'] = hash['X-YC-Timestamp']
        return config;
      return;
    },
    (err) => {
        return Promise.reject(err);
    }
);

async function SubmitPaymentRequest() {
    let {data: channelData} = await axios.get('/business/channels');
    let {data: networkData} = await axios.get('/business/networks');
    let {data: ratesData} = await axios.get('/business/rates');

    let {channels, networks, rates} = {...networkData, ...channelData, ...ratesData}
    let activeChannels = channels.filter(c => c.status === 'active' && c.rampType === 'withdraw')
    let supportedCountries = [...new Set(activeChannels.map(c => c.country))]

    // Select channel
    let channel = activeChannels[0]

    let supportedNetworks = networks.filter(n => n.status === 'active' && n.channelIds.includes(channel.id));
    let network = supportedNetworks[0]

    const currency = rates.filter(r => r.code === 'NGN')
  
    const amountUSD = 50
    const localAmount = amountUSD * currency[0].buy
    
    const reason = 'entertainment'
    
    const sender = {
        name: "Sample Name",
        country: "US",
        phone: "+12222222222",
        address: "Sample Address",
        dob: "mm/dd/yyyy",
        email: "email@domain.com",
        idNumber: "0123456789",
        idType: "license"
    }

    const destination = {
        accountNumber: "1111111111",
        accountType: network.accountNumberType,
        country: network.country,
        networkId: network.id,
        accountBank: network.code
    }

    let {data: destinationConf} = await axios.post(`/business/details/bank`, {
        accountNumber: destination.accountNumber,
        networkId: destination.networkId
    })
    destination.accountName = destinationConf.accountName

    let request = {
        sequenceId: uuid(),
        channelId: channel.id,
        currency: channel.currency,
        country: channel.country,
        amount: amountUSD, //Amount in USD to transact or
        // localAmount, The amount in local currency to transact
        reason,
        destination,
        sender,
        forceAccept: true
    }

    const response = await axios.post('/business/payments', request)
    console.log(`response: ${JSON.stringify(response.data)}`)
    return response;
}

(async () => {
    await SubmitPaymentRequest()
})();