import { encrypt } from "./utils";
import sJdb from "simple-json-db";
class Account {
  static dbCore: sJdb<any> = new sJdb(__dirname + "/cache/accs.json");
  email: string;
  password: string;
  privateKey: string | undefined;
  constructor(email: string, password: string, privateKey?: string) {
    this.email = email;
    this.password = password;
    this.privateKey = privateKey;
  }
  login(phrase: string) {
    if (!(phrase && typeof phrase === "string" && phrase?.trim() !== ""))
      return undefined;
    let eEmail = encrypt(this.email);
  }

  #cache(json?: any): void {
    if (!json?.address) return undefined;
    let encrypted = json.encrypt(this.password);
  }
}

export default Account;
