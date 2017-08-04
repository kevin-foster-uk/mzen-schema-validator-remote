'use strict';

var axios = require('axios');
var Validator = require('mzen-schema/lib/schema/validator');

function doRemote(value, options, name, root) {
  var url = options && options['url'] ? options['url'] : '';
  var method = options && options['method'] ? options['method'] : 'POST';
  var params = options && options['params'] ? options['params'] : {};
  var data = options && options['data'] ? options['data'] : {};
  var timeout = options && options['timeout'] ? options['timeout'] : 5000;
  var axiosInstance = options && options['axios'] ? options['axios'] : axios.create({ timeout: timeout });

  data['value'] = value;

  return axiosInstance({
    url: url,
    method: method,
    params: params,
    data: data
  });
}

Validator.remote = function (value, options, name, root) {
  var _arguments = arguments;

  var promise = new Promise(function (resolve, reject) {
    doRemote.apply(null, _arguments).then(function (response) {
      resolve(response.data);
    });
  });

  return promise;
};