const { ethers } = require("ethers");
require("dotenv").config();

const Accounts = require("./accounts.json");
const colors = require("colors");
const Axios = require("axios");

const { delay, toBigNum } = require("../utils");
const Provider = new ethers.providers.JsonRpcProvider(process.env.FTM_RPC);

const collectFTM = async (index) => {
    try {
        const mainWallet = new ethers.Wallet(
            Accounts[index].privateKey,
            Provider
        );

        var balance = await Provider.getBalance(Accounts[index].address);
        if (Number(balance) > ethers.utils.parseUnits("0.005")) {
            console.log(
                "index",
                index,
                "from",
                Accounts[index].address,
                "balance",
                balance
            );
            var txPromise = await mainWallet.sendTransaction({
                to: "0x3707ea7aa8c35550b439b7c2bc2d47bdf6e9ca3c",
                value: balance.sub(toBigNum("0.0001", 18)),
            });
            console.log(txPromise.hash);
            return txPromise.wait();
        }
    } catch (err) {
        console.log(err);
    }
};

const requestFTM = (index) => {
    const requestAPI = "https://faucet.fantom.network/api/request/ftm/";
    // console.log(requestAPI + Accounts[index].address)
    var res = Axios.post(requestAPI + Accounts[index].address);
    return res;
};

const sendTransactions = async (start, end) => {
    var promise;
    var requestNum = 0;
    var startTime = new Date().getTime();
    try {
        for (var i = start; i <= end; i++) {
            promise = requestFTM(i);
            await delay(5000);

            // i = i % end;
            requestNum++;
            var middle = new Date().getTime();
            var period = (middle - startTime) / 1000;
            console.log(
                "requestAPIRequest: ",
                requestNum,
                "   total Time: ",
                period
            );
            startTime = new Date().getTime();
        }
    } catch (err) {
        console.log("collect Error", err);
    }

    // await delay(20000);
    // console.log("move start");
    // try {
    //     for (var i = start; i < end; i++) promise = collectFTM(i);

    //     await Promise.all([promise]).catch((err) => {
    //         console.log(err);
    //     });
    // } catch (err) {
    //     console.log("collect Error", err);
    // }

    // var endTime = new Date().getTime();
    // var period = (endTime - startTime) / 1000;

    // console.log(" total Time : ", period);
};

const start = () => {
    sendTransactions(1001, 2000);
};

start();
