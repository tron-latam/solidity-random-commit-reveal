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
  console.log('Starting Process...');
  let tries = 0;
  while (true) {
    let currentSource = null;
    const seedSet = await contract.seedSet().call();
    if (!seedSet || tries > 255) {
      console.log('Setting new seed');
      currentSource = await pushSeed(contract);
      await waitForBlocks(blocksToWait, tronWebJs);
      await contract.publishNumber(currentSource).send({ shouldPollResponse: true });
      const currentNumbers = await contract.getnumbers().call();
      console.log('Current Numbers', currentNumbers);
      // eslint-disable-next-line no-underscore-dangle
      const bigNumber = tronWebJs.toBigNumber(currentNumbers[currentNumbers.length - 1]._hex);
      console.log('Latest big number', bigNumber);
    } else {
      console.log('Seed is set, waiting...');
      await waitForBlocks(blocksToWait, tronWebJs);
      tries += blocksToWait;
    }
  }
}

async function init() {
  console.log('Initializing...');
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
