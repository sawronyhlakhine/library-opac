/* Helper Methods */
module.exports.isEmpty = function (obj) {
	if (typeof obj === 'undefined') return true;
	if (!obj) return true;
	if (typeof obj === 'number' && isNaN(obj)) return true;
	if (typeof obj === 'string' && obj == '') return true;
	if (typeof obj === 'object') 
	{
		if (Array.isArray(obj) && obj.length == 0) 
			return true;
		else 
		{
			var temp = '';
			try {
				temp = JSON.stringify(obj);
			} catch (error) {
				temp = '' + obj;
			}
			temp = temp.replace(/\s/g, '').replace(/^\{(.*)\}$/, '$1').replace(/^\[(.*)\]$/, '$1').replace(/\s/g, '');
			if (temp == '') return true;
		}
	}
	return false;
}

module.exports.isEmptyString = function (str) {
	if (typeof str !== 'string') return true;
	if (str === '') return true;
	return false;
}

module.exports.isEmptyNumber = function (num) {
	if (typeof num !== 'number') return true;
	if (num === 0) return true;
	return false;
}

module.exports.isEmptyObject = function (obj) {
	if (typeof obj !== 'object') return true;
	if (obj === null) return true;
	return false;
}

module.exports.isEmptyArray = function (arr) {
	if (typeof arr !== 'object') return true;
	if (arr === null) return true;
	if (!Array.isArray(arr)) return true;
	if (arr.length < 1) return true;
	return false;
}

module.exports.isArray = function (arr) {
	if (typeof arr !== 'object') return false;
	if (arr === null) return false;
	return Array.isArray(arr);
}

module.exports.hasKey = function (obj, key) {
	if (typeof obj !== 'object') return false;
	if (obj === null) return false;

	if (typeof key === 'undefined') return false;
	if (key === null) return false;
	if (typeof key === 'string' && key === '') return false;

	return (typeof obj[key] !== 'undefined');
}

module.exports.hasValNotEmpty = function (obj, key) {
	if (typeof obj !== 'object') return false;
	if (obj === null) return false;

	if (typeof key === 'undefined') return false;
	if (key === null) return false;
	if (typeof key === 'string' && key === '') return false;

	if (typeof obj[key] === 'undefined') return false;
	if (obj[key] === null) return false;
	if (typeof obj[key] === 'string' && obj[key] === '') return false;
	if (typeof obj[key] === 'number' && obj[key] === 0) return false;

	return true;
}

/* URL Methods */
module.exports.urlDecode = function (text) {
	if (text == '') return text;
	var exps = [
		/%0A/g, /%0D/g, /%20/g, /%23/g, /%24/g, /%25/g, /%26/g, /%2B/g,
		/%2C/g, /%2F/g, /%3A/g, /%3B/g, /%3D/g, /%3F/g, /%40/g, /%5B/g,
		/%5D/g, /%22/g, /%3C/g, /%3E/g, /%5E/g, /%60/g, /%7B/g, /%7C/g,
		/%7D/g
	];
	console.log('urlDecode = ' + text);
	for (var i in exps) {
		text = text.replace(exps[i], function (x) {
			x = x.substr(1);
			return String.fromCharCode(parseInt(x, 16));
		});
	}
	return text;
}

module.exports.urlEncode = function (text) {
	if (text == '') return text;
	// \s\n\r!#$%&'\(\)\*\+,/:;=\?@\[\]\"\-.<>\\^_`\{|\}~
	return text.replace(/%/g, '%25')
		.replace(/\n/g, '%0A')
		.replace(/\r/g, '%0D')
		.replace(/\s/g, '%20')
		.replace(/[#$&\+,/:;=\?@\[\]\"<>\\^`\{|\}]/g, function (x) {
			return '%' + x.charCodeAt(0).toString(16).toUpperCase();
		});
}


