# hex-permutation-cipher
permutation cipher for encrypting and decrypting a hexadecimal string

Adds an extra layer of protection to your already encrypted code's hex output by essentially turning it into nothing but valid hex.

demo: https://angeal185.github.io/hex-permutation-cipher/

### Installation

npm

```sh
$ npm install hex-permutation-cipher --save
```

bower

```sh
$ bower install hex-permutation-cipher
```

git
```sh
$ git clone git@github.com:angeal185/hex-permutation-cipher.git
```
### nodejs

```js
const per = require('hex-permutation-cipher')
```

#### browser

```html
<script src="./dist/hex-permutation.min.js"></script>
```

#### info
* each hex character in the string is replaced with another random hex
  character and returns a decrypt key the same length as the string.
* padding can be added to the ciphertext output by using the buff option
* the encrypt function returns the generated key. dont lose it.

#### API

```js
//default options
{
    reverse: false, // {boolean} ~ reverse hex string
    lower: false, //  {boolean} ~ output lowercase hex
    buff: false //  {boolean/array} ~ prepend/append random hex buffer  
}
/*
* reverse should be set to either true or false for both
  encrypt/decrypt ~ default: false

* buff accepts either a boolean for false or an array for true.
  ~ [1,2] would prepend/slice 1 byte(2 hex chars) to the start
    and append/slice 2 bytes(4 hex chars) of random data to the end.
    this should not be left as false!
*/

/**
 *  callback
 *  @param {string} hex ~ valid hex string
 *  @param {integer} iterations
 *  @param {object} config ~ optional options
 *  @param {function} cb ~ callback function(err,data)
 **/
per.enc(hex, iterations, config, cb) //returns callback

/**
 *  callback
 *  @param {string} hex ~ valid hex string
 *  @param {string} key ~ decryption key
 *  @param {integer} iterations
 *  @param {object} config ~ optional options
 *  @param {function} cb ~ callback function(err,data)
 **/
per.dec(hex, key, iterations, config, cb) //returns callback

/**
 *  sync
 *  @param {string} hex ~ valid hex string
 *  @param {integer} iterations ~ integer
 *  @param {object} config ~ optional options
 **/
per.encSync(hex, iterations, config) //returns a string

/**
 *  sync
 *  @param {string} hex ~ valid hex string
 *  @param {string} key ~ decryption key
 *  @param {integer} iterations ~ integer
 *  @param {object} config ~ optional options
 **/
per.decSync(hex, key, iterations, config) //returns a string

/**
 *  promise
 *  @param {string} hex ~ valid hex string
 *  @param {integer} iterations ~ integer
 *  @param {object} config ~ optional options
 **/
per.encP(hex, iterations, config) //returns a promise

/**
 *  promise
 *  @param {string} hex ~ valid hex string
 *  @param {string} key ~ decryption key
 *  @param {integer} iterations ~ integer
 *  @param {object} config ~ optional options
 **/
per.decP(hex, key, iterations, config) //returns a promise

// demo
const testHexStr = 'ABCDEF0123456789',
config = {
    reverse: true,
    lower: true,
    buff: [2,4]
}
/* callback */
//encrypt
per.enc(testHexStr, 8, config, function(err, res){
  if(err){return console.log(err)}
  console.log(res)
  //decrypt
  per.dec(res.data, res.key, res.iterations, config, function(err, res){
    if(err){return console.log(err)}
    console.log(res)
  })
})
/* end callback */

/* sync */
// encrypt
let syncEnc = per.encSync(testHexStr, 8, config);
console.log(syncEnc)
// decrypt
let syncDec = per.decSync(syncEnc.data, syncEnc.key, syncEnc.iterations, config)
console.log(syncDec)
/* end sync */

/* promise */
//encrypt
per.encP(testHexStr, 8, config).then(function(res){
  console.log(res)
  //decrypt
  per.decP(res.data, res.key, res.iterations, config).then(function(res){
    console.log(res)
  }).catch(function(err){
    console.log(err)
  })
}).catch(function(err){
  console.log(err)
})
/* end promise */
```
