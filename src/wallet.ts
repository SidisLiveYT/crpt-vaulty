import { encode } from "./lib/utils";
import sJdb from "simple-json-db";
import Web3 from "web3";

class wallet {
  static dbCore: sJdb<any> = new sJdb(__dirname + "/../cache/wallets.json");
  base: any;
  web3: Web3;

  constructor(
    public email: string,
    public password: string,
    public metadata?: any
  ) {
    this.email = email;
    this.password = password;
    this.web3 = new Web3(
      Web3.givenProvider || metadata?.provider || "http://localhost:8256"
    );
    this.metadata = metadata;
    this.base = this.web3.eth.accounts.wallet;
    this.#parseTokens();
    this.#eventEmit(this.metadata?.provider);
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
    let walBase = this.web3.eth.accounts.wallet.create(count);
    if (!walBase) throw Error("Invalid Wallet Base Value Captured to Cache");
    this.base = walBase;
    this.#sync();
    return this;
  }

  remove(address: string): this {
    if (!address)
      throw Error("Invalid Address in the Object Value for Account Deletion");
    let response = this.base.remove(address);
    if (!response)
      throw Error("Wrong Address in the Object Value for Account Deletion");
    this.#sync();
    return this;
  }

  clear(): this {
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

  #sync(): void {
    this.#eventEmit(this.metadata?.provider);
    let eCrypts = this.base.encrypt(this.password);
    wallet.dbCore.set(encode(this.email), {
      metadata: this.metadata,
      eCrypts: eCrypts,
    });
  }

  #eventEmit(provider?: string): void {
    if (!(provider && provider?.startsWith("http://localhost")))
      return undefined;
    this.web3.eth.clearSubscriptions((error: any) =>
      error ? console.log(error) : undefined
    );
    this.web3.eth.subscribe("logs", { address: this.addresses }, (error, log) =>
      error ? console.log(error) : console.log(log)
    );
  }

  get addresses(): Array<string> {
    return this.accounts.map((aC) => aC?.address);
  }

  get accounts(): Array<any> {
    let arr = [];
    for (let i = 0, max = this.base.length; i < max; ++i)
      arr.push(this.base[`${i}`]);
    return arr;
  }
}

export default wallet;
