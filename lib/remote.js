'use strict'
var axios = require('axios');
var Validator = require('mzen-schema/lib/schema/validator');

var requestArgs = {};

function doRemote(value, options, name, root) 
{
  var url = options && options['url'] ? options['url'] : '';
  var method = options && options['method'] ? options['method'] : 'POST';
  var params = options && options['params'] ? options['params'] : {};
  var data = options && options['data'] ? options['data'] : {};
  var timeout = options && options['timeout'] ? options['timeout'] : 5000;
  var axios = options && options['axios'] ? options['axios'] : axios.create({timeout: timeout});

  data['value'] = value;

  return axios({
    url: url,
    method: method,
    params: params,
    data: data
  });
}

Validator.remote = function(value, options, name, root) 
{
  var url = options && options['url'] ? options['url'] : '';
  // Interval is the minimum amount of time betweem requests in milliseconds
  var interval = options && options['internval'] ? options['internval'] : 1500;
  var validationId = url + '|' + name;

  // We set the validation options to a gobal object
  // - these options may be modified multiple times before the actual request is made to the server
  requestArgs[validationId] = arguments;

  var promise = new Promise((resolve, reject) => {
    setTimeout(function(){
      resolve(doRemote.apply(null, requestArgs[validationId]));
    }, interval);
  });

  return promise;
};
