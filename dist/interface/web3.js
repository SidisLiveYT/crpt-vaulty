"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_1 = __importDefault(require("web3"));
class Web3_Manager {
    static getAccount(key, create = true) {
        let acc = Web3_Manager.web3.eth.accounts.privateKeyToAccount(key);
        if (!acc && create)
            return Web3_Manager.web3.eth.accounts.create();
        else
            return acc;
    }
}
Web3_Manager.web3 = new web3_1.default(web3_1.default.givenProvider || "http://localhost:8256");
exports.default = Web3_Manager;
