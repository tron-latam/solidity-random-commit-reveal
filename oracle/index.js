/* eslint-disable no-await-in-loop */
const TronWeb = require('tronweb');
const { randomHashedString, waitForBlocks } = require('./utils');
require('dotenv').config();

/**
 * Creates and pushes the random hashed seed to the contract
 * @param {TronWeb.contracr} contract
 */
async function pushSeed(contract) {
  const { source, hash } = randomHashedString();
  await contract.setSealedSeed(hash).send({ shouldPollResponse: true });
  return source;
}

/**
 * Starts a loop that monitors and seends a hashed seed when needed
 * @param {TronWeb.contract} contract
 * @param {Number} blocksToWait
 * @param {TronWeb} tronWebJs
 */
async function startProcess(contract, blocksToWait, storedBlockNumber, tronWebJs) {
  console.log('Starting Process...');
  let currentBlockNumber = (await tronWebJs.trx.getCurrentBlock()).block_header.raw_data.number;
  while (true) {
    let currentSource = null;
    const seedSet = await contract.seedSet().call();
    if (!seedSet || currentBlockNumber > (storedBlockNumber + 256)) {
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
      console.log('Seed is set, waiting...', storedBlockNumber, currentBlockNumber);
      const toWait = storedBlockNumber - currentBlockNumber + 257;
      // Seed expires after 256 blocks
      console.log(`Waiting: ${toWait} blocks...`);
      await waitForBlocks(toWait, tronWebJs);
      currentBlockNumber = (await tronWebJs.trx.getCurrentBlock()).block_header.raw_data.number;
    }
  }
}

/**
 * Initialize contract and TronWeb object
 */
async function init() {
  console.log('Initializing...');
  const tronWebJs = new TronWeb({
    fullHost: process.env.ORACLE_FULL_HOST,
    privateKey: process.env.ORACLE_PRIVATE_KEY,
  });
  const contract = await tronWebJs
    .contract().at(process.env.ORACLE_CONTRACT_ADDRESS);
  const blocksToSkip = (await contract.blocksToSkip().call()).toNumber();
  const storedBlockNumber = (await contract.storedBlockNumber().call()).toNumber();
  return {
    contract, tronWebJs, blocksToWait: blocksToSkip + 1, storedBlockNumber,
  };
}

(async () => {
  const {
    contract, blocksToWait, tronWebJs, storedBlockNumber,
  } = await init();
  process.on('SIGINT', () => {
    console.log('Terminating proces..');
    process.exit();
  });
  console.log('Initialized');
  // await contract.unsetSealedSeed().send({ shouldPollResponse: true });
  startProcess(contract, blocksToWait, storedBlockNumber, tronWebJs);
})();
