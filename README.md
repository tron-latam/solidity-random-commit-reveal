
# solidity-random-commit-reveal

> An example of a commit reveal scheme for pseudorandom number generation

## Introduction

This is a project that intends to show a simple way to generate trustless pseudorandom numbers in Solidity. This is heavily inspired by this: https://github.com/fravoll/solidity-patterns/blob/master/docs/randomness.md and such pattern was followed on this implementation.
  
## Getting Started

It is recommended that windows users use an Ubuntu Subsystem command console for an optimal TronBox experience. More information [here](https://developers.tron.network/docs/tron-box-user-guide) or [here](https://docs.microsoft.com/en-us/windows/wsl/install-win10)

The Shasta faucet is a great place to deploy test contracts and get you address loaded up for free. This code is setup to deploy there.
[https://www.trongrid.io/shasta/](https://www.trongrid.io/shasta/)

[TronLink](https://www.tronlink.org/) is required as it acts as a login to our application.

**Clone or download project**

**Install dependencies**
```sh
$ npm install
```
**Compile contracts**
```sh
$ npm run tronbox-compile
```
**Deploy contracts to Shasta test network**
```sh
$ npm run tronbox-migrate
```
**Copy rename .env.example into .env**
After renaming the file replace the variables with the adequate test keys. Look for your contract address and your testing private keys

## Available Commands

-  `npm run dev` - Runs Oracle that generates random number and compiles and hot-reloads UI for development.
-  `npm run oracle` - Runs Oracle that generates random number.
-  `npm run serve` - Compiles and hot-reloads for development.
-  `npm run build` - Compiles and minifies for production
-  `npm run lint` - Lints and fixes files.
-  `npm run test:unit` - Runs Vue unit tests.
- `npm run test:contracts` - Runs Ballot contract unit tests.
- `npm test` - Runs full test suite.


## External References

-  [TronBox User Guide](https://developers.tron.network/docs/tron-box-user-guide)

-  [TronWeb Api Reference ](https://developers.tron.network/reference#tronweb-object-1)

-  [Vue Docs](https://vuejs.org/v2/guide/index.html)

## Contributing

Want to contribute? Don't hesitate in opening an issue or pull request.