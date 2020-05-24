const { timer } = require("rxjs");

const strJson = process.argv[2];
const startPublish = async () => {
  console.log(strJson);
  await timer(3000).toPromise();
  const ob = JSON.parse(strJson);
  console.log(ob.name);
  await timer(3000).toPromise();
}

startPublish();