"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_1 = __importDefault(require("web3"));
class Web3_Manager {
}
Web3_Manager.web3 = new web3_1.default(web3_1.default.givenProvider || "http://localhost:8256");
Web3_Manager.getAccount = (key) => Web3_Manager.web3.eth.accounts.privateKeyToAccount(key);
Web3_Manager.createAccount = () => Web3_Manager.web3.eth.accounts.create();
exports.default = Web3_Manager;
