const walAcc = require("../dist/wallet").default;

let acc = new walAcc("runinmascot@github.com", "foobar");
console.log(acc.base["0"]);
