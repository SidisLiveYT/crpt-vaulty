"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _wallet_instances, _wallet_parseTokens, _wallet_sync, _wallet_eventEmit;
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./lib/utils");
const simple_json_db_1 = __importDefault(require("simple-json-db"));
const web3_1 = __importDefault(require("web3"));
class wallet {
    constructor(email, password, metadata) {
        var _a;
        this.email = email;
        this.password = password;
        this.metadata = metadata;
        _wallet_instances.add(this);
        this.email = email;
        this.password = password;
        this.web3 = new web3_1.default(web3_1.default.givenProvider || (metadata === null || metadata === void 0 ? void 0 : metadata.provider) || "http://localhost:8256");
        this.metadata = metadata;
        this.base = this.web3.eth.accounts.wallet;
        __classPrivateFieldGet(this, _wallet_instances, "m", _wallet_parseTokens).call(this);
        __classPrivateFieldGet(this, _wallet_instances, "m", _wallet_eventEmit).call(this, (_a = this.metadata) === null || _a === void 0 ? void 0 : _a.provider);
    }
    login(object) {
        if (!object)
            throw Error("Invalid Private Key or Address in the Object Value for Account Login");
        this.base.add(object);
        __classPrivateFieldGet(this, _wallet_instances, "m", _wallet_sync).call(this);
        return this;
    }
    create(count = 1) {
        let walBase = this.web3.eth.accounts.wallet.create(count);
        if (!walBase)
            throw Error("Invalid Wallet Base Value Captured to Cache");
        this.base = walBase;
        __classPrivateFieldGet(this, _wallet_instances, "m", _wallet_sync).call(this);
        return this;
    }
    remove(address) {
        if (!address)
            throw Error("Invalid Address in the Object Value for Account Deletion");
        let response = this.base.remove(address);
        if (!response)
            throw Error("Wrong Address in the Object Value for Account Deletion");
        __classPrivateFieldGet(this, _wallet_instances, "m", _wallet_sync).call(this);
        return this;
    }
    clear() {
        this.base.clear();
        __classPrivateFieldGet(this, _wallet_instances, "m", _wallet_sync).call(this);
        return this;
    }
    get addresses() {
        return this.accounts.map((aC) => aC === null || aC === void 0 ? void 0 : aC.address);
    }
    get accounts() {
        let arr = [];
        for (let i = 0, max = this.base.length; i < max; ++i)
            arr.push(this.base[`${i}`]);
        return arr;
    }
}
_wallet_instances = new WeakSet(), _wallet_parseTokens = function _wallet_parseTokens() {
    var _a, _b;
    if (!(this.email &&
        typeof this.email === "string" &&
        ((_a = this.email) === null || _a === void 0 ? void 0 : _a.trim()) !== ""))
        throw Error("Invalid Email Address to fetch Accounts from Redis DB");
    else if (!wallet.dbCore.has((0, utils_1.encode)(this.email)))
        return undefined;
    let object = wallet.dbCore.get((0, utils_1.encode)(this.email));
    if (!(object === null || object === void 0 ? void 0 : object.eCrypts))
        return undefined;
    if (!(this.password &&
        typeof this.password === "string" &&
        ((_b = this.password) === null || _b === void 0 ? void 0 : _b.trim()) !== ""))
        throw Error("Invalid Password to DeCrypts Wallet from Redis DB");
    let walBase = this.base.decrypt(object === null || object === void 0 ? void 0 : object.eCrypts, this.password);
    if (!walBase)
        throw Error("Wrong Password to DeCrypts Wallet from Redis DB");
    this.base = walBase;
    this.metadata = object === null || object === void 0 ? void 0 : object.metadata;
}, _wallet_sync = function _wallet_sync() {
    var _a;
    __classPrivateFieldGet(this, _wallet_instances, "m", _wallet_eventEmit).call(this, (_a = this.metadata) === null || _a === void 0 ? void 0 : _a.provider);
    let eCrypts = this.base.encrypt(this.password);
    wallet.dbCore.set((0, utils_1.encode)(this.email), {
        metadata: this.metadata,
        eCrypts: eCrypts,
    });
}, _wallet_eventEmit = function _wallet_eventEmit(provider) {
    if (!(provider && (provider === null || provider === void 0 ? void 0 : provider.startsWith("http://localhost"))))
        return undefined;
    this.web3.eth.clearSubscriptions((error) => error ? console.log(error) : undefined);
    this.web3.eth.subscribe("logs", { address: this.addresses }, (error, log) => error ? console.log(error) : console.log(log));
};
wallet.dbCore = new simple_json_db_1.default(__dirname + "/../cache/wallets.json");
exports.default = wallet;
