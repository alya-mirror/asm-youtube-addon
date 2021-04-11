# asm-youtube-addon

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

A react component that gets and show youtube videos using voice commands. 
It was created as an Addon for [alya-smart-mirror](https://github.com/alronz/alya-smart-mirror) for showing youtube videos and play the chosen video in the mirror.

[build-badge]: https://img.shields.io/travis/user/repo/master.png?style=flat-square
[build]: https://travis-ci.org/user/repo

[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package

[coveralls-badge]: https://img.shields.io/coveralls/user/repo/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/user/repo
## Demo 
![output_ozlcjy](https://user-images.githubusercontent.com/21360696/36668907-1e347252-1af3-11e8-97b1-4ed41e027166.gif)
 
## Usage 
First configure [asm-youtube-addon-skill](https://github.com/alya-mirror/asm-youtube-addon-skill) and follow the steps there.Then you can just import it as react component and use it.
* Note : for using it as a react component in a different project than [alya-smart-mirror](https://github.com/alronz/alya-smart-mirror) you have to create a folder called 'certs' in the main directory and copy the certs you get from [AWSIot](https://github.com/alya-mirror/asm-youtube-addon-skill/blob/master/documentation/awsIOT.md). 
```
npm install asm-youtube-addon --save
```
### Example
```js
import ASMYoutubeModlue from 'asm-youtube-addon'

render(<ASMYoutubeModlue/>, document.getElementById('root').appendChild(document.createElement("div")));
```
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
 
