import sJdb from "simple-json-db";

class DbManager {
  static core = new sJdb(__dirname + "/cache/accs.json");
}
