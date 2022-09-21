"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const simple_json_db_1 = __importDefault(require("simple-json-db"));
const web3_1 = __importDefault(require("../interface/web3"));
class walAccount {
    constructor(email, password, privateKey) {
        this.email = email;
        this.password = password;
        this.privateKey = privateKey;
    }
    login(email = this.email, pass = this.password) {
        let account;
        if (this.address)
            return this;
        else if (this.privateKey)
            account = web3_1.default.getAccount(this.privateKey);
        else if (!(email && typeof email === "string" && (email === null || email === void 0 ? void 0 : email.trim()) !== ""))
            throw Error("Invalid Email Address for Account Login");
        else if (!(pass && typeof pass === "string" && (pass === null || pass === void 0 ? void 0 : pass.trim()) !== ""))
            throw Error("Invalid Password for Account Login");
        else {
            let eEmail = (0, utils_1.encrypt)(this.email, walAccount.default.passPhrase);
            if (!walAccount.dbCore.has(eEmail))
                throw Error("Account related to Email is not Present in Database");
            let eJson = walAccount.dbCore.get(eEmail);
            account = web3_1.default.web3.eth.accounts.decrypt(eJson, pass);
        }
        Object.assign(this, account);
        return this;
    }
    create(email = this.email, pass = this.password) {
        if (this.privateKey)
            throw Error("Wallet has already been logged in");
        else if (!(email && typeof email === "string" && (email === null || email === void 0 ? void 0 : email.trim()) !== ""))
            throw Error("Invalid Email for encryption of Account");
        else if (!(pass && typeof pass === "string" && (pass === null || pass === void 0 ? void 0 : pass.trim()) !== ""))
            throw Error("Invalid Password for encryption of Account");
        let eEmail = (0, utils_1.encrypt)(this.email, walAccount.default.passPhrase);
        if (walAccount.dbCore.has(eEmail))
            throw Error("Account related to Email is Alraedy Present in Database");
        let account = web3_1.default.createAccount();
        Object.assign(this, account);
        let eJson = account.encrypt(pass);
        walAccount.dbCore.set(eEmail, eJson);
        return this;
    }
}
walAccount.default = { passPhrase: "account" };
walAccount.dbCore = new simple_json_db_1.default(__dirname + "/cache/accs.json");
exports.default = walAccount;
