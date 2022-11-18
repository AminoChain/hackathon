
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const cors = require('cors');
const ShipEngineClient = require("./models/shipEngineClient.js")
const ContractListener = require("./models/contractListener.js")
const postgres = require("./models/postgres.js");
const Log = require("./models/logger.js");

const app = express()
const pg = new postgres();
const client = new ShipEngineClient()
const log = new Log()
const procname = 'index'
const correlationID = uuidv4()
const env = process.env.ENV
const genomeContract = process.env.GENOME_CONTRACT

app.use(express.json());
app.use(cors());



log.logInfo(procname, "Starting Server", correlationID)

log.logInfo(procname, "Starting Contract Listener", correlationID)
const listener = new ContractListener()
try {
  listener.startListening()
}
catch (ex) {
  listener.startListening()
}

//interfaces with mockAPI
app.route('/getpackageStatus/:trackingnumber')
  .get((req, res) => {
    let cid = uuidv4();
    let tn = req.params.trackingnumber
    log.logInfo('getpackageStatus', `Start getStatus ${tn}`, cid)
    if (env != 'TEST') {
      Client.GetTestData()
    }
    else {
      Client.getPackageData(tn).then((data) => { res.json(data) })
    }
    log.logInfo('getpackageStatus', `End getStatus`, cid)
  })

/*Note: This is baked in for demo purposes and should be removed after the demo
*/
app.route('/settokenStatus/:tokenID/:status')
.get((req, res) => {
  let cid = uuidv4();
  let tokenID = req.params.tokenID
  let status = req.params.status
  log.logInfo('setpackageStatus', `Start setStatus tokenID = ${tokenID}, status = ${status}`, cid)
  pg.upsertTokenTransferInfo(genomeContract,tokenID,status)
  listener.updateDeliveryStatus(tokenID, status)
  log.logInfo('setpackageStatus', `END setStatus`, cid)
})

//TODO: once working with real shipper apis remove this
app.route('/createTrackingNumber/:tokenID/:trackingNumber')
  .get((req, res) => {
    let cid = uuidv4();
    let tID = req.params.tokenID
    let tn = req.params.trackingNumber
    log.logInfo('createTrackingNumber', `Start createTrackingNumber TN= ${tn} tokenID = ${tID}`, cid)
    pg.updateTokenTrackingNumber(genomeContract, tID, tn);
    log.logInfo('createTrackingNumber', `END createTrackingNumber`, cid)
  })



app.listen(8888, 'localhost').on('error', (err) => {
  log.logInfo('procname', err, correlationID);
});


