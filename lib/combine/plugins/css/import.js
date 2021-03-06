/**
 * css合并
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-05-30 17:32:53
 * @version $Id$
 */
(function(module){
  var fs = require('fs'),
    path = require('path'),
    uglify = require('uglify-js'),
    util = require('../../util');

  var impReg = /@import\s*(url\s*\()*\s*(['|"]?)([\w\-\.\:\/\\\s\?\:\,\=]+)\2\s*(\))*\s*;?/igm;
  var urlReg = /url\s*\(\s*(['|"]?)([^\)|\:]+)\1\s*\)/ig;

  path.existsSync = fs.existsSync ? function(uri) {
    return fs.existsSync.call(fs, uri)
  } : path.existsSync;

  /** 
   * 打包方法
   * @param  {[Object]} fileMap    [要打包的文件列表]，可以为空
   * @param  {[Opts]} Opts       [配置参数]
   * @param  {[Object]} beCombined [已经打过的文件列表]
   */
  function combine(fileMap,Opts,beCombineMap){
    var filePath = Opts.file.path, 
      codeStr = fileMap[filePath] || util.getFileCodeStr(filePath,Opts), 
      baseDir = Opts.baseDir;

    beCombineMap[filePath] = 1; // 已经合并过了
    return codeStr.replace(impReg,function(){
      var key = arguments[3];

      if (key) {
        if(/^http/gi.test(key)){
          return '@import url('+key+');';
        }
        var uri = util.getAbsolutePathByKey(key,filePath);
        Opts.file.path = uri;
        return beCombineMap[uri] == 1 ? '' : combine(fileMap,Opts,beCombineMap)+'\n';
      }
    });
  }

  module.exports = {
    combine: combine
  };
})(module);