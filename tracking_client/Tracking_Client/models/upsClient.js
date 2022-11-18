require('dotenv').config();
const http = require('node:http');
const trackingResponse = require("../views/trackingResponse.js")
const UPS_URL = process.env.UPS_URL;
const postgres = require("./postgres")
class UPSClient {
    #pg = new postgres(); 
    constructor() {
        if (UPS_URL === undefined || UPS_URL === null)
            console.log("UPS URL not Found");
    }

    async GetTestData(tn){
       info = await this.#pg.getDeliveryInfo(tn)
       return info
    }

    async getPackageData(trackingNumber) {
        return new Promise((resolve, reject) => {
            http.get(`${UPS_URL}/track/v1/details/${trackingNumber}`, res => {
                let chunks_of_data = [];

                res.on('data', (fragments) => {
                    chunks_of_data.push(fragments);
                });

                res.on('end', () => {
                    let responseBody = Buffer.concat(chunks_of_data);
                    
                    var resp = new trackingResponse(); 
                    resp = JSON.parse(responseBody.toString());
                    console.log(resp.trackResponse.shipment[0].package);
                    console.log(typeof(resp))
                    resolve(responseBody.toString());
                });

                res.on('error', error => {
                    Logger.logError('Failed to call UPS' + error);
                    reject(error);
                });

            });
        });

    }
}

module.exports = UPSClient;
