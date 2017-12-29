/**
 * Created by HuangWJ on 2017/12/29.
 */
const QXSignature = require('../index.js');

const helper = new QXSignature({
	'api_name': 'findmm.object.list',
	'sik': 'S000000GK81',
	'sis': 'eed943cc899febc6ad4ff2cd95f1a6ca26203f611346a01e748ffbc0a92e0c45',
	'query': {request: '{\"pageNo\":1,\"pageSize\":2}', about: 'test'}
});

helper.run((data) => {
	console.log(data);
});
