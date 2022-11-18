const Web3 = require("web3");
const fs = require('fs');
const postgres = require("./postgres")
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const Log = require("./logger.js");



class ContractListener {
    
    #nodeHostURL= process.env.NODE_HOST_URL;
    #Owner_PrivateKey = process.env.OWNER_PRIVATEKEY;
    #pg = new postgres();
    //Contracts Info for updating Shipping info
    #parentContract;
    #parentABI;
    #ownerWallet; // owner of the contract. Needed for wrting to contract
    //genomeContract Info
    #genome_ContractAddress;
    #genome_ContractABI;
    //web3 objects
    #web3;
    #web3ContractObject;
    #log
    
    
    constructor() {
        
        this.#genome_ContractAddress = "0x5a28c5ff79ea75f2a2f88502f420de5504fb6902"; //<--Test contract for genome
        this.#genome_ContractABI= this.LoadAbiFromFile();
        this.#nodeHostURL = this.#nodeHostURL;
        
        this.generateWeb3Provider();
       
        this.#web3ContractObject = new this.#web3.eth.Contract(this.#genome_ContractABI, this.#genome_ContractAddress);
        this.#ownerWallet = this.#web3.eth.accounts.privateKeyToAccount(this.#Owner_PrivateKey)
        
        let rawdata = fs.readFileSync('./ABIS/main_Mumbai.json');
        this.#parentABI = JSON.parse(rawdata);

        //used to write to
        this.#parentContract = new this.#web3.eth.Contract(this.#parentABI ,'0x876369051f81694077Fb2A3971e8Ce569F1262Fc',{
            from:this.#ownerWallet.address
        });

        this.#log = new Log()
    }


    updateDeliveryStatus(tokenID,status){
        let cid = uuidv4()
        let proc = 'updateDeliveryStatus'
        this.#parentContract.methods.updateDeliveryStatus(tokenID,status).call({from:this.#ownerWallet.address},function(error,result){
            console.log(proc,result,cid);
            console.log(proc,error,cid);
        })
    }


    startListening() {
        let cid = uuidv4()
        let proc = 'StartListening'
        this.#web3ContractObject.events.Transfer()
            .on('connected', () => {
                
                this.#log.logInfo("Started Listening on Contract:" + this.#genome_ContractAddress);
            })
            .on('data', async (event) => {
                let cid1 = uuidv4() //generate new uid for when data is recieved
                let proc1 = 'Transfer.Data'
                this.#log.logInfo(proc1,event,cid1);
                let delivStatus = await this.#pg.getDeliveryStatus(event.returnValues.tokenId)
                
                //on first transfer we consider it at origin
                if (delivStatus === undefined || delivStatus === null  || delivStatus != '0')
                {
                    this.#pg.upsertTokenTransferInfo(this.#genome_ContractAddress,event.returnValues.tokenId,'0')
                    this.updateDeliveryStatus(event.returnValues.tokenId,'0')
                }

            })
            .on('error', (event) => {
                this.#log.logInfo(proc,'Error'+event,cid);
            })
            .on('end', () => {
                this.#log.logInfo(proc,"Ended Listening on Contract:" + this.#genome_ContractAddress,cid);
            });
    }




    generateWeb3Provider() {
        this.#web3 = new Web3();
        this.#web3.setProvider(new Web3.providers.WebsocketProvider(
            this.#nodeHostURL, {
                clientConfig: {
                    keepalive: true,
                    keepaliveInterval: 30000
                },
                reconnect: {
                    auto: true,
                    delay: 5000,
                    maxAttempts: 10,
                    onTimeout: true
                }
            }
        ));

    }


    LoadAbiFromFile() {
        let rawdata = fs.readFileSync('./ABIS/aminoV1_Mumbai.json');
        let abi = JSON.parse(rawdata);
        return abi
    }

}

module.exports = ContractListener