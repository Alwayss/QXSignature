/**
 * Created by Alwayss on 2017/12/14.
 */

const crypto = require('crypto');
const http = require('http');

function QXSignature(options) {
	this.api_url = options.api_url || "openapi.qxwz.com";

	if (!options['api_name'] || !options.sik || !options.sis) {
		throw new Error('api_name, sik, sis can\'t be blank');
	}

	this.api_name = options.api_name;
	this.sik = options.sik;
	this.sis = options.sis;
	this.api_path = "/rest/" + this.api_name + "/sik/" + this.sik;
	let result = sortByDictOrder(options.query);
	this.paramsMap = result[0];
	this.queryString = result[1];
	this.timestamp = new Date().getTime().toString();
}

/**
 * 生成签名
 * @returns {string}
 */
QXSignature.prototype.generateSign = function() {
	const that = this;
	const hmac = crypto.createHmac('sha256', that.sis);
	hmac.update(that.api_path);                                                          //请求地址
	for(let p in that.paramsMap){
		hmac.update(p);                                                                       //参数名
		hmac.update(that.paramsMap[p]);                                                       //参数值
	}
	hmac.update(that.timestamp);                                                         //当前时间戳

	return hmac.digest('hex');
};

QXSignature.prototype.run = function(cb){
	let that = this;
	let signature = that.generateSign();
	let options = {
		hostname: that.api_url,
		path: that.api_path + '?_sign=' + signature + '&' + this.queryString,
		method: 'post',
		headers:{
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
			'wz-acs-timestamp': that.timestamp
		}
	};

	let req = http.request(options, (res) => {
		let result;
		res.on('data', (data) => {
			result = data.toString();
		});

		res.on('end', () => {
			cb(result);
		});
	});

	req.on('error', (err) => {
		console.error(err);
	});

	req.end();
};

function sortByDictOrder(object){
	let keys = Object.keys(object).sort();
	let obj = {}, queryString = "";
	keys.forEach((key) => {
		obj[key] = object[key];
		queryString += key + "=" + object[key] + "&";
	});
	queryString = queryString.slice(0, -1);

	return [obj, queryString];
}

module.exports = QXSignature;