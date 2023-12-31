const CryptoJS = require('crypto-js');
const MD5 = require('md5');
const {AES_ENCRYPT} = require("../configs/app.config");

exports.encryptMessage = (data = '') => {
    const cipher = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(AES_ENCRYPT.ENC_KEY), {
        iv: CryptoJS.enc.Utf8.parse(AES_ENCRYPT.IV),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    });
    return cipher.toString();
}

exports.decryptMessage = (data = '') => {
    const decryptedBytes = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(AES_ENCRYPT.ENC_KEY), {
        iv: CryptoJS.enc.Utf8.parse(AES_ENCRYPT.IV),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    });    
    return decryptedBytes.toString(CryptoJS.enc.Utf8);
}

exports.encryptMdData = (data = '') => MD5(data)
