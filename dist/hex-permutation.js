function Permutation(){
  const baseStr = 'ABCDEF0123456789',
  defaults = {
    reverse: false,
    buff: false,
    lower: false
  };
  let obj = {},
  res;

  function reverseStr(i) {
    return i.split('').reverse().join('');
  }

  function randomKey(i) {
    try {
      let x = baseStr,
      str = "";
      for (j = 0; j < i; j++) {
        let m = randomNumber(0, x.length - 1);
        str += x.substr(m, 1);
        x = x.substr(0, m) + x.substr(m + 1, x.length);
      }
      return str;
    } catch (err) {
      if(err){return console.log(err)}
    }
  }

  function validHex(str){
    let regExp = /^[A-Fa-f0-9]*$/;
    return (typeof str === 'string' && regExp.test(str));
  }

  function keyNumbers(string) {
    try {
      let a = 1,
      k = Array(string.length);
      for (i = 0; i < baseStr.length; i++) {
        for (j = 0; j < string.length; j++) {
          if (string.substr(j, 1) === baseStr.substr(i, 1)) {
            k[j] = a;
            a++;
          }
        }
      }
      return k;
    } catch (err) {
      if(err){return console.log(err)}
    }
  }

  function randomNumber(min, max) {
    return Math.floor(Math.random() * (1 + max - min) + min);
  }

  function rand(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  function buffIt(data,arr){
    var str= '',
    hs = baseStr.split('');
    for (i = 0; i < arr[0] * 2; i++) {
      str += hs[rand(16)]
    }
    for (i = 0; i < arr[1] * 2; i++) {
      data += hs[rand(16)]
    }
    str += data;
    return str;
  }

  function permuteEncrypt(ptext, key) {

    let m = Math.ceil(ptext.length / key.length),
    mainArray = Array(m),
    keyn = keyNumbers(key),
    q = 0,
    str = '';

    for (i = 0; i < m; i++) {
      mainArray[i] = Array(key.length);
      for (s = 0; s < key.length; s++) {
        mainArray[i][s] = "";
      }
    }

    for (i = 0; i < m; i++) {
      for (j = 0; j < key.length; j++) {
        mainArray[i][j] = ptext.substr(q, 1);
        q = q + 1;
      }
    }

    let cArray = Array(m);

    for (i = 0; i < m; i++) {
      cArray[i] = Array(key.length);
      for (s = 0; s < key.length; s++) {
        cArray[i][s] = "";
      }
    }

    for (i = 0; i < m; i++) {
      for (j = 0; j < keyn.length; j++) {
        cArray[i][keyn[j] - 1] = mainArray[i][j];
      }
    }

    for (i = 0; i < m; i++) {
      str += cArray[i].join("");
    }

    return str;
  }

  function permuteDecrypt(ctext, key) {

    let m = Math.ceil(ctext.length / key.length),
    count = ctext.length,
    mainArray = Array(m),
    keyn = keyNumbers(key),
    q = 0,
    str = '';

    while (count % key.length !== 0) {
      count++;
    }

    count -= ctext.length + 1;

    for (i = 0; i < m; i++) {
      mainArray[i] = Array(key.length);
      for (s = 0; s < key.length; s++) {
        mainArray[i][s] = "";
      }
    }

    for (j = 1; j < count; j++) {
      mainArray[m - 1][parseInt(keyn[keyn.length - j]) - 1] = "blank";
    }

    for (i = 0; i < m; i++) {
      for (j = 0; j < key.length; j++) {
        if (mainArray[i][j] === "") {
          mainArray[i][j] = ctext.substr(q, 1);
          q++;
        }
      }
    }


    let pArray = Array(m);

    for (i = 0; i < m; i++) {
      pArray[i] = Array(key.length);
      for (s = 0; s < key.length; s++) {
        pArray[i][s] = "";
      }
    }

    for (i = 0; i < m; i++) {
      for (j = 0; j < keyn.length; j++) {
        for (k = 0; k < keyn.length; k++) {
          if (keyn[j] === k + 1) {
            pArray[i][j] = mainArray[i][k];
          }
        }
      }
    }

    for (j = 0; j < key.length + 1; j++) {
      if (pArray[m - 1][j] === "blank") {
        pArray[m - 1][j] = "";
      }
    }

    for (i = 0; i < m; i++) {
      str += pArray[i].join("");
    }
    return str;
  }


  function encrypt(text, iterations, conf) {
    try {

      if(!validHex(text)){
        obj.err = 'invalid hex string';
        return obj;
      }

      let key = randomKey(text.length);
      for (w = 0; w < iterations; w++) {
        text = permuteEncrypt(text.toUpperCase(), key);
      }

      if(conf.reverse){
        text = reverseStr(text)
      }

      if(conf.buff){
        text = buffIt(text,conf.buff)
      }

      if(conf.lower){
        text = text.toLowerCase();
      }

      obj.data = text;
      obj.key = key;
      obj.iterations = iterations;
      obj.err = false;
      return obj;
    } catch (err) {
      obj.err = 'permute encrypt error';
      return obj;
    }

  }

  function decrypt(ciphertext, key, iterations, conf) {
    try {

      if(!validHex(ciphertext)){
        obj.err = 'invalid hex string';
        return obj;
      }

      if(conf.buff){
        let arr = conf.buff;
        ciphertext = ciphertext.slice(arr[0] * 2, -(arr[1] * 2))
      }


      if(conf.reverse){
        ciphertext = reverseStr(ciphertext)
      }

      for (w = 0; w < iterations; w++) {
        ciphertext = permuteDecrypt(ciphertext.toUpperCase(), key);
      }

      if(conf.lower){
        ciphertext = ciphertext.toLowerCase();
      }

      obj.data = ciphertext;
      obj.err = false;
      return obj;
    } catch (err) {
      obj.err = 'permute decrypt error';
      return obj;
    }

  }

  return{
    enc: function(text, iterations, conf, cb){
      if(typeof conf === 'function' && !cb){
        cb = conf;
        conf = defaults;
      }
      res = encrypt(text, iterations, conf);
      let err = res.err;
      delete res.err;
      cb(err, res);
    },
    dec: function(ciphertext, key, iterations, conf, cb){
      if(typeof conf === 'function' && !cb){
        cb = conf;
        conf = defaults;
      }
      res = decrypt(ciphertext, key, iterations, conf)
      let err = res.err;
      delete res.err;
      cb(err, res);
    },
    encSync: function(text, iterations, conf){
      if(!conf){
        conf = defaults;
      }
      return encrypt(text, iterations, conf);
    },
    decSync: function(ciphertext, key, iterations, conf){
      if(!conf){
        conf = defaults;
      }
      return decrypt(ciphertext, key, iterations, conf)
    },
    encP: function(text, iterations, conf){
      if(!conf){
        conf = defaults;
      }
      return new Promise(function(resolve, reject){
        res = encrypt(text, iterations, conf);
        if(res.err){
          reject(res.err);
        } else {
          delete res.err;
          resolve(res);
        }
      })
    },
    decP: function(ciphertext, key, iterations, conf){
      if(!conf){
        conf = defaults;
      }
      return new Promise(function(resolve, reject){
        res = decrypt(ciphertext, key, iterations, conf);
        if(res.err){
          reject(res.err);
        } else {
          delete res.err;
          resolve(res);
        }
      })
    }

  }
}

const per = new Permutation();
