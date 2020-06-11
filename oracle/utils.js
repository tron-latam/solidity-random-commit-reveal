const keccak256 = require('keccak256');
const crypto = require('crypto');

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

function randomString() {
  const randomSeed = Math.random().toString(36).substring(7);
  const randomByteSeed = crypto.randomBytes(24).toString('hex');
  const hash = crypto.createHash('sha256');
  const mixedString = randomByteSeed + randomSeed;
  hash.update(mixedString);
  return `0x${hash.digest('hex')}`;
}

function randomHashedString() {
  const source = randomString();
  const hash = keccak256(source).toString('hex');
  return { source, hash: `0x${hash}` };
}

async function waitForBlocks(amountToWait, tronWeb) {
  let blocksPassed = 0;
  let { blockID } = await tronWeb.trx.getCurrentBlock();
  while (blocksPassed < amountToWait) {
    // eslint-disable-next-line no-await-in-loop
    await sleep(3050);
    // eslint-disable-next-line no-await-in-loop
    const newBlockId = (await tronWeb.trx.getCurrentBlock()).blockID;
    if (newBlockId !== blockID) {
      blocksPassed += 1;
      blockID = newBlockId;
      console.log('Got new block!', blocksPassed);
    }
  }
  return blockID;
}

module.exports = {
  randomHashedString,
  randomString,
  waitForBlocks,
};
