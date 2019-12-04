/* globals Buffer */ //eslint-disable-line no-redeclare

const crypto = require('crypto');
const url = require('url');

/**
 * Convert from 'web safe' base64 to true base64.
 *
 * @param  {string} safeEncodedString The code you want to translate
 *                                    from a web safe form.
 * @return {string} raw string
 */
function removeWebSafe(safeEncodedString) {
    return safeEncodedString.replace(/-/g, '+').replace(/_/g, '/');
}

/**
 * Convert from true base64 to 'web safe' base64
 *
 * @param  {string} encodedString The code you want to translate to a
 *                                web safe form.
 * @return {string} normalized string
 */
function makeWebSafe(encodedString) {
    return encodedString.replace(/\+/g, '-').replace(/\//g, '_');
}

/**
 * Takes a base64 code and decodes it.
 *
 * @param  {string} code The encoded data.
 * @return {string} decoded string
 */
function decodeBase64Hash(code) {
    // "new Buffer(...)" is deprecated. Use Buffer.from if it exists.
    return Buffer.from
        ? Buffer.from(code, 'base64')
        : new Buffer(code, 'base64');
}

/**
 * Takes a key and signs the data with it.
 *
 * @param  {string} key  Your unique secret key.
 * @param  {string} data The url to sign.
 * @return {string} signed string
 */
function encodeBase64Hash(key, data) {
    return crypto
        .createHmac('sha1', key)
        .update(data)
        .digest('base64');
}

module.exports = {
    /**
     * Sign a URL using a secret key.
     *
     * @param  {string} path   The url you want to sign.
     * @param  {string} secret Your unique secret key.
     * @return {string} signed string
     */
    sign: function sign(path, secret) {
        const uri = url.parse(path);
        const safeSecret = decodeBase64Hash(removeWebSafe(secret));
        const hashedSignature = makeWebSafe(
            encodeBase64Hash(safeSecret, uri.path)
        );
        return '&signature=' + hashedSignature;
    }
};
