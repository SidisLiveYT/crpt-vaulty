"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Account_instances, _Account_cache;
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const simple_json_db_1 = __importDefault(require("simple-json-db"));
class Account {
    constructor(email, password, privateKey) {
        _Account_instances.add(this);
        this.email = email;
        this.password = password;
        this.privateKey = privateKey;
    }
    login(phrase) {
        if (!(phrase && typeof phrase === "string" && (phrase === null || phrase === void 0 ? void 0 : phrase.trim()) !== ""))
            return undefined;
        let eEmail = (0, utils_1.encrypt)(this.email);
    }
}
_Account_instances = new WeakSet(), _Account_cache = function _Account_cache(json) {
    if (!(json === null || json === void 0 ? void 0 : json.address))
        return undefined;
    let encrypted = json.encrypt(this.password);
};
Account.dbCore = new simple_json_db_1.default(__dirname + "/cache/accs.json");
exports.default = Account;
