import { encode } from "./lib/utils";
import sJdb from "simple-json-db";
import web3Mod from "./interface/web3";
class wallet {
  [x: string]: any;
  static dbCore: sJdb<any> = new sJdb(__dirname + "/../cache/wallets.json");

  constructor(
    public email: string,
    public password: string,
    public metadata?: any
  ) {
    this.email = email;
    this.password = password;
    this.metadata = metadata;
    this.base = web3Mod.web3.eth.accounts.wallet;
    this.#parseTokens();
  }

  login(object: any): this {
    if (!object)
      throw Error(
        "Invalid Private Key or Address in the Object Value for Account Login"
      );
    this.base.add(object);
    this.#sync();
    return this;
  }

  create(count: number = 1): this {
    let walBase = web3Mod.web3.eth.accounts.wallet.create(count);
    if (!walBase) throw Error("Invalid Wallet Base Value Captured to Cache");
    this.base = walBase;
    this.#sync();
    return this;
  }

  remove(address: string) {
    if (!address)
      throw Error("Invalid Address in the Object Value for Account Deletion");
    let response = this.base.remove(address);
    if (!response)
      throw Error("Wrong Address in the Object Value for Account Deletion");
    this.#sync();
    return this;
  }

  clear() {
    this.base.clear();
    this.#sync();
    return this;
  }

  #parseTokens(): void {
    if (
      !(
        this.email &&
        typeof this.email === "string" &&
        this.email?.trim() !== ""
      )
    )
      throw Error("Invalid Email Address to fetch Accounts from Redis DB");
    else if (!wallet.dbCore.has(encode(this.email))) return undefined;
    let object = wallet.dbCore.get(encode(this.email));
    if (!object?.eCrypts) return undefined;
    if (
      !(
        this.password &&
        typeof this.password === "string" &&
        this.password?.trim() !== ""
      )
    )
      throw Error("Invalid Password to DeCrypts Wallet from Redis DB");
    let walBase = this.base.decrypt(object?.eCrypts, this.password);
    if (!walBase)
      throw Error("Wrong Password to DeCrypts Wallet from Redis DB");
    this.base = walBase;
    this.metadata = object?.metadata;
  }

  #sync() {
    let eCrypts = this.base.encrypt(this.password);
    wallet.dbCore.set(encode(this.email), {
      metadata: this.metadata,
      eCrypts: eCrypts,
    });
  }
}

export default wallet;