module.exports.toSqlDate = function (dateVal, fromFormat) {
	if (typeof fromFormat != 'string' || fromFormat == '') 
	{
		fromFormat = 'DD/MM/YYYY';
	}

	var dateObj = new Date();
	if (dateVal == null || !dateVal || dateVal == '') return "";

	if (typeof dateVal === 'string')
	{
		dateObj = date.parse(dateVal, fromFormat);
		if (isNaN(dateObj)) 
		{
			console.log("IS NaN : ", dateObj);
			dateObj = new Date(dateVal);
		}
	} 
	else if (typeof dateVal === 'object' && typeof dateVal.getTime === 'function') dateObj = new Date(dateVal.getTime());

	if (dateObj && typeof dateObj.getTime === 'function') return date.format(dateObj, 'YYYY-MM-DD');

	return "";
}

module.exports.toSqlDateTime = function (dateVal, fromFormat) {
	if (typeof fromFormat != 'string' || fromFormat == '') fromFormat = 'DD/MM/YYYY';

	var dateObj = new Date();
	if (dateVal == null || !dateVal || dateVal == '') return "";
	if (typeof dateVal === 'string') 
	{
		dateObj = date.parse(dateVal, fromFormat);
		if (isNaN(dateObj)) dateObj = new Date(dateVal);

	} 
	else if (typeof dateVal === 'object' && typeof dateVal.getTime === 'function') dateObj = new Date(dateVal.getTime());

	if (dateObj && typeof dateObj.getTime === 'function') 
		return date.format(dateObj, 'YYYY-MM-DD HH:mm:ss');

	return "";
}

module.exports.toSqlTime = function (dateVal, fromFormat) {
	if (typeof fromFormat != 'string' || fromFormat == '') fromFormat = 'HH:mm:ss';

	var dateObj = new Date();
	if (dateVal == null || !dateVal || dateVal == '') return "";

	if (typeof dateVal === 'string') 
	{
		dateObj = date.parse(dateVal, fromFormat);
		if (isNaN(dateObj)) dateObj = new Date(dateVal);
	} 
	else if (typeof dateVal === 'object' && typeof dateVal.getTime === 'function') dateObj = new Date(dateVal.getTime());

	if (dateObj && typeof dateObj.getTime === 'function') 
		return date.format(dateObj, 'HH:mm:ss');

	return "";
}

module.exports.toDisplayDate = function (dateVal, fromFormat) {
	if (typeof format != 'string' || format == '') format = 'DD/MM/YYYY';
	if (dateVal == null || !dateVal || dateVal == '') return "";

	var dateObj = new Date();
	if (typeof dateVal === 'string' && dateVal != '') 
	{
		var fromFormat = 'YYYY-MM-DD';
		if (dateVal.length > 10) fromFormat = 'YYYY-MM-DD HH:mm:ss';

		dateObj = date.parse(dateVal, fromFormat);
	} 
	else if (typeof dateVal === 'object' && typeof dateVal.getTime === 'function') dateObj = new Date(dateVal.getTime());

	if (dateObj && typeof dateObj.getTime === 'function') return date.format(dateObj, format);

	return "";
}

module.exports.toDisplayDateTime = function (dateVal, fromFormat) {
	if (typeof format != 'string' || format == '') format = 'DD/MM/YYYY HH:mm:ss';
	if (dateVal == null || !dateVal || dateVal == '') return "";

	var dateObj = new Date();
	if (typeof dateVal === 'string' && dateVal != '')
	{
		var fromFormat = 'YYYY-MM-DD';
		if (dateVal.length > 10) fromFormat = 'YYYY-MM-DD HH:mm:ss';
		dateObj = date.parse(dateVal, fromFormat);
	} 
	else if (typeof dateVal === 'object' && typeof dateVal.getTime === 'function') dateObj = new Date(dateVal.getTime());

	if (dateObj && typeof dateObj.getTime === 'function') return date.format(dateObj, format);
	return "";
}

//random code
module.exports.generateRandomCode = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    length || (length = 16);
    for (let i = 0; i < length; i++ ) 
	{
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}

module.exports.zFill = function(num, len) {
	var str = '' + Array(len).join("0") + num;
	return str.slice(-Math.max(('' + num).length, len));
}

module.exports.slugMe = (stringValue) => {
	let stringArr = stringValue.split(" "),
		slugValue = "";
	for (let i = 0; i < stringArr.length; i++)
	{
		slugValue += stringArr[i].slice(0,1).toLowerCase();
	}
    return slugValue;
}