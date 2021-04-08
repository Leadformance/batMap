import crypto from 'crypto';
import url from 'url';

export class GmapsPremium {
  /**
   * Sign a URL using a secret key.
   *
   * @param  {string} path   The url you want to sign.
   * @param  {string} secret Your unique secret key.
   * @return {string}
   */
  static sign(path: string, secret: string): string {
    const uri = url.parse(path); // TODO: replace deprecated

    const safeSecret = GmapsPremium.decodeBase64Hash(
      GmapsPremium.removeWebSafe(secret),
    );

    const hashedSignature = GmapsPremium.makeWebSafe(
      GmapsPremium.encodeBase64Hash(safeSecret, uri.path as string),
    );

    return '&signature=' + hashedSignature;
  }

  /**
   * Convert from 'web safe' base64 to true base64.
   *
   * @param  {string} safeEncodedString The code you want to translate
   *                                    from a web safe form.
   * @return {string}
   */
  private static removeWebSafe(safeEncodedString: string): string {
    return safeEncodedString.replace(/-/g, '+').replace(/_/g, '/');
  }

  /**
   * Convert from true base64 to 'web safe' base64
   *
   * @param  {string} encodedString The code you want to translate to a
   *                                web safe form.
   * @return {string}
   */
  private static makeWebSafe(encodedString: string): string {
    return encodedString.replace(/\+/g, '-').replace(/\//g, '_');
  }

  /**
   * Takes a base64 code and decodes it.
   *
   * @param  {string} code The encoded data.
   * @return {string}
   */
  private static decodeBase64Hash(code: string): Buffer {
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
   * @return {string}
   */
  private static encodeBase64Hash(
    key: crypto.BinaryLike | crypto.KeyObject,
    data: string,
  ): string {
    return crypto.createHmac('sha1', key).update(data).digest('base64');
  }
}
