# asm-youtube

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

A react component that gets and show youtube videos using voice commands [alya-smart-mirror](https://github.com/alronz/alya-smart-mirror).

[build-badge]: https://img.shields.io/travis/user/repo/master.png?style=flat-square
[build]: https://travis-ci.org/user/repo

[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package

[coveralls-badge]: https://img.shields.io/coveralls/user/repo/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/user/repo


## development
To run the component as an electron react component:

```
yarn dev
```


## building


```
yarn build
```

## cleaning


```
yarn clean
```


## testing


```
yarn test
```

## publishing


```
npm publish
```


## known issues
- Directory path will always resolve relative to the electron.js file. A workaround is to use path.resolve. Example below:

```
const path = window.require('path')
// I search for a file inside src/component/utils/certs , then use below code:
const certsFolderPath = path.resolve('src/component/utils/certs');
console.log(certsFolderPath) // /Users/xxxxx/alya/asm-date-time/src/component/utils/certs
```

- To require an npm module from a react component, do like:

```
const path = window.require('path')
```
 