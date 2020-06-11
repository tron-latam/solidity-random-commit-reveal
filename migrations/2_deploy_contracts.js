// eslint-disable-next-line no-undef
const Random = artifacts.require('./Random.sol');

// eslint-disable-next-line func-names
module.exports = function (deployer) {
  deployer.deploy(Random);
};
