const express = require("express");
const { Worker } = require("worker_threads");

const app = express();
const port = process.env.PORT || 3000;
const THREAD_COUNT = 4;
const ProccessingArray=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21];
var workerPromises=[];

app.get("/non-blocking/", (req, res) => {
  res.status(200).send("This page is non-blocking");
});

function createWorker(inpData) {
  return new Promise(function (resolve, reject) {
    const worker = new Worker("./worker.js", {
      workerData: { data: inpData },
    });
    worker.on("message", (data) => {
      resolve(data);
    });
    worker.on("error", (msg) => {
      reject(`An error ocurred: ${msg}`);
    });
  });
}

app.get("/blocking", async (req, res) => {
  if (workerPromises.length > 0) {
    res.status(500).send(`the last thread is busy`);
    return;
  }
  for (let i = 0; i < THREAD_COUNT; i++) {
    let subArray=[];
   if (i<THREAD_COUNT-1)
    subArray= ProccessingArray.slice(i*(Math.trunc(ProccessingArray.length/THREAD_COUNT)), i*(Math.trunc(ProccessingArray.length/THREAD_COUNT)) +Math.trunc(ProccessingArray.length/THREAD_COUNT));
   else
     subArray= ProccessingArray.slice(i*(Math.trunc(ProccessingArray.length/THREAD_COUNT)), ProccessingArray.length);
    
    workerPromises.push(createWorker(subArray));
  }
  const thread_results = await Promise.all(workerPromises);
  const total =
    thread_results[0] +
    thread_results[1] +
    thread_results[2] +
    thread_results[3];
  res.status(200).send(`result is ${total}`);
  workerPromises.splice(0, workerPromises.length);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
