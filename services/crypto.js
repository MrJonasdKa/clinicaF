import CryptoJS from 'crypto-js';

const SECRET_KEY = 'onlyyouyy';

export function encryptData(data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
}

export function decryptData(data) {
    if (!data) {
        return null;
    }
    const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    try {
        return JSON.parse(decryptedData);
    } catch (error) {
        console.error("Error al desencriptar y analizar los datos:", error);
        return null;
    }
}
