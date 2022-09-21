import { decrypt, encrypt } from "./utils";
import sJdb from "simple-json-db";
import Web3_Manager from "../interface/web3";
class walAccount {
  static default = { passPhrase: "account" };
  static dbCore: sJdb<any> = new sJdb(__dirname + "/cache/accs.json");

  email: string;
  password: string;
  privateKey: string | undefined;
  id: string | undefined;
  address: any;

  constructor(email: string, password: string, privateKey?: string) {
    this.email = email;
    this.password = password;
    this.privateKey = privateKey;
  }

  login(email: string = this.email, pass: string = this.password): this {
    let account;
    if (this.address) return this;
    else if (this.privateKey)
      account = Web3_Manager.getAccount(this.privateKey);
    else if (!(email && typeof email === "string" && email?.trim() !== ""))
      throw Error("Invalid Email Address for Account Login");
    else if (!(pass && typeof pass === "string" && pass?.trim() !== ""))
      throw Error("Invalid Password for Account Login");
    else {
      let eEmail = encrypt(this.email, walAccount.default.passPhrase);
      if (!walAccount.dbCore.has(eEmail))
        throw Error("Account related to Email is not Present in Database");
      let eJson = walAccount.dbCore.get(eEmail);
      account = Web3_Manager.web3.eth.accounts.decrypt(eJson, pass);
    }
    Object.assign(this, account);
    return this;
  }

  create(email: string = this.email, pass: string = this.password): this {
    if (this.privateKey) throw Error("Wallet has already been logged in");
    else if (!(email && typeof email === "string" && email?.trim() !== ""))
      throw Error("Invalid Email for encryption of Account");
    else if (!(pass && typeof pass === "string" && pass?.trim() !== ""))
      throw Error("Invalid Password for encryption of Account");
    let eEmail = encrypt(this.email, walAccount.default.passPhrase);
    if (walAccount.dbCore.has(eEmail))
      throw Error("Account related to Email is Alraedy Present in Database");
    let account = Web3_Manager.createAccount();
    Object.assign(this, account);
    let eJson = account.encrypt(pass);
    walAccount.dbCore.set(eEmail, eJson);
    return this;
  }
}

export default walAccount;
