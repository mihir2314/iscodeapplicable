const { assert } = require('chai');
const fs = require('fs');
const path = require("path");
const iscodeapplicable = require('../app.js');

const customerDetailsjson = JSON.parse(fs.readFileSync(path.join(__dirname, '../json/customerDetails.json'), 'utf-8'));
const selectedOfferCodejson = JSON.parse(fs.readFileSync(path.join(__dirname, '../json/selectedOfferCode.json'), 'utf-8'));
const transactionDetailsjson = JSON.parse(fs.readFileSync(path.join(__dirname, '../json/transactionDetails.json'), 'utf-8'));
var expectedoutput = {
    "requestID": "1",
    "codeType": "D",
    "validFor": "RC",
    "codeName": "STUDENT",
    "applicable": "Y",
    "message": ""
}

describe('Testing iscodeapplicable function', function () {
    it('checking all rules', function () {
        const actualoutput = JSON.parse(iscodeapplicable(customerDetailsjson, selectedOfferCodejson, transactionDetailsjson));
        assert.deepEqual(actualoutput, expectedoutput)

    })
});