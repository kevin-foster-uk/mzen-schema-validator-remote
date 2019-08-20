'use strict'
var ObjectPathAccessor = require('./object-path-accessor').ObjectPathAccessor;

function doRemote(value, options)
{
  var url = options && options['url'] ? options['url'] : '';
  var method = options && options['method'] ? options['method'] : 'POST';
  var params = options && options['params'] ? options['params'] : {};
  var paramPaths = options && options['paramPaths'] ? options['paramPaths'] : {};
  var data = options && options['data'] ? options['data'] : {};
  var dataPaths = options && options['dataPaths'] ? options['dataPaths'] : {};
  var dataRoot = options && options['root'] ? options['root'] : {};
  var timeout = options && options['timeout'] ? options['timeout'] : 5000;
  var axiosInstance = options && options['axios'] ? options['axios'] : function(){};

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

Object.defineProperty(exports, "__esModule", { value: true });
class ValidatorRemote {
    // Custom validator allows you to specify your own validator function
    // - the function should return boolean true for a valid value
    // - or return an error message string or an array of error messages
    validate(value, options) {
      var promise = new Promise((resolve, reject) => {
        doRemote.apply(null, arguments).then((response) =>{
          resolve(response.data);
        });
      });
    
      return promise;
    }
    getName() {
        return 'remote';
    }
}
exports.ValidatorRemote = ValidatorRemote;
exports.default = ValidatorRemote;
