// hex-xor demo
_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

function test(testStr, iterations, conf){

  // callback
  per.enc(testStr, iterations, conf, function(err, i){
    if(err){return console.log(err)}
    $('#callbackenc').val(i.data)

    per.dec(i.data, i.key, i.iterations, conf, function(err,res){
      if(err){return console.log(err)}
      $('#callbackdec').val(res.data)
    })
  })

  //sync
  let encSync = per.encSync(testStr, iterations, conf);
  $('#syncenc').val(encSync.data)
  let decSync = per.decSync(encSync.data, encSync.key, encSync.iterations, conf);
  $('#syncdec').val(decSync.data)

  // promise
  per.encP(testStr, iterations, conf).then(function(res) {
    $('#promiseenc').val(res.data);

    per.decP(res.data, res.key, res.iterations, conf).then(function(res) {
      $('#promisedec').val(res.data);
    }).catch(function(err){
      console.log(err)
    });

  }).catch(function(err){
    console.log(err)
  });
}

function str2hex(str) {
	let hex = '';
	for(var i=0;i<str.length;i++) {
		hex += '' + str.charCodeAt(i).toString(16).toUpperCase();
	}
	return hex;
}

const div = $('<div />'),
headerTpl = _.template('<h5 class="{{title}} col-sm-12">{{title}}</h5>'),
inputTpl = _.template('<div class="col-sm-6"><div class="form-group"><label>{{title}}</label><input id="{{ID}}" type="text" class="form-control"></div></div>'),
bodyConf = {
  header:['callback', 'sync', 'promise'],
  input: {dec: 'decode', enc: 'encode'},
  test: ['string', 'hex']
};

$('body').append(
  div.clone().addClass('container').append(
    $('<h2 />', {
      class:'mt-4 mb-4',
      text:'hex-permutation-cipher'
    }),
    div.clone().addClass('row demo').append(
      inputTpl({title: 'config', ID:'config'}),
      inputTpl({title: 'iterations', ID:'iteration'})
    )
  )
)

$(document).ready(function() {
  let defaults = {
    reverse:true,
    lower:true,
    buff:[1,2]
  };

  $('#config').val(JSON.stringify(defaults))

  _.forEach(bodyConf.test, function(i){
    $('.demo').append(inputTpl({title: i, ID: i}))
  })

  _.forEach(bodyConf.header, function(i){
    $('.demo').append(headerTpl({title: i}))
    _.forIn(bodyConf.input, function(key,val){
      $('.' + i).after(inputTpl({title: key, ID: i + val}))
    })
    $('.' + i).siblings('div').find('input').not('#config,#iteration,#string').attr('readonly', true)
  })

  $('#string').on('keyup', function(){
    $('#hex').val(str2hex($(this).val())).keyup()
  }).on('change', function(){
    $('#hex').val(str2hex($(this).val())).keyup()
  })

  $('#hex').on('keyup', function(){
    console.log($(this).val())
    test($(this).val(), parseInt($('#iteration').val()), JSON.parse($('#config').val()))
  })

  $('#iteration').attr({
    type: 'number',
    value: 1,
    min: 0,
    max: 15,
    step: 1
  }).on('change', function(){
    $(this).val(_.round($(this).val()))
    $('#hex').keyup();
  }).on('keyup', function(){
    $(this).val(_.round($(this).val()))
    $('#hex').keyup();
  })

});
