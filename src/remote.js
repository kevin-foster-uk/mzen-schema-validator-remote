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
  var axiosInstance = options && options['axios'] ? options['axios'] : axios.create({timeout: timeout});

  data['value'] = value;

  return axiosInstance({
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
  var interval = options && options['internval'] ? options['internval'] : 1000;
  var validationId = url + '|' + name;

  // If this vlaidation id already has arguments set then we have already
  // - queued the request
  var isQueued = requestArgs[validationId] !== undefined;

  // We set the validation options to a gobal object
  // - these options may be modified multiple times before the actual request is made to the server
  requestArgs[validationId] = arguments;

  var promise = new Promise((resolve, reject) => {
    if (isQueued) {
      setTimeout(function(){
        doRemote.apply(null, requestArgs[validationId]).then((response) =>{
          resolve(response.data);
        });
        delete requestArgs[validationId];
      }, interval);
    } else {
      resolve(true);
    }
  });

  return promise;
};
