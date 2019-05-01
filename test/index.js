const per = require('../lib'),
testHexStr = 'abcdef0123456789',
testIter = 8;

(function(){
  console.log('sync test starting...')
  let syncEnc = per.encSync(testHexStr, testIter, {reverse:true, buff: [1,2]});
  console.log(syncEnc)
  let syncDec = per.decSync(syncEnc.data, syncEnc.key, syncEnc.iterations, {reverse:true, buff: [1,2]})
  console.log(syncDec)
  if(syncEnc.err){
    console.log('sync enc test failure.')
  } else if(syncDec.err){
    console.log('sync dec test failure.')
  } else {
    console.log('sync test done.')
  }

  console.log('callback test starting...')
  per.enc(testHexStr, testIter, {reverse:true, buff: [1,2]}, function(err, res){
    if(err){return console.log('callback enc test failure.')}
    console.log(res)
    per.dec(res.data, res.key, testIter, {reverse:true, buff: [1,2]}, function(err, i){
      if(err){return console.log('callback dec test failure.')}
      console.log(i)
      console.log('callback test done.')
    })
  })

  console.log('promise test starting...')
  per.encP(testHexStr, testIter, {reverse:true, buff: [1,2]}).then(function(res){
    console.log(res)
    per.decP(res.data, res.key, testIter, {reverse:true, buff: [1,2]}).then(function(res){
      console.log(res)
      console.log('promise test done.')
    }).catch(function(err){
      console.log('promise dec test failure.')
    })
  }).catch(function(err){
    console.log('promise enc test failure.')
  })
})()
