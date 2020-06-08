const fs = require('fs');
const path = require("path");

const customerDetailsjson = JSON.parse(fs.readFileSync(path.join(__dirname, './json/customerDetails.json'), 'utf-8'));
const selectedOfferCodejson = JSON.parse(fs.readFileSync(path.join(__dirname, './json/selectedOfferCode.json'), 'utf-8'));
const transactionDetailsjson = JSON.parse(fs.readFileSync(path.join(__dirname, './json/transactionDetails.json'), 'utf-8'));


function iscodeapplicable(customerDetailsjson, selectedOfferCodejson, transactionDetailsjson) {
    try {

        let expectedoutput = {
            "requestID": transactionDetailsjson.requestID,
            "codeType": selectedOfferCodejson.codeType,
            "validFor": selectedOfferCodejson.validFor,
            "codeName": selectedOfferCodejson.codeName,
            "applicable": "N",
            "message": ""
        }


        function arrayvalue(array, value) {
            for (a of array) {
                if (a == value) {
                    return true
                }
            }
            return false
        }

        // TODO: should handle all cases input

        if (!(arrayvalue(selectedOfferCodejson.termsFilter.channel), (transactionDetailsjson.channel).toLowerCase())) {
            expectedoutput.message = `Channel ${transactionDetailsjson.channel} is Not Applicable for ${selectedOfferCodejson.codeName}, Aviailable Channels [${selectedOfferCodejson.termsFilter.channel}]`;
            return JSON.stringify(expectedoutput);
        }

        // TODO: should handle all cases input
        if (!(arrayvalue(selectedOfferCodejson.termsFilter.transTypeCode), (transactionDetailsjson.transTypeCode).toLowerCase())) {
            expectedoutput.message = `Transaction Type ${transactionDetailsjson.transTypeCode} is Not Applicable for  ${selectedOfferCodejson.codeName} Aviailable Transaction types [${selectedOfferCodejson.termsFilter.transTypeCode}`;
            return JSON.stringify(expectedoutput);
        }

        // TODO: ALL items from CD.customerCat must be available in selectedOffercode.customerCategory.

        let array2 = selectedOfferCodejson.termsFilter.customerCategory;
        let array1 = customerDetailsjson.customerCategory;
        let flag = 0;


        count = 0;
        for (var i = 0; i < array1.length; i++) {
            if (arrayvalue(array2, array1[i])) {
                count += 1;
            }
        }
        if (count == array1.length) {
            flag = 1;
        }


        if (!flag) {
            expectedoutput.message = ` customer category  ${customerDetailsjson.customerCategory} is Not Applicable ${selectedOfferCodejson.codeName} available customer Categories `;
            return JSON.stringify(expectedoutput);
        }


        let currentcurrencycode = selectedOfferCodejson.termsFilter.currency;
        let array3 = [];
        flag = 0;
        for (let b in currentcurrencycode) {
            if (currentcurrencycode[b].currCode == transactionDetailsjson.currency) {
                flag = 1;
            }
            array3.push(currentcurrencycode[b].currCode)
        }
        if (!flag) {
            expectedoutput.message = `currency  ${transactionDetailsjson.currency} is Not Applicable ${selectedOfferCodejson.codeName} available currencies ${array3}`;
            return JSON.stringify(expectedoutput);
        }

        if (selectedOfferCodejson.minMaxAmountType == 'LCY') {
            if (!(parseInt(transactionDetailsjson.lcyAmount) > selectedOfferCodejson.minimumINRAmount && transactionDetailsjson.lcyAmount < parseInt(selectedOfferCodejson.maximumINRAmount))) {
                expectedoutput.message = `LCY amount ${transactionDetailsjson.lcyAmount} is Not with in range ${selectedOfferCodejson.codeName} range is from ${selectedOfferCodejson.minimumINRAmount} `;
                return JSON.stringify(expectedoutput);
            }

        }


        if ((selectedOfferCodejson.minMaxAmountType == 'FCY')) {
            if (!(parseInt(transactionDetailsjson.lcyAmount) > selectedOfferCodejson.minimumINRAmount && transactionDetailsjson.lcyAmount < parseInt(selectedOfferCodejson.maximumINRAmount))) {
                expectedoutput.message = `FYC amount ${transactionDetailsjson.lcyAmount} is Not with in range ${selectedOfferCodejson.codeName} range is from ${selectedOfferCodejson.minimumINRAmount}   `;
                return JSON.stringify(expectedoutput);
            }
        }

        // with format of (mm/dd/yyyy)
        var date = (transactionDetailsjson.transDate);
        var startdate = (selectedOfferCodejson.startDateTime);
        var enddate = (selectedOfferCodejson.endDateTime);

        let from = new Date(startdate)
        let to = new Date(enddate)
        let check = new Date(date)


        if (!((check < to) && (check > from))) {
            expectedoutput.message = `Transaction Date ${transactionDetailsjson.transDate} is Not with in Range ${selectedOfferCodejson.codeName} Range is from ${selectedOfferCodejson.startDateTime} to ${selectedOfferCodejson.endDateTime}`;
            return JSON.stringify(expectedoutput);
        }


        let ucode = customerDetailsjson.usedCodes;
        flag = 0;
        for (let a in ucode) {
            if (ucode[a].codeType == selectedOfferCodejson.codeType && (parseInt(ucode[a].usedCount) < selectedOfferCodejson.maximumUsagePerCustomer)) {
                flag = 1;
            }
        }
        if (!flag) {
            expectedoutput.message = `Customer has already used maximum no of usages ${selectedOfferCodejson.maximumUsagePerCustomer} available for offer code ${selectedOfferCodejson.codeName}`;

            return JSON.stringify(expectedoutput);
        }

        else {
            expectedoutput.applicable = "Y";
            return JSON.stringify(expectedoutput);
        }

    }
    catch (error) {
        return JSON.stringify("Something went wrong " + error.message);
    }
}

let output = iscodeapplicable(customerDetailsjson, selectedOfferCodejson, transactionDetailsjson);

console.log(output);
module.exports = iscodeapplicable;
