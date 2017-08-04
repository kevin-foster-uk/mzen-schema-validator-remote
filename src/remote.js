'use strict'
var axios = require('axios');
var Validator = require('mzen-schema/lib/schema/validator');

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
  var promise = new Promise((resolve, reject) => {
    doRemote.apply(null, arguments).then((response) =>{
      resolve(response.data);
    });
  });

  return promise;
};
