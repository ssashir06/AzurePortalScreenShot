var page = require('webpage').create();
var fs = require('fs');
var system = require('system');
var env = system.env;

var loginMailAddress = system.args[1];
var loginPassword = system.args[2];
var loginTenantId = system.args[3];
var loginSubscriptionId = system.args[4];

var myRequire = function(filename) {
    var content = fs.read(phantom.libraryPath+'/'+filename);
    eval.call(null, content);
}
myRequire('_LibCommon.js');
myRequire('_LibAzure.js');

// 画面解像度
page.viewportSize = {
    width: 1920,
    height:1080 
};
page.customHeaders = {
	'Connection' : 'keep-alive',
	'Accept-Charset' : 'Shift_JIS,utf-8;q=0.7,*;q=0.3',
	'Accept-Language' : 'ja,en-US;q=0.8,en;q=0.6',
	'Cache-Control' : 'no-cache',
	'User-Agent' : 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36'
};

setInterval(function() {
    //savePage('realtimepage', true);
}, 2500);

new Dfr().append(function(dfr) {
    return azureManageLogin(dfr, loginMailAddress, loginPassword, loginTenantId, loginSubscriptionId);
}).append(function(dfr) {
    return azureOpenCloudAudit(dfr, '***SOMECLOUDSERVICENAME***', 'production', 'relative', 'week');
}).append(function(dfr) {
    return azureOpenCloudAudit(dfr, '***SOMECLOUDSERVICENAME***', 'production', 'relative', 'week');
}).then(function(dfr) {
    console.log('finished');
    phantom.exit();
}).start();
