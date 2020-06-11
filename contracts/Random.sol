pragma solidity >=0.5 <=0.5.10;
import "@openzeppelin/contracts/access/Roles.sol";

contract Random {
    using Roles for Roles.Role;
    Roles.Role private owners;
    Roles.Role private oracles;
    uint private numOracles;

    bytes32 private sealedSeed;
    uint public blocksToSkip = 7;
    uint public storedBlockNumber;
    bool public seedSet = false;

    uint[] public randomNumbers;

    uint public blockNumber;
    bytes32 public blockHashNow;
    bytes32 public blockHashPrevious;

    event AddOracleEvent(address oracleAddress);
    event RemoveOracleEvent(address oracleAddress);

    event NewRandomNumber(uint number);

    modifier onlyOwner() {
        require(owners.has(msg.sender), "Not owner");
        _;
    }

    modifier onlyOracle() {
        require(oracles.has(msg.sender), "Not owner");
        _;
    }

    constructor () public {
        owners.add(msg.sender);
        oracles.add(msg.sender);
        numOracles++;
    }

    function addOracle (address _oracle) public {
        require(!oracles.has(_oracle), "Already an oracle!");
        oracles.add(_oracle);
        numOracles++;
        emit AddOracleEvent(_oracle);
    }

    function removeOracle (address _oracle) public onlyOwner {
        require(oracles.has(_oracle), "Address not an oracle");
        require (numOracles > 1, "Unable to remove last oracle.");
        oracles.remove(_oracle);
        numOracles--;
        emit RemoveOracleEvent(_oracle);
    }

    function setBlocksToSkip (uint _blocks) public onlyOwner {
        blocksToSkip = _blocks;
    }

    function setSealedSeed (bytes32 _sealedSeed) public onlyOracle {
        require(!seedSet, "Seed already set");
        sealedSeed = _sealedSeed;
        storedBlockNumber = block.number + blocksToSkip;
        seedSet = true;
    }

    function unsetSealedSeed () public onlyOwner {
        seedSet = false;
    }

    function publishNumber (bytes32 _seed) public onlyOracle {
        require(seedSet, "Seed yet to be set");
        require(storedBlockNumber <= block.number, 'Waiting for mined block');
        require(hash(_seed) == sealedSeed, 'Wrong seed');
        bytes32 hashToTest = blockhash(storedBlockNumber);
        bytes32 newHash = keccak256(abi.encodePacked(_seed, hashToTest));
        uint newNumber = uint(newHash);
        randomNumbers.push(newNumber);
        seedSet = false;
        emit NewRandomNumber(newNumber);
    }

    function getnumbers() public view returns(uint[] memory){
        return  randomNumbers;
    }

    function getRandomNumberCount() public view returns(uint){
        return  randomNumbers.length;
    }

    function isOwner(address account) public view returns (bool) {
        return owners.has(account);
    }

    function isOracle(address account) public view returns (bool) {
        return oracles.has(account);
    }

    function hash(bytes32 _toHash)
        public pure returns (bytes32)
    {
        return keccak256(abi.encodePacked(_toHash));
    }

}