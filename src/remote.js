'use strict'
var axios = require('axios');
var Validator = require('mzen-schema/lib/schema/validator');
var ObjectPathAccessor = require('./object-path-accessor');

function doRemote(value, options, name)
{
  var url = options && options['url'] ? options['url'] : '';
  var method = options && options['method'] ? options['method'] : 'POST';
  var params = options && options['params'] ? options['params'] : {};
  var paramPaths = options && options['paramPaths'] ? options['paramPaths'] : {};
  var data = options && options['data'] ? options['data'] : {};
  var dataPaths = options && options['dataPaths'] ? options['dataPaths'] : {};
  var dataRoot = options && options['root'] ? options['root'] : {};
  var timeout = options && options['timeout'] ? options['timeout'] : 5000;
  var axiosInstance = options && options['axios'] ? options['axios'] : axios.create({timeout: timeout});

  params = Object.assign({}, pathsToObject(paramPaths, dataRoot), params);
  data = Object.assign({}, pathsToObject(dataPaths, dataRoot), data, {value});

  return axiosInstance({
    url: url,
    method: method,
    params: params,
    data: data
  });
}

function pathsToObject(paths, data)
{
  var result = {};
  Object.keys(paths).forEach((fieldName) => {
    result[fieldName] = ObjectPathAccessor.getPath(paths[fieldName], data);
  });
  return result;
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
