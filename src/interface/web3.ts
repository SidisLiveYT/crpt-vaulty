import Web3 from "web3";

class Web3_Manager {
  static web3 = new Web3(Web3.givenProvider || "http://localhost:8256");
  static getAccount(key: string, create = true) {
    let acc = Web3_Manager.web3.eth.accounts.privateKeyToAccount(key);
    if (!acc && create) return Web3_Manager.web3.eth.accounts.create();
    else return acc;
  }
}

export default Web3_Manager;
