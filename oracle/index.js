/* eslint-disable no-await-in-loop */
const TronWeb = require('tronweb');
const { randomHashedString, waitForBlocks } = require('./utils');
require('dotenv').config();

async function pushSeed(contract) {
  const { source, hash } = randomHashedString();
  await contract.setSealedSeed(hash).send({ shouldPollResponse: true });
  return source;
}

async function startProcess(contract, blocksToWait, tronWebJs) {
  console.log('Running loop');
  while (true) {
    let currentSource;
    const seedSet = await contract.seedSet().call();
    console.log(seedSet);
    if (!seedSet) {
      currentSource = await pushSeed(contract);
    }
    await waitForBlocks(blocksToWait, tronWebJs);
    await contract.publishNumber(currentSource).send({ shouldPollResponse: true });
    const currentNumbers = await contract.getnumbers().call();
    console.log(currentNumbers);
    // eslint-disable-next-line no-underscore-dangle
    const bigNumber = tronWebJs.toBigNumber(currentNumbers[currentNumbers.length - 1]._hex);
    console.log(bigNumber);
  }
}

async function init() {
  console.log('Process Init');
  const tronWebJs = new TronWeb({
    fullHost: process.env.ORACLE_FULL_HOST,
    privateKey: process.env.ORACLE_PRIVATE_KEY,
  });
  const contract = await tronWebJs
    .contract().at(process.env.ORACLE_CONTRACT_ADDRESS);
  const blocksToSkip = (await contract.blocksToSkip().call()).toNumber();
  return { contract, tronWebJs, blocksToWait: blocksToSkip + 1 };
}

(async () => {
  const { contract, blocksToWait, tronWebJs } = await init();
  process.on('SIGINT', () => {
    console.log('Terminating proces..');
    process.exit();
  });
  console.log('Initialized');
  // await contract.unsetSealedSeed().send({ shouldPollResponse: true });
  startProcess(contract, blocksToWait, tronWebJs);
})();
