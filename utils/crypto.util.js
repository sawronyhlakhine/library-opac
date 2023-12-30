const CryptoJS = require('crypto-js')
const MD5 = require('md5')

exports.encryptMessage = (data = '', ENC_KEY, IV) => {
    const cipher = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(ENC_KEY), {
        iv: CryptoJS.enc.Utf8.parse(IV),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    });
    return cipher.toString();
}

exports.decryptMessage = (data = '', ENC_KEY, IV) => {
    const decryptedBytes = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(ENC_KEY), {
        iv: CryptoJS.enc.Utf8.parse(IV),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    });    
    return decryptedBytes.toString(CryptoJS.enc.Utf8);
}

exports.encryptMdData = (data = '') => MD5(data)
