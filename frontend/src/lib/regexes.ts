/** user_id向けの正規表現
 *  半角英小文字大文字数字および半角アンダーバーいずれかを含む
 *  4文字以上、15文字以下
 */
export const userIdRegex: RegExp = /^[a-zA-Z0-9_]{4,15}$/;

/** password向けの正規表現
 *  半角英小文字、大文字、数字、記号をそれぞれ1種類以上含む
 *  8文字以上、100文字以下
 */
export const passwordRegex: RegExp =
  /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,100}$/;

/** email向けの正規表現
 *  HTML標準に遵守
 *  https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
 */
export const emailRegex: RegExp =
  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
