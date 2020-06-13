pragma solidity >=0.5 <=0.5.10;
import "@openzeppelin/contracts/access/Roles.sol";

contract Random {
    uint constant MAX_DIGITS = 64;

    using Roles for Roles.Role;
    Roles.Role private _owners;
    Roles.Role private _oracles;
    uint private _numOracles;

    bytes32 private _sealedSeed;
    uint public blocksToSkip = 7;
    uint public storedBlockNumber;
    bool public seedSet = false;

    uint[] public randomNumbers;

    event AddOracleEvent(address oracleAddress);
    event RemoveOracleEvent(address oracleAddress);

    event NewRandomNumber(uint number);

    modifier onlyOwner() {
        require(_owners.has(msg.sender), "Not owner");
        _;
    }

    modifier onlyOracle() {
        require(_oracles.has(msg.sender), "Not owner");
        _;
    }

    constructor () public {
        _owners.add(msg.sender);
        _oracles.add(msg.sender);
        _numOracles++;
    }

    function addOracle (address oracle) public onlyOwner {
        require(!_oracles.has(oracle), "Already an oracle!");
        _oracles.add(oracle);
        _numOracles++;
        emit AddOracleEvent(oracle);
    }

    function removeOracle (address oracle) public onlyOwner {
        require(_oracles.has(oracle), "Address not an oracle");
        require (_numOracles > 1, "Unable to remove last oracle.");
        _oracles.remove(oracle);
        _numOracles--;
        emit RemoveOracleEvent(oracle);
    }

    function setBlocksToSkip (uint blocks) public onlyOwner {
        blocksToSkip = blocks;
    }

    /**
     * @dev Sets encrypted random seed
     * @param sealedSeed keccak256 encrypted seed
     */
    function setSealedSeed (bytes32 sealedSeed) public onlyOracle {
        if (storedBlockNumber + 255 < block.number) {
            seedSet = false;
        }
        require(!seedSet, "Seed already set");
        _sealedSeed = sealedSeed;
        storedBlockNumber = block.number + blocksToSkip;
        seedSet = true;
    }

    function unsetSealedSeed () public onlyOwner {
        seedSet = false;
    }

    /**
     * @dev Creates random number with raw unencrypted seed and publishes it
     * @param seed unencrypted sealedSeed
     */
    function publishNumber (bytes32 seed) public onlyOracle {
        require(seedSet, "Seed yet to be set");
        require(storedBlockNumber < block.number, 'Waiting for mined block');
        require(hash(seed) == _sealedSeed, 'Wrong seed');
        bytes32 hashToTest = blockhash(storedBlockNumber);
        bytes32 newHash = keccak256(abi.encodePacked(seed, hashToTest));
        uint newNumber = uint(newHash) % (10 ** MAX_DIGITS);
        randomNumbers.push(newNumber);
        seedSet = false;
        emit NewRandomNumber(newNumber);
    }

    function getnumbers() public view returns(uint[] memory){
        return  randomNumbers;
    }

    function getLatestRandomNumber() public view returns(uint){
        return  randomNumbers[randomNumbers.length - 1];
    }

    function getRandomNumberCount() public view returns(uint){
        return  randomNumbers.length;
    }

    /**
     * @dev Returns random numbers as a digits array
     */
    function getDigits() public view returns(uint[MAX_DIGITS] memory digits){
            uint number = randomNumbers[randomNumbers.length - 1];
            uint i = 0;
            while (number > 0 && i < MAX_DIGITS) {
                uint digit = uint(number % 10);
                number = number / 10;
                digits[i] = digit;
                i++;
            }
            return digits;
        }

    /**
     * @dev Returns random numbers as two a digits array
     */
    function getDoubleDigits() public view returns(uint[MAX_DIGITS / 2] memory digits){
        uint number = randomNumbers[randomNumbers.length - 1];
        uint i = 0;
        while (number > 0 && i < MAX_DIGITS / 2) {
            uint digit = uint(number % 100);
            number = number / 100;
            digits[i] = digit;
            i++;
        }
        return digits;
    }

    function isOwner(address account) public view returns (bool) {
        return _owners.has(account);
    }

    function isOracle(address account) public view returns (bool) {
        return _oracles.has(account);
    }

    function hash(bytes32 toHash) public pure returns (bytes32)
    {
        return keccak256(abi.encodePacked(toHash));
    }

}