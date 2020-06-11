/* eslint-disable no-undef */
const Random = artifacts.require('./Random.sol');
const { randomHashedString } = require('../../oracle/utils');


// The following tests require TronBox >= 2.1.x
// and Tron Quickstart (https://github.com/tronprotocol/docker-tron-quickstart)

contract('Random', (accounts) => {
  let random;
  const [owner, bob, alice, camile, dexter, earl, roger] = accounts;


  before(async () => {
    random = await Random.deployed();
    if (accounts.length < 5) {
      // Set your own accounts if you are not using Tron Quickstart
      // [owner, bob, alice, camile, roger]
    }
    await random.setBlocksToSkip(0);
    console.log(await random.blocksToSkip());
  });

  it('Should have same hash result as contract', async () => {
    const { source, hash } = randomHashedString();
    const blockHashed = await random.hash(source);
    assert.equal(hash, blockHashed, 'Hash calculated differently');
  });

  it('Should set sealed Seed', async () => {
    const { hash } = randomHashedString();
    await random.setSealedSeed(hash);
    const seedSet = await random.seedSet();
    assert.equal(seedSet, true, 'Seed set is not true');
    await random.unsetSealedSeed();
  });

  it('Should publish number after setting seed', async () => {
    const { source, hash } = randomHashedString();
    const unset = await random.getnumbers();
    assert.equal(unset.length, 0, 'Random number is not empty');
    await random.setSealedSeed(hash);
    await random.publishNumber(source);
    const result = await random.getnumbers();
    // eslint-disable-next-line no-underscore-dangle
    const bigNumber = tronWeb.toBigNumber(result[0]._hex);
    assert.notEqual(bigNumber[0], 0, 'Random number is 0');
  });
});
