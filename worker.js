const { workerData, parentPort } = require("worker_threads");

let sum = 0;
for (let i = 0; i < workerData.data.length; i++) {
  sum+=workerData.data[i];
}

parentPort.postMessage(sum);
