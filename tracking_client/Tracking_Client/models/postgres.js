const {
    Pool,
    Client
} = require("pg");
//TODO USe Secrets after development


class Postgres {

    #credentials = {
        user: "postgres",
        host: "localhost",
        database: "postgres",
        password: "password",
        port: 1727,
    };

    constructor() { }

    // Connect with a connection pool.
    async poolDemo() {
        const pool = new Pool(this.#credentials);
        const now = await pool.query("SELECT NOW()");
        await pool.end();

        return now;
    }


    // Connect with a client.
    async clientDemo(command) {
        const client = new Client(this.#credentials);
        await client.connect();
        const now = await client.query(command);
        await client.end();

        return now;
    }

    //Updates Target Tokens Delivery Status IN DB
    //dliv status 0,1,2 //will make this enum
    async upsertTokenTransferInfo(contractAddress, tokenID, deliv_sts) {
        try {
            //console.log("inserting", contractAddress, tokenID, deliv_sts)
            const clientResult = await this.clientDemo(`Insert INTO tokens VALUES('${contractAddress}','${tokenID}','${deliv_sts}',null) ON CONFLICT (contract_address,tokennumber) DO UPDATE SET contract_address = EXCLUDED.contract_address, tokennumber = EXCLUDED.tokennumber, deliverystatus = EXCLUDED.deliverystatus`);
            //console.log(`Insert INTO tokens VALUES(${contractAddress},${tokenID})`);
        } catch (ex) {
            //console.log('error in upsertTokenTransferInfo')
        }
    }

    //Updates Target Token With tracking number
    async updateTokenTrackingNumber(contractAddress, tokenID, tracking_num) {
        try {
            //console.log("inserting", contractAddress, tokenID, tracking_num)
            //console.log()
            const clientResult = await this.clientDemo(`UPDATE tokens set tracking_num ='${tracking_num}' where contract_address = '${contractAddress}' and tokennumber ='${tokenID}'`);
            //console.log(`Insert INTO tokens VALUES(${contractAddress},${tokenID})`);
        }
        catch (ex) {
            //console.log(ex)
        }
    }


    async loadContractInfo() {
        //console.log("inserting", contractAddress, tokenID)
        const clientResult = await this.clientDemo(`select * from contracts`);
        //console.log(`Insert INTO tokens VALUES(${contractAddress},${tokenID})`);
    }


    async getDeliveryStatus(tokenID) {
        //console.log("looking for contracts with tracking number")
        try {
            const clientResult = await this.clientDemo(`select * from tokens where tokennumber = '${tokenID}'`);

            //console.log(clientResult.rows[0])
            //console.log(clientResult.rows[0].deliverystatus);
            return clientResult.rows[0].deliverystatus
        }
        catch (ex) {
            return null
        }
    }



}

module.exports = Postgres;